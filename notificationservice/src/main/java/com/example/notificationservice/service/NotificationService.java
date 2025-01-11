package com.example.notificationservice.service;

import com.example.notificationservice.event.UserRegisteredEvent;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromMail;

    @RabbitListener(queues = "${app.rabbitmq.queue}")
    public void handleUserRegisteredEvent(UserRegisteredEvent event) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromMail);
        message.setTo(event.getEmail());
        message.setSubject("Registered at AucNet successfully!");
        message.setText(String.format("Hello %s %s,\n\nThank you for registering at our website.",
                event.getFirstName(), event.getLastName()));

        mailSender.send(message);
        System.out.println("Registration email sent to " + event.getEmail());
    }
}
