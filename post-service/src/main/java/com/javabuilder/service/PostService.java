package com.javabuilder.service;

import com.javabuilder.dto.CreatePostRequest;
import com.javabuilder.dto.PageResponse;
import com.javabuilder.dto.UpdatePostRequest;
import com.javabuilder.entity.Post;
import com.javabuilder.event.NotificationEvent;
import com.javabuilder.exception.ResourceNotFoundException;
import com.javabuilder.repository.PostRepository;
import com.javabuilder.repository.ProfileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class PostService {

    private final PostRepository postRepository;
    private final ProfileRepository profileRepository;
    private final SnsPublisher snsPublisher;

    public Post createPost(CreatePostRequest request, String authorId, String authorName) {
        String postId = UUID.randomUUID().toString();

        Post post = Post.builder()
                .pk("POST#" + postId)
                .sk("METADATA")
                .title(request.getTitle())
                .content(request.getContent())
                .status("DRAFT")
                .authorId(authorId)
                .authorName(authorName)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        postRepository.save(post);

        try {
            List<String> recipientEmails = profileRepository.findAllEmailsExcept(authorId);
            
            if (!recipientEmails.isEmpty()) {
                NotificationEvent event = NotificationEvent.newPost(
                    authorName, 
                    request.getTitle(), 
                    recipientEmails
                );
                snsPublisher.publish(event);
                log.info("Sent new post notification to {} users", recipientEmails.size());
            }
        } catch (Exception e) {
            log.error("Failed to send new post notification: {}", e.getMessage());
        }

        return post;
    }

    public Post getPostById(String postId) {
        return postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));
    }

    public Post updatePost(String postId, UpdatePostRequest request, String currentUserId) {
        Post post = getPostById(postId);

        if (!post.getAuthorId().equals(currentUserId)) {
            throw new RuntimeException("You can only update your own posts");
        }

        if (request.getTitle() != null) {
            post.setTitle(request.getTitle());
        }
        if (request.getContent() != null) {
            post.setContent(request.getContent());
        }
        if (request.getStatus() != null) {
            post.setStatus(request.getStatus());
        }
        post.setUpdatedAt(Instant.now());

        postRepository.save(post);
        return post;
    }

    public void deletePost(String postId, String currentUserId, boolean isAdmin) {
        Post post = getPostById(postId);

        if (!isAdmin && !post.getAuthorId().equals(currentUserId)) {
            throw new RuntimeException("You can only delete your own posts");
        }

        postRepository.delete(postId);
    }

    public PageResponse<Post> getAllPosts(int size, String nextToken) {
        return postRepository.findAll(size, nextToken);
    }

    public PageResponse<Post> getMyPosts(String authorId, int size, String nextToken) {
        return postRepository.findAllByAuthor(authorId, size, nextToken);
    }

}
