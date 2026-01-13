package com.javabuilder.dto;

import lombok.Data;

@Data
public class CreatePostRequest {
    private String title;
    private String content;
    private String thumbnailUrl;
}
