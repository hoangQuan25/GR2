package com.example.notificationservice.service;

import com.example.notificationservice.entity.Notification;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class NotificationWebSocketService {

    private SimpMessagingTemplate messagingTemplate;

    public void sendNotification(Long userId, Notification notification) {
        System.out.println("Sending notification to WebSocket topic: /topic/user." + userId);
        // e.g. /topic/user.9
        messagingTemplate.convertAndSend("/topic/user." + userId, notification);
    }
}
