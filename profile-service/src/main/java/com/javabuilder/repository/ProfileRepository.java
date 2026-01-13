package com.javabuilder.repository;

import com.javabuilder.dto.PageResponse;
import com.javabuilder.entity.Profile;
import org.springframework.stereotype.Repository;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbEnhancedClient;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbTable;
import software.amazon.awssdk.enhanced.dynamodb.Key;
import software.amazon.awssdk.enhanced.dynamodb.TableSchema;
import software.amazon.awssdk.enhanced.dynamodb.model.Page;
import software.amazon.awssdk.enhanced.dynamodb.model.ScanEnhancedRequest;
import software.amazon.awssdk.services.dynamodb.model.AttributeValue;

import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public class ProfileRepository {

    private static final String USER_PREFIX = "USER#";
    private static final String PROFILE_SK = "PROFILE";

    private final DynamoDbTable<Profile> table;

    public ProfileRepository(DynamoDbEnhancedClient enhancedClient, String dynamoDbTableName) {
        this.table = enhancedClient.table(dynamoDbTableName, TableSchema.fromBean(Profile.class));
    }

    public void save(Profile profile) {
        if (profile.getSk() == null) {
            profile.setSk(PROFILE_SK);
        }
        table.putItem(profile);
    }

    public Optional<Profile> findByUserId(String userId) {
        String pk = userId.startsWith(USER_PREFIX) ? userId : USER_PREFIX + userId;
        Key key = Key.builder().partitionValue(pk).sortValue(PROFILE_SK).build();
        return Optional.ofNullable(table.getItem(key));
    }

    public void delete(String userId) {
        String pk = userId.startsWith(USER_PREFIX) ? userId : USER_PREFIX + userId;
        Key key = Key.builder().partitionValue(pk).sortValue(PROFILE_SK).build();
        table.deleteItem(key);
    }

    public PageResponse<Profile> findAll(int size, String nextToken) {
        ScanEnhancedRequest.Builder requestBuilder = ScanEnhancedRequest.builder()
                .limit(size);

        if (nextToken != null && !nextToken.isEmpty()) {
            requestBuilder.exclusiveStartKey(decodeToken(nextToken));
        }

        Page<Profile> page = table.scan(requestBuilder.build()).iterator().next();

        List<Profile> profiles = page.items().stream()
                .filter(p -> PROFILE_SK.equals(p.getSk()))
                .toList();

        String newNextToken = page.lastEvaluatedKey() != null
                ? encodeToken(page.lastEvaluatedKey())
                : null;

        return PageResponse.<Profile>builder()
                .size(profiles.size())
                .nextToken(newNextToken)
                .hasMore(newNextToken != null)
                .result(profiles)
                .build();
    }

    private String encodeToken(Map<String, AttributeValue> lastKey) {
        String pk = lastKey.get("pk").s();
        String sk = lastKey.get("sk").s();
        return Base64.getEncoder().encodeToString((pk + "|" + sk).getBytes());
    }

    private Map<String, AttributeValue> decodeToken(String token) {
        String decoded = new String(Base64.getDecoder().decode(token));
        String[] parts = decoded.split("\\|");
        Map<String, AttributeValue> key = new HashMap<>();
        key.put("pk", AttributeValue.builder().s(parts[0]).build());
        key.put("sk", AttributeValue.builder().s(parts[1]).build());
        return key;
    }
}
