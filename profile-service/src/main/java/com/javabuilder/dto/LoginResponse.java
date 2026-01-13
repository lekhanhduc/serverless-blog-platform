package com.javabuilder.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class LoginResponse {
    private String accessToken;
    private String idToken;
    private String refreshToken;
    private Integer expiresIn;
}
