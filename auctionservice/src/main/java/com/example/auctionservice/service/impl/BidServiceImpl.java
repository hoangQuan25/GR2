package com.example.auctionservice.service.impl;

import com.example.auctionservice.entity.Auction;
import com.example.auctionservice.entity.Bid;
import com.example.auctionservice.event.OutbidEvent;
import com.example.auctionservice.repository.BidRepository;
import com.example.auctionservice.service.AuctionService;
import com.example.auctionservice.service.BidService;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class BidServiceImpl implements BidService {

    private final BidRepository bidRepository;
    private final AuctionService auctionService;
    private final RabbitTemplate rabbitTemplate;

    @Value("${app.rabbitmq.exchange}")
    private String exchange;

    @Value("${app.rabbitmq.routingkey.outbid}")
    private String outbidRoutingKey;


    public BidServiceImpl(BidRepository bidRepository,
                          AuctionService auctionService,
                          RabbitTemplate rabbitTemplate) {
        this.bidRepository = bidRepository;
        this.auctionService = auctionService;
        this.rabbitTemplate = rabbitTemplate;
    }

    public Bid placeBid(Long auctionId, Long userId, Double amount) {
        Auction auction = auctionService.getAuction(auctionId);

        // Check if auction is active and not ended
        LocalDateTime now = LocalDateTime.now();
        if (!"ACTIVE".equals(auction.getStatus()) || now.isAfter(auction.getEndTime())) {
            throw new RuntimeException("Auction is not active");
        }

        // Check if amount >= currentBid + bidIncrement
        double minAllowed = auction.getCurrentBid() + auction.getBidIncrement();
        if (amount < minAllowed) {
            throw new RuntimeException("Bid is too low");
        }

        Long oldHighestBidder = auction.getHighestBidderId();

        // Save bid
        Bid bid = Bid.builder()
                .auctionId(auctionId)
                .userId(userId)
                .amount(amount)
                .bidTime(LocalDateTime.now())
                .build();
        bidRepository.save(bid);

        // Update auction’s currentBid and highestBidder
        auction.setCurrentBid(amount);
        auction.setHighestBidderId(userId);
        auctionService.updateAuction(auction);  // create update method or reuse save

        if (oldHighestBidder != null && !oldHighestBidder.equals(userId)) {
            OutbidEvent outbidEvent = new OutbidEvent();
            outbidEvent.setAuctionId(auctionId);
            outbidEvent.setOldHighestBidderId(oldHighestBidder);
            outbidEvent.setNewHighestBidderId(userId);
            outbidEvent.setNewHighestBidAmount(amount);

            rabbitTemplate.convertAndSend(exchange, outbidRoutingKey, outbidEvent);
        }

        return bid;
    }

    public List<Bid> getBidsForAuction(Long auctionId) {
        return bidRepository.findByAuctionId(auctionId);
    }
}