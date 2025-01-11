package com.example.auctionservice.service.impl;

import com.example.auctionservice.entity.Auction;
import com.example.auctionservice.entity.Bid;
import com.example.auctionservice.repository.BidRepository;
import com.example.auctionservice.service.AuctionService;
import com.example.auctionservice.service.BidService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class BidServiceImpl implements BidService {

    private final BidRepository bidRepository;
    private final AuctionService auctionService;

    public BidServiceImpl(BidRepository bidRepository, AuctionService auctionService) {
        this.bidRepository = bidRepository;
        this.auctionService = auctionService;
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

        return bid;
    }

    public List<Bid> getBidsForAuction(Long auctionId) {
        return bidRepository.findByAuctionId(auctionId);
    }
}
