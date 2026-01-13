package com.javabuilder.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.services.sns.SnsClient;

@Configuration
public class SnsClientConfiguration {

    @Bean
    public SnsClient snsClient() {
        return SnsClient.create();
    }
}
