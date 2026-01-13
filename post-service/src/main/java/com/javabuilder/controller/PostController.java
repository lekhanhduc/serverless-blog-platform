package com.javabuilder.controller;

import com.javabuilder.dto.ApiResponse;
import com.javabuilder.dto.CreatePostRequest;
import com.javabuilder.dto.PageResponse;
import com.javabuilder.dto.UpdatePostRequest;
import com.javabuilder.dto.UploadUrlRequest;
import com.javabuilder.dto.UploadUrlResponse;
import com.javabuilder.entity.Post;
import com.javabuilder.service.PostService;
import com.javabuilder.service.S3Service;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;
    private final S3Service s3Service;

    @PostMapping("/upload-url")
    public ApiResponse<UploadUrlResponse> getUploadUrl(
            @RequestBody UploadUrlRequest request,
            @AuthenticationPrincipal Jwt jwt) {
        String postId = UUID.randomUUID().toString();
        UploadUrlResponse result = s3Service.generatePostUploadUrl(postId, request.getContentType());
        return ApiResponse.<UploadUrlResponse>builder()
                .code(200)
                .data(result)
                .build();
    }

    @PostMapping
    public ApiResponse<Post> createPost(@RequestBody CreatePostRequest request,
                                        @AuthenticationPrincipal Jwt jwt) {
        String authorId = jwt.getClaimAsString("username");
        String authorName = jwt.getClaimAsString("username");

        Post post = postService.createPost(request, authorId, authorName);
        return ApiResponse.<Post>builder()
                .code(201)
                .message("Post created successfully")
                .data(post)
                .build();
    }

    @GetMapping("/{postId}")
    public ApiResponse<Post> getPost(@PathVariable String postId) {
        Post post = postService.getPostById(postId);
        return ApiResponse.<Post>builder()
                .code(200)
                .data(post)
                .build();
    }

    @PutMapping("/{postId}")
    public ApiResponse<Post> updatePost(@PathVariable String postId,
                                        @RequestBody UpdatePostRequest request,
                                        @AuthenticationPrincipal Jwt jwt) {
        String currentUserId = jwt.getClaimAsString("username");
        Post post = postService.updatePost(postId, request, currentUserId);
        return ApiResponse.<Post>builder()
                .code(200)
                .message("Post updated successfully")
                .data(post)
                .build();
    }

    @DeleteMapping("/{postId}")
    public ApiResponse<Void> deletePost(@PathVariable String postId,
                                        @AuthenticationPrincipal Jwt jwt) {
        String currentUserId = jwt.getClaimAsString("username");
        List<String> groups = jwt.getClaimAsStringList("cognito:groups");
        boolean isAdmin = groups != null && groups.contains("ADMIN");

        postService.deletePost(postId, currentUserId, isAdmin);
        return ApiResponse.<Void>builder()
                .code(200)
                .message("Post deleted successfully")
                .build();
    }

    @GetMapping
    public ApiResponse<PageResponse<Post>> getAllPosts(
            @RequestParam(required = false, defaultValue = "20") int size,
            @RequestParam(required = false) String nextToken) {
        PageResponse<Post> pageResponse = postService.getAllPosts(size, nextToken);
        return ApiResponse.<PageResponse<Post>>builder()
                .code(200)
                .data(pageResponse)
                .build();
    }

    @GetMapping("/me")
    public ApiResponse<PageResponse<Post>> getMyPosts(
            @AuthenticationPrincipal Jwt jwt,
            @RequestParam(required = false, defaultValue = "20") int size,
            @RequestParam(required = false) String nextToken) {
        String authorId = jwt.getClaimAsString("username");
        PageResponse<Post> pageResponse = postService.getMyPosts(authorId, size, nextToken);
        return ApiResponse.<PageResponse<Post>>builder()
                .code(200)
                .data(pageResponse)
                .build();
    }
}
