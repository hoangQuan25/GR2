package com.example.auctionservice.event;

import lombok.Data;

@Data
public class OutbidEvent {
    private Long auctionId;
    private Long oldHighestBidderId;
    private Long newHighestBidderId;
    private Double newHighestBidAmount;

    public OutbidEvent() {}
    // getters, setters, constructor
}
