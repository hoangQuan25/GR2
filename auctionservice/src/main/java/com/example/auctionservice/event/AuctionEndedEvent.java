package com.example.auctionservice.event;

import lombok.Data;

import java.util.List;

@Data
public class AuctionEndedEvent {
    private Long auctionId;
    private boolean hasWinner;
    private Long winnerUserId; // or null
    private List<Long> involvedUserIds; // e.g. all bidders + seller
    // getters/setters
}
