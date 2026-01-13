package com.javabuilder.repository;

import com.javabuilder.entity.Profile;
import org.springframework.stereotype.Repository;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbEnhancedClient;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbTable;
import software.amazon.awssdk.enhanced.dynamodb.TableSchema;
import software.amazon.awssdk.enhanced.dynamodb.model.ScanEnhancedRequest;

import java.util.List;
import java.util.stream.Collectors;

@Repository
public class ProfileRepository {

    private static final String PROFILE_SK = "PROFILE";
    private final DynamoDbTable<Profile> table;

    public ProfileRepository(DynamoDbEnhancedClient enhancedClient, String dynamoDbTableName) {
        this.table = enhancedClient.table(dynamoDbTableName, TableSchema.fromBean(Profile.class));
    }

    public List<String> findAllEmailsExcept(String excludeUsername) {
        return table.scan(ScanEnhancedRequest.builder().build())
            .items()
            .stream()
            .filter(p -> PROFILE_SK.equals(p.getSk()) 
                && p.getEmail() != null 
                && !excludeUsername.equals(p.getUsername()))
            .map(Profile::getEmail)
            .collect(Collectors.toList());
    }
}
