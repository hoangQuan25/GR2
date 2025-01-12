package com.example.auctionservice.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Auction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Link to Product
    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    private LocalDateTime startTime;
    private LocalDateTime endTime;

    private Double startBid;   // e.g. 30.0
    private Double bidIncrement; // e.g. 10.0 (the smallest gap)
    private Double currentBid; // track highest bid so far

    private Long highestBidderId; // store userId of highest bidder

    // Auction status: e.g. "PENDING", "ACTIVE", "ENDED", "CANCELED"
    private String status;
}