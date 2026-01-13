package com.javabuilder.repository;

import com.javabuilder.entity.Profile;
import org.springframework.stereotype.Repository;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbEnhancedClient;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbTable;
import software.amazon.awssdk.enhanced.dynamodb.Key;
import software.amazon.awssdk.enhanced.dynamodb.TableSchema;

import java.util.Optional;

@Repository
public class ProfileRepository {

    private static final String USER_PREFIX = "USER#";
    private static final String PROFILE_SK = "PROFILE";

    private final DynamoDbTable<Profile> table;

    public ProfileRepository(DynamoDbEnhancedClient enhancedClient, String dynamoDbTableName) {
        this.table = enhancedClient.table(dynamoDbTableName, TableSchema.fromBean(Profile.class));
    }

    public Optional<Profile> findByUserId(String userId) {
        String pk = userId.startsWith(USER_PREFIX) ? userId : USER_PREFIX + userId;
        Key key = Key.builder().partitionValue(pk).sortValue(PROFILE_SK).build();
        return Optional.ofNullable(table.getItem(key));
    }
}
