package com.example.auctionservice.service;

import com.example.auctionservice.entity.Auction;

import java.time.LocalDateTime;
import java.util.List;

public interface AuctionService {

    Auction startAuction(Long productId, LocalDateTime startTime, LocalDateTime endTime,
                         Double startBid, Double bidIncrement);

    Auction updateAuction(Auction auction);

    Auction getAuction(Long auctionId);

    List<Auction> getActiveAuctions();

    List<Auction> getEndedAuctions();

    List<Auction> getMyAuctions(Long ownerId);

    Auction cancelAuction(Long auctionId);

    Auction endAuction(Long auctionId);
}
