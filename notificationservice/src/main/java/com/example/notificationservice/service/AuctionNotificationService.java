package com.example.notificationservice.service;

import com.example.notificationservice.entity.Notification;
import com.example.notificationservice.event.AuctionCanceledEvent;
import com.example.notificationservice.event.AuctionEndedEvent;
import com.example.notificationservice.event.OutbidEvent;
import com.example.notificationservice.repository.NotificationRepository;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@AllArgsConstructor
public class AuctionNotificationService {

    private NotificationRepository notificationRepository;
    private NotificationWebSocketService webSocketService;

    @RabbitListener(queues = "${app.rabbitmq.auction.queue.outbid}")
    public void handleOutbidEvent(OutbidEvent event) {
        // oldHighestBidder gets a notification
        Long oldBidder = event.getOldHighestBidderId();
        if (oldBidder != null) {
            Notification notif = Notification.builder()
                    .userId(oldBidder)
                    .auctionId(event.getAuctionId())
                    .title("You got outbid!")
                    .message("Someone (User " + event.getNewHighestBidderId()
                            + ") placed a higher bid: " + event.getNewHighestBidAmount())
                    .timestamp(LocalDateTime.now())
                    .isRead(false)
                    .build();

            notificationRepository.save(notif);
            // push to WebSocket
            webSocketService.sendNotification(oldBidder, notif);
        }
    }

    @RabbitListener(queues = "${app.rabbitmq.auction.queue.canceled}")
    public void handleAuctionCanceledEvent(AuctionCanceledEvent event) {
        for(Long userId : event.getInvolvedUserIds()) {
            System.out.println(userId);
            Notification notif = Notification.builder()
                    .userId(userId)
                    .auctionId(event.getAuctionId())
                    .title("Auction Canceled")
                    .message("Auction " + event.getAuctionId() + " was canceled.")
                    .timestamp(LocalDateTime.now())
                    .isRead(false)
                    .build();

            notificationRepository.save(notif);
            webSocketService.sendNotification(userId, notif);
        }
    }

    // AuctionEndedEvent if you want
    @RabbitListener(queues = "${app.rabbitmq.auction.queue.ended}")
    public void handleAuctionEndedEvent(AuctionEndedEvent event) {
        for(Long userId : event.getInvolvedUserIds()) {
            Notification notif = new Notification();
            notif.setUserId(userId);
            notif.setAuctionId(event.getAuctionId());
            notif.setTimestamp(LocalDateTime.now());
            notif.setRead(false);

            if(event.isHasWinner()) {
                if(userId.equals(event.getWinnerUserId())) {
                    notif.setTitle("You won the auction!");
                    notif.setMessage("Congrats! You won Auction " + event.getAuctionId());
                } else {
                    notif.setTitle("Auction ended");
                    notif.setMessage("Auction " + event.getAuctionId() + " ended. Winner: user " + event.getWinnerUserId());
                }
            } else {
                notif.setTitle("Auction ended (no winner)");
                notif.setMessage("Auction " + event.getAuctionId() + " ended with no winner");
            }

            notificationRepository.save(notif);
            webSocketService.sendNotification(userId, notif);
        }
    }
}

