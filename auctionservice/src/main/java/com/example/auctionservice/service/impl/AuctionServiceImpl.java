package com.example.auctionservice.service.impl;

import com.example.auctionservice.entity.Auction;
import com.example.auctionservice.entity.Product;
import com.example.auctionservice.repository.AuctionRepository;
import com.example.auctionservice.service.AuctionService;
import com.example.auctionservice.service.ProductService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AuctionServiceImpl implements AuctionService {
    private final AuctionRepository auctionRepository;
    private final ProductService productService;

    public AuctionServiceImpl(AuctionRepository auctionRepository, ProductService productService) {
        this.auctionRepository = auctionRepository;
        this.productService = productService;
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
        if ("ACTIVE".equals(auction.getStatus())) {
            auction.setStatus("CANCELED");
            return auctionRepository.save(auction);
        }
        throw new RuntimeException("Auction is not active or cannot be canceled");
    }

    public Auction endAuction(Long auctionId) {
        Auction auction = getAuction(auctionId);
        if ("ACTIVE".equals(auction.getStatus())) {
            auction.setStatus("ENDED");
            return auctionRepository.save(auction);
        }
        throw new RuntimeException("Auction is not active or cannot be ended");
    }

}
