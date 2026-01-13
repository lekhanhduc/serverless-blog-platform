package com.javabuilder.dto;

import lombok.Data;

@Data
public class CreateCommentRequest {
    private String postId;
    private String content;
    private String postTitle;
    private String postAuthorId;
    private String postAuthorName;
}
