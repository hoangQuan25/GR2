package com.example.auctionservice.service.impl;

import com.example.auctionservice.entity.Auction;
import com.example.auctionservice.entity.Bid;
import com.example.auctionservice.entity.Product;
import com.example.auctionservice.event.AuctionCanceledEvent;
import com.example.auctionservice.event.AuctionEndedEvent;
import com.example.auctionservice.repository.AuctionRepository;
import com.example.auctionservice.repository.BidRepository;
import com.example.auctionservice.service.AuctionService;
import com.example.auctionservice.service.ProductService;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class AuctionServiceImpl implements AuctionService {

    private final RabbitTemplate rabbitTemplate;
    private final AuctionRepository auctionRepository;
    private final BidRepository bidRepository;
    private final ProductService productService;

    @Value("${app.rabbitmq.exchange}")
    private String exchange;

    @Value("${app.rabbitmq.routingkey.auctionEnded}")
    private String auctionEndedRoutingKey;

    @Value("${app.rabbitmq.routingkey.auctionCanceled}")
    private String cancelRoutingKey;

    public AuctionServiceImpl(AuctionRepository auctionRepository,
                              BidRepository bidRepository,
                              ProductService productService,
                              RabbitTemplate rabbitTemplate) {
        this.auctionRepository = auctionRepository;
        this.bidRepository = bidRepository;
        this.productService = productService;
        this.rabbitTemplate = rabbitTemplate;
    }


    public Auction startAuction(Long productId, LocalDateTime startTime, LocalDateTime endTime,
                                Double startBid, Double bidIncrement) {

        Product product = productService.getProduct(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Auction auction = Auction.builder()
                .product(product)
                .startTime(startTime)
                .endTime(endTime)
                .startBid(startBid)
                .bidIncrement(bidIncrement)
                .currentBid(0.0)
                .status("ACTIVE")
                .build();

        return auctionRepository.save(auction);
    }

    public Auction updateAuction(Auction auction) {
        return auctionRepository.save(auction);
    }

    public Auction getAuction(Long auctionId) {
        return auctionRepository.findById(auctionId)
                .orElseThrow(() -> new RuntimeException("Auction not found"));
    }

    public List<Auction> getActiveAuctions() {
        return auctionRepository.findByStatus("ACTIVE");
    }

    public List<Auction> getEndedAuctions() {
        return auctionRepository.findByStatus("ENDED");
    }

    public List<Auction> getMyAuctions(Long ownerId) {
        return auctionRepository.findByProductOwnerId(ownerId);
    }

    public Auction cancelAuction(Long auctionId) {
        Auction auction = getAuction(auctionId);
        if (!"ACTIVE".equals(auction.getStatus())) {
            throw new RuntimeException("Auction is not active or cannot be canceled");
        }

        auction.setStatus("CANCELED");
        auctionRepository.save(auction);

        List<Long> involvedUserIds = gatherInvolvedUserIds(auction);
        AuctionCanceledEvent event = new AuctionCanceledEvent();
        event.setAuctionId(auctionId);
        event.setInvolvedUserIds(involvedUserIds);

        rabbitTemplate.convertAndSend(exchange, cancelRoutingKey, event);

        return auction;
    }

    public Auction endAuction(Long auctionId) {
        Auction auction = getAuction(auctionId);
        if (!"ACTIVE".equals(auction.getStatus())) {
            throw new RuntimeException("Auction is not active or cannot be ended");
        }

        auction.setStatus("ENDED");
        auctionRepository.save(auction);

        AuctionEndedEvent event = new AuctionEndedEvent();
        event.setAuctionId(auctionId);
        boolean hasWinner = auction.getCurrentBid() != null && auction.getCurrentBid() > 0;
        event.setHasWinner(hasWinner);
        event.setWinnerUserId(auction.getHighestBidderId());
        // gather all userIds who ever bid + the seller:
        List<Long> userIds = gatherInvolvedUserIds(auction);
        event.setInvolvedUserIds(userIds);

        rabbitTemplate.convertAndSend(exchange, auctionEndedRoutingKey, event);
        return auction;
    }

    private List<Long> gatherInvolvedUserIds(Auction auction) {

        List<Long> userIds = new ArrayList<>();
        userIds.add(auction.getProduct().getOwnerId());

        List<Bid> bids = bidRepository.findByAuctionId(auction.getId());
        for (Bid b : bids) {
            userIds.add(b.getUserId());
        }

        return userIds;
    }

}