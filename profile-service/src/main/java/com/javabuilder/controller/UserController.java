package com.javabuilder.controller;

import com.javabuilder.dto.ApiResponse;
import com.javabuilder.dto.CreateUserRequest;
import com.javabuilder.dto.PageResponse;
import com.javabuilder.dto.UpdateProfileRequest;
import com.javabuilder.dto.UploadUrlRequest;
import com.javabuilder.dto.UploadUrlResponse;
import com.javabuilder.entity.Profile;
import com.javabuilder.service.S3Service;
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
    private final S3Service s3Service;

    @PostMapping("/upload-url")
    public ApiResponse<UploadUrlResponse> getUploadUrl(
            @RequestBody UploadUrlRequest request,
            @AuthenticationPrincipal Jwt jwt) {
        String username = jwt.getClaimAsString("username");
        UploadUrlResponse result = s3Service.generateAvatarUploadUrl(username, request.getContentType());
        return ApiResponse.<UploadUrlResponse>builder()
                .code(200)
                .data(result)
                .build();
    }

    @PostMapping
    public ApiResponse<Profile> createUser(@RequestBody CreateUserRequest request) {
        Profile profile = userService.createUser(request);
        return ApiResponse.<Profile>builder()
                .code(201)
                .message("User created successfully")
                .data(profile)
                .build();
    }

    @GetMapping("/{username}")
    public ApiResponse<Profile> getUser(@PathVariable String username) {
        return userService.getUserByUsername(username)
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
        String username = jwt.getClaimAsString("username");
        Profile result = userService.me(username);
        return ApiResponse.<Profile>builder()
                .code(200)
                .message("User me successfully")
                .data(result)
                .build();
    }

    @PutMapping("/me")
    public ApiResponse<Profile> updateMe(
            @RequestBody UpdateProfileRequest request,
            @AuthenticationPrincipal Jwt jwt) {
        String username = jwt.getClaimAsString("username");
        Profile result = userService.updateProfile(username, request);
        return ApiResponse.<Profile>builder()
                .code(200)
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

    @DeleteMapping("/{username}")
    public ApiResponse<Void> deleteUser(@PathVariable String username) {
        userService.deleteUser(username);
        return ApiResponse.<Void>builder()
                .code(200)
                .message("User deleted successfully")
                .build();
    }
}
