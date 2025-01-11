package com.example.auctionservice.service;

import com.example.auctionservice.entity.Bid;

import java.util.List;

public interface BidService {

    Bid placeBid(Long auctionId, Long userId, Double amount);

    List<Bid> getBidsForAuction(Long auctionId);
}
