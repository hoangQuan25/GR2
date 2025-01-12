package com.example.auctionservice.event;

import lombok.Data;

import java.util.List;

@Data
public class AuctionCanceledEvent {

    private Long auctionId;
    private List<Long> involvedUserIds;
}
