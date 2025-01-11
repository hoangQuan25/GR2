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

    @Value("${app.rabbitmq.queue}")
    private String queue;

    @Value("${app.rabbitmq.routingkey}")
    private String routingKey;

    // Declare Exchange
    @Bean
    public TopicExchange appExchange() {
        return new TopicExchange(exchange);
    }

    // Declare Queue
    @Bean
    public Queue appQueue() {
        return new Queue(queue);
    }

    // Bind Queue to Exchange with Routing Key
    @Bean
    public Binding declareBinding() {
        return BindingBuilder.bind(appQueue()).to(appExchange()).with(routingKey);
    }

    // Message Converter to JSON
    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    // RabbitTemplate with JSON converter (Optional if only consuming)
    @Bean
    public RabbitTemplateCustomizer rabbitTemplateCustomizer(Jackson2JsonMessageConverter converter) {
        return rabbitTemplate -> rabbitTemplate.setMessageConverter(converter);
    }
}
