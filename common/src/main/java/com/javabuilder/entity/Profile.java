package com.javabuilder.entity;

import lombok.*;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbBean;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbPartitionKey;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbSortKey;

import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@DynamoDbBean
public class Profile {
    private String pk;
    private String sk;
    private String email;
    private String username;
    private String role;
    private String avatarUrl;
    private Instant createdAt;

    @DynamoDbPartitionKey
    public String getPk() {
        return pk;
    }
    @DynamoDbSortKey
    public String getSk() {
        return sk;
    }
}
