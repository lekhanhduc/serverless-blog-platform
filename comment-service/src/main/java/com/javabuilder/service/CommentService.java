package com.javabuilder.service;

import com.javabuilder.dto.CreateCommentRequest;
import com.javabuilder.dto.PageResponse;
import com.javabuilder.dto.UpdateCommentRequest;
import com.javabuilder.entity.Comment;
import com.javabuilder.event.NotificationEvent;
import com.javabuilder.exception.ResourceNotFoundException;
import com.javabuilder.repository.CommentRepository;
import com.javabuilder.repository.ProfileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class CommentService {

    private final CommentRepository commentRepository;
    private final ProfileRepository profileRepository;
    private final SnsPublisher snsPublisher;

    public Comment createComment(CreateCommentRequest request, String authorId, String authorName) {
        String commentId = UUID.randomUUID().toString();
        String postPk = request.getPostId().startsWith("POST#") ? request.getPostId() : "POST#" + request.getPostId();

        Comment comment = Comment.builder()
                .pk(postPk)
                .sk("COMMENT#" + commentId)
                .postId(request.getPostId())
                .content(request.getContent())
                .authorId(authorId)
                .authorName(authorName)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();
        commentRepository.save(comment);

        if (request.getPostAuthorId() != null && !authorId.equals(request.getPostAuthorId())) {
            profileRepository.findByUserId(request.getPostAuthorId())
                .ifPresent(profile -> {
                    NotificationEvent event = NotificationEvent.newComment(
                        profile.getEmail(),
                        request.getPostAuthorName(),
                        request.getPostTitle(),
                        authorName,
                        request.getContent(),
                        request.getPostId()
                    );
                    snsPublisher.publish(event);
                    log.info("Sent notification for new comment on post {}", request.getPostId());
                });
        }

        return comment;
    }

    public Comment getCommentById(String postId, String commentId) {
        return commentRepository.findById(postId, commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));
    }

    public Comment updateComment(String postId, String commentId, UpdateCommentRequest request, String currentUserId) {
        Comment comment = getCommentById(postId, commentId);

        if (!comment.getAuthorId().equals(currentUserId)) {
            throw new RuntimeException("You can only update your own comments");
        }

        comment.setContent(request.getContent());
        comment.setUpdatedAt(Instant.now());

        commentRepository.save(comment);
        return comment;
    }

    public void deleteComment(String postId, String commentId, String currentUserId, boolean isAdmin) {
        Comment comment = getCommentById(postId, commentId);

        if (!isAdmin && !comment.getAuthorId().equals(currentUserId)) {
            throw new RuntimeException("You can only delete your own comments");
        }

        commentRepository.delete(postId, commentId);
    }

    public PageResponse<Comment> getCommentsByPostId(String postId, int size, String nextToken) {
        return commentRepository.findByPostId(postId, size, nextToken);
    }
}
