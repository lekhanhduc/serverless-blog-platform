package com.javabuilder.controller;

import com.javabuilder.dto.ApiResponse;
import com.javabuilder.dto.LoginRequest;
import com.javabuilder.dto.LoginResponse;
import com.javabuilder.service.AuthenticationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    @PostMapping("/login")
    public ApiResponse<LoginResponse> login(@RequestBody LoginRequest request) {
        LoginResponse response = authenticationService.login(request);
        return ApiResponse.<LoginResponse>builder()
                .code(200)
                .data(response)
                .build();
    }
}
