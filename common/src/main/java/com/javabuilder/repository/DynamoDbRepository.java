package com.javabuilder.repository;

import org.springframework.stereotype.Repository;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbEnhancedClient;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbTable;
import software.amazon.awssdk.enhanced.dynamodb.Key;
import software.amazon.awssdk.enhanced.dynamodb.TableSchema;
import software.amazon.awssdk.enhanced.dynamodb.model.QueryConditional;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Repository
public class DynamoDbRepository<T> {

    private final DynamoDbEnhancedClient enhancedClient;
    private final String tableName;

    public DynamoDbRepository(DynamoDbEnhancedClient enhancedClient, String dynamoDbTableName) {
        this.enhancedClient = enhancedClient;
        this.tableName = dynamoDbTableName;
    }

    public DynamoDbTable<T> getTable(Class<T> clazz) {
        return enhancedClient.table(tableName, TableSchema.fromBean(clazz));
    }

    public void save(T item, Class<T> clazz) {
        getTable(clazz).putItem(item);
    }

    public Optional<T> findByKey(String pk, String sk, Class<T> clazz) {
        Key key = Key.builder().partitionValue(pk).sortValue(sk).build();
        return Optional.ofNullable(getTable(clazz).getItem(key));
    }

    public List<T> queryByPk(String pk, Class<T> clazz) {
        QueryConditional queryConditional = QueryConditional.keyEqualTo(
                Key.builder().partitionValue(pk).build()
        );
        return getTable(clazz).query(queryConditional)
                .items()
                .stream()
                .collect(Collectors.toList());
    }

    public void delete(String pk, String sk, Class<T> clazz) {
        Key key = Key.builder().partitionValue(pk).sortValue(sk).build();
        getTable(clazz).deleteItem(key);
    }
}
