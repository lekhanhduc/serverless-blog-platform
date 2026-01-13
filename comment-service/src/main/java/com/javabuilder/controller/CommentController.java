package com.javabuilder.controller;

import com.javabuilder.dto.ApiResponse;
import com.javabuilder.dto.CreateCommentRequest;
import com.javabuilder.dto.PageResponse;
import com.javabuilder.dto.UpdateCommentRequest;
import com.javabuilder.entity.Comment;
import com.javabuilder.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @PostMapping
    public ApiResponse<Comment> createComment(@RequestBody CreateCommentRequest request,
                                              @AuthenticationPrincipal Jwt jwt) {
        String authorId = jwt.getClaimAsString("username");
        String authorName = jwt.getClaimAsString("username");

        Comment comment = commentService.createComment(request, authorId, authorName);
        return ApiResponse.<Comment>builder()
                .code(201)
                .message("Comment created successfully")
                .data(comment)
                .build();
    }

    @GetMapping("/post/{postId}")
    public ApiResponse<PageResponse<Comment>> getCommentsByPost(
            @PathVariable String postId,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String nextToken) {
        PageResponse<Comment> pageResponse = commentService.getCommentsByPostId(postId, size, nextToken);
        return ApiResponse.<PageResponse<Comment>>builder()
                .code(200)
                .data(pageResponse)
                .build();
    }

    @PutMapping("/post/{postId}/{commentId}")
    public ApiResponse<Comment> updateComment(@PathVariable String postId,
                                              @PathVariable String commentId,
                                              @RequestBody UpdateCommentRequest request,
                                              @AuthenticationPrincipal Jwt jwt) {
        String currentUserId = jwt.getClaimAsString("username");
        Comment comment = commentService.updateComment(postId, commentId, request, currentUserId);
        return ApiResponse.<Comment>builder()
                .code(200)
                .message("Comment updated successfully")
                .data(comment)
                .build();
    }

    @DeleteMapping("/post/{postId}/{commentId}")
    public ApiResponse<Void> deleteComment(@PathVariable String postId,
                                           @PathVariable String commentId,
                                           @AuthenticationPrincipal Jwt jwt) {
        String currentUserId = jwt.getClaimAsString("username");
        List<String> groups = jwt.getClaimAsStringList("cognito:groups");
        boolean isAdmin = groups != null && groups.contains("ADMIN");

        commentService.deleteComment(postId, commentId, currentUserId, isAdmin);
        return ApiResponse.<Void>builder()
                .code(200)
                .message("Comment deleted successfully")
                .build();
    }
}
