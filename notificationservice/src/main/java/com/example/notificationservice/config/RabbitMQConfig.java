package com.example.notificationservice.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.amqp.RabbitTemplateCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    @Value("${app.rabbitmq.exchange}")
    private String exchange;

    @Value("${app.rabbitmq.auction.exchange}")
    private String auctionExchange;

    @Value("${app.rabbitmq.queue}")
    private String queue;

    @Value("${app.rabbitmq.routingkey}")
    private String routingKey;

    @Value("${app.rabbitmq.auction.queue.outbid}")
    private String outbidQueue;
    @Value("${app.rabbitmq.auction.routingkey.outbid}")
    private String outbidKey;

    @Value("${app.rabbitmq.auction.queue.canceled}")
    private String canceledQueue;
    @Value("${app.rabbitmq.auction.routingkey.canceled}")
    private String canceledKey;

    @Value("${app.rabbitmq.auction.queue.ended}")
    private String endedQueue;
    @Value("${app.rabbitmq.auction.routingkey.ended}")
    private String endedKey;

    // Declare Exchange
    @Bean
    public TopicExchange appExchange() {
        return new TopicExchange(exchange);
    }

    @Bean
    public TopicExchange auctionExchange() {
        return new TopicExchange(auctionExchange);
    }

    // Declare Queue
    @Bean
    public Queue appQueue() {
        return new Queue(queue);
    }

    @Bean
    public Queue outbidQueue() {
        return new Queue(outbidQueue, true);
    }

    @Bean
    public Queue auctionCanceledQueue() {
        return new Queue(canceledQueue, true);
    }

    @Bean
    public Queue auctionEndedQueue() {
        return new Queue(endedQueue, true);
    }

    // Bind Queue to Exchange with Routing Key
    @Bean
    public Binding declareBinding() {
        return BindingBuilder.bind(appQueue()).to(appExchange()).with(routingKey);
    }

    @Bean
    public Binding bindOutbidQueue() {
        return BindingBuilder.bind(outbidQueue())
                .to(auctionExchange())
                .with(outbidKey);
    }

    @Bean
    public Binding bindCanceledQueue() {
        return BindingBuilder.bind(auctionCanceledQueue())
                .to(auctionExchange())
                .with(canceledKey);
    }

    @Bean
    public Binding bindEndedQueue() {
        return BindingBuilder.bind(auctionEndedQueue())
                .to(auctionExchange())
                .with(endedKey);
    }


    // Message Converter to JSON
    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    // RabbitTemplate with JSON converter (Optional if only consuming)
    @Bean
    public RabbitTemplateCustomizer rabbitTemplateCustomizer(MessageConverter converter) {
        return rabbitTemplate -> rabbitTemplate.setMessageConverter(converter);
    }
}
