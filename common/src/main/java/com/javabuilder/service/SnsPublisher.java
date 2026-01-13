package com.javabuilder.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.javabuilder.event.NotificationEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.sns.SnsClient;
import software.amazon.awssdk.services.sns.model.PublishRequest;

@Service
@RequiredArgsConstructor
@Slf4j
public class SnsPublisher {

    private final SnsClient snsClient;
    private final ObjectMapper objectMapper;

    @Value("${sns.topic.arn}")
    private String topicArn;

    public void publish(NotificationEvent event) {
        try {
            String message = objectMapper.writeValueAsString(event);
            
            snsClient.publish(PublishRequest.builder()
                .topicArn(topicArn)
                .message(message)
                .build());
                
            log.info("Published {} event to SNS", event.getEventType());
        } catch (Exception e) {
            log.error("Failed to publish event to SNS: {}", e.getMessage(), e);
        }
    }
}
