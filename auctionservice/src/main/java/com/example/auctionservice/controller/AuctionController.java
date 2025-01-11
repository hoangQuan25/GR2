package com.example.auctionservice.controller;

import com.example.auctionservice.entity.Auction;
import com.example.auctionservice.entity.Bid;
import com.example.auctionservice.service.AuctionService;
import com.example.auctionservice.service.BidService;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/auctions")
public class AuctionController {

    private final AuctionService auctionService;
    private final BidService bidService;

    public AuctionController(AuctionService auctionService, BidService bidService) {
        this.auctionService = auctionService;
        this.bidService = bidService;
    }

    @GetMapping("/active")
    public List<Auction> getActiveAuctions() {
        return auctionService.getActiveAuctions();
    }

    @GetMapping("/ended")
    public List<Auction> getEndedAuctions() {
        return auctionService.getEndedAuctions();
    }

    @GetMapping("/{auctionId}")
    public Auction getAuctionById(@PathVariable Long auctionId) {
        return auctionService.getAuction(auctionId);
    }

    @PostMapping("/{auctionId}/cancel")
    public Auction cancelAuction(@PathVariable Long auctionId) {
        return auctionService.cancelAuction(auctionId);
    }

    @PostMapping("/{auctionId}/end")
    public Auction endAuction(@PathVariable Long auctionId) {
        return auctionService.endAuction(auctionId);
    }

    // Place Bid
    @PostMapping("/{auctionId}/bid")
    public Bid placeBid(@PathVariable Long auctionId,
                        @RequestParam("userId") Long userId,
                        @RequestParam("amount") Double amount) {
        return bidService.placeBid(auctionId, userId, amount);
    }

    // Example of start auction (from productId):
    @PostMapping("/start")
    public Auction startAuction(@RequestParam Long productId,
                                @RequestParam String startTimeStr,
                                @RequestParam String endTimeStr,
                                @RequestParam Double startBid,
                                @RequestParam Double bidIncrement) {
        LocalDateTime startTime = LocalDateTime.parse(startTimeStr);
        LocalDateTime endTime = LocalDateTime.parse(endTimeStr);

        return auctionService.startAuction(productId, startTime, endTime, startBid, bidIncrement);
    }

    // get bids
    @GetMapping("/{auctionId}/bids")
    public List<Bid> getBids(@PathVariable Long auctionId) {
        return bidService.getBidsForAuction(auctionId);
    }

    @GetMapping("/my")
    public List<Auction> getMyAuctions(@RequestParam Long ownerId) {
        return auctionService.getMyAuctions(ownerId);
    }
}
