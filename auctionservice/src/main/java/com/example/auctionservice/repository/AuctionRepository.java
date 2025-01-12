package com.example.auctionservice.repository;

import com.example.auctionservice.entity.Auction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.time.LocalDateTime;

public interface AuctionRepository extends JpaRepository<Auction, Long> {
    List<Auction> findByStatus(String status);
    List<Auction> findByProductOwnerId(Long ownerId);  // for "my auctions"
    // e.g. find auctions that are active
    List<Auction> findByStatusAndEndTimeAfter(String status, LocalDateTime now);
}