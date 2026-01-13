package com.javabuilder.repository;

import com.javabuilder.dto.PageResponse;
import com.javabuilder.entity.Post;
import org.springframework.stereotype.Repository;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbEnhancedClient;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbTable;
import software.amazon.awssdk.enhanced.dynamodb.Key;
import software.amazon.awssdk.enhanced.dynamodb.TableSchema;
import software.amazon.awssdk.enhanced.dynamodb.model.Page;
import software.amazon.awssdk.enhanced.dynamodb.model.QueryConditional;
import software.amazon.awssdk.enhanced.dynamodb.model.QueryEnhancedRequest;
import software.amazon.awssdk.services.dynamodb.model.AttributeValue;

import java.util.*;

@Repository
public class PostRepository {

    private static final String POST_PREFIX = "POST#";
    private static final String METADATA_SK = "METADATA";

    private final DynamoDbTable<Post> table;

    public PostRepository(DynamoDbEnhancedClient enhancedClient, String dynamoDbTableName) {
        this.table = enhancedClient.table(dynamoDbTableName, TableSchema.fromBean(Post.class));
    }

    public void save(Post post) {
        table.putItem(post);
    }

    public Optional<Post> findById(String postId) {
        String pk = postId.startsWith(POST_PREFIX) ? postId : POST_PREFIX + postId;
        Key key = Key.builder().partitionValue(pk).sortValue(METADATA_SK).build();
        return Optional.ofNullable(table.getItem(key));
    }

    public void delete(String postId) {
        String pk = postId.startsWith(POST_PREFIX) ? postId : POST_PREFIX + postId;
        Key key = Key.builder().partitionValue(pk).sortValue(METADATA_SK).build();
        table.deleteItem(key);
    }

    public PageResponse<Post> findAllByAuthor(String authorId, int size, String nextToken) {
        // Query posts by author using GSI or scan with filter
        // For simplicity, using scan here - in production use GSI
        var scanRequest = software.amazon.awssdk.enhanced.dynamodb.model.ScanEnhancedRequest.builder()
                .limit(size)
                .build();

        if (nextToken != null && !nextToken.isEmpty()) {
            scanRequest = software.amazon.awssdk.enhanced.dynamodb.model.ScanEnhancedRequest.builder()
                    .limit(size)
                    .exclusiveStartKey(decodeToken(nextToken))
                    .build();
        }

        Page<Post> page = table.scan(scanRequest).iterator().next();

        List<Post> posts = page.items().stream()
                .filter(p -> METADATA_SK.equals(p.getSk()))
                .filter(p -> authorId.equals(p.getAuthorId()))
                .toList();

        String newNextToken = page.lastEvaluatedKey() != null
                ? encodeToken(page.lastEvaluatedKey())
                : null;

        return PageResponse.<Post>builder()
                .size(posts.size())
                .nextToken(newNextToken)
                .hasMore(newNextToken != null)
                .result(posts)
                .build();
    }

    public PageResponse<Post> findAll(int size, String nextToken) {
        var scanRequestBuilder = software.amazon.awssdk.enhanced.dynamodb.model.ScanEnhancedRequest.builder()
                .limit(size);

        if (nextToken != null && !nextToken.isEmpty()) {
            scanRequestBuilder.exclusiveStartKey(decodeToken(nextToken));
        }

        Page<Post> page = table.scan(scanRequestBuilder.build()).iterator().next();

        List<Post> posts = page.items().stream()
                .filter(p -> METADATA_SK.equals(p.getSk()))
                .toList();

        String newNextToken = page.lastEvaluatedKey() != null
                ? encodeToken(page.lastEvaluatedKey())
                : null;

        return PageResponse.<Post>builder()
                .size(posts.size())
                .nextToken(newNextToken)
                .hasMore(newNextToken != null)
                .result(posts)
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
