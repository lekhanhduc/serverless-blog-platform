package com.javabuilder.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdatePostRequest {
    private String title;
    private String content;
    private String status;
    private String thumbnailUrl;
}
