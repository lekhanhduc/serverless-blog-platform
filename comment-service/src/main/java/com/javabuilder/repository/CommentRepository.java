package com.javabuilder.repository;

import com.javabuilder.dto.PageResponse;
import com.javabuilder.entity.Comment;
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
public class CommentRepository {

    private static final String POST_PREFIX = "POST#";
    private static final String COMMENT_PREFIX = "COMMENT#";

    private final DynamoDbTable<Comment> table;

    public CommentRepository(DynamoDbEnhancedClient enhancedClient, String dynamoDbTableName) {
        this.table = enhancedClient.table(dynamoDbTableName, TableSchema.fromBean(Comment.class));
    }

    public void save(Comment comment) {
        table.putItem(comment);
    }

    public Optional<Comment> findById(String postId, String commentId) {
        String pk = postId.startsWith(POST_PREFIX) ? postId : POST_PREFIX + postId;
        String sk = commentId.startsWith(COMMENT_PREFIX) ? commentId : COMMENT_PREFIX + commentId;
        Key key = Key.builder().partitionValue(pk).sortValue(sk).build();
        return Optional.ofNullable(table.getItem(key));
    }

    public void delete(String postId, String commentId) {
        String pk = postId.startsWith(POST_PREFIX) ? postId : POST_PREFIX + postId;
        String sk = commentId.startsWith(COMMENT_PREFIX) ? commentId : COMMENT_PREFIX + commentId;
        Key key = Key.builder().partitionValue(pk).sortValue(sk).build();
        table.deleteItem(key);
    }

    public PageResponse<Comment> findByPostId(String postId, int size, String nextToken) {
        String pk = postId.startsWith(POST_PREFIX) ? postId : POST_PREFIX + postId;

        QueryConditional queryConditional = QueryConditional.sortBeginsWith(
                Key.builder().partitionValue(pk).sortValue(COMMENT_PREFIX).build()
        );

        QueryEnhancedRequest.Builder requestBuilder = QueryEnhancedRequest.builder()
                .queryConditional(queryConditional)
                .limit(size);

        if (nextToken != null && !nextToken.isEmpty()) {
            requestBuilder.exclusiveStartKey(decodeToken(nextToken));
        }

        Page<Comment> page = table.query(requestBuilder.build()).iterator().next();

        List<Comment> comments = page.items();

        String newNextToken = page.lastEvaluatedKey() != null
                ? encodeToken(page.lastEvaluatedKey())
                : null;

        return PageResponse.<Comment>builder()
                .size(comments.size())
                .nextToken(newNextToken)
                .hasMore(newNextToken != null)
                .result(comments)
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
