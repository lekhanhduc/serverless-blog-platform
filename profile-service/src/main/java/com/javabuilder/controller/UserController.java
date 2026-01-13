package com.javabuilder.controller;

import com.javabuilder.dto.ApiResponse;
import com.javabuilder.dto.CreateUserRequest;
import com.javabuilder.dto.PageResponse;
import com.javabuilder.entity.Profile;
import com.javabuilder.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping
    public ApiResponse<Profile> createUser(@RequestBody CreateUserRequest request) {
        Profile profile = userService.createUser(request);
        return ApiResponse.<Profile>builder()
                .code(201)
                .message("User created successfully")
                .data(profile)
                .build();
    }

    @GetMapping("/{userId}")
    public ApiResponse<Profile> getUser(@PathVariable String userId) {
        return userService.getUserById(userId)
                .map(profile -> ApiResponse.<Profile>builder()
                        .code(200)
                        .data(profile)
                        .build())
                .orElse(ApiResponse.<Profile>builder()
                        .code(404)
                        .message("User not found")
                        .build());
    }

    @GetMapping("/me")
    public ApiResponse<Profile> me(@AuthenticationPrincipal Jwt jwt) {
        var username = jwt.getClaimAsString("username");
        var result = userService.me(username);
        return ApiResponse.<Profile>builder()
                .code(200)
                .message("User me successfully")
                .data(result)
                .build();
    }

    @GetMapping
    public ApiResponse<PageResponse<Profile>> getAllUsers(
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String nextToken) {
        PageResponse<Profile> pageResponse = userService.getAllUsers(size, nextToken);
        return ApiResponse.<PageResponse<Profile>>builder()
                .code(200)
                .data(pageResponse)
                .build();
    }

    @DeleteMapping("/{userId}")
    public ApiResponse<Void> deleteUser(@PathVariable String userId) {
        userService.deleteUser(userId);
        return ApiResponse.<Void>builder()
                .code(200)
                .message("User deleted successfully")
                .build();
    }
}
