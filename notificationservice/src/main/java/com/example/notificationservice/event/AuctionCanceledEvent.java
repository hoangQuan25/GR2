package com.example.notificationservice.event;

import lombok.Data;

import java.util.List;

@Data
public class AuctionCanceledEvent {
    private Long auctionId;
    private List<Long> involvedUserIds; // the seller + anyone who bid

    public AuctionCanceledEvent() {}
    // getters, setters
}
