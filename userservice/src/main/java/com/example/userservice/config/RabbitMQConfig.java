package com.example.userservice.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
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

    @Bean
    public TopicExchange appExchange() {
        return new TopicExchange(exchange);
    }

    @Bean
    public Queue appQueue() {
        return new Queue(queue);
    }

    @Bean
    public Binding declareBinding() {
        return BindingBuilder.bind(appQueue()).to(appExchange()).with(routingKey);
    }

    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public RabbitTemplateCustomizer rabbitTemplateCustomizer(Jackson2JsonMessageConverter converter) {
        return rabbitTemplate -> rabbitTemplate.setMessageConverter(converter);
    }
}
