package com.example.auctionservice.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Bid {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long auctionId;    // or a @ManyToOne relationship
    private Long userId;       // user placing the bid
    private Double amount;
    private LocalDateTime bidTime;
}
