package com.javabuilder.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationEvent {
    private String eventType;
    private String authorEmail;
    private String authorName;
    private String postTitle;
    private String postId;
    private String commenterName;
    private String commentContent;
    private String userEmail;
    private String userName;
    private List<String> recipientEmails; 

    public static NotificationEvent newComment(String authorEmail, String authorName, 
                                                String postTitle, String commenterName, 
                                                String commentContent, String postId) {
        return NotificationEvent.builder()
            .eventType("NEW_COMMENT")
            .authorEmail(authorEmail)
            .authorName(authorName)
            .postTitle(postTitle)
            .commenterName(commenterName)
            .commentContent(commentContent)
            .postId(postId)
            .build();
    }

    public static NotificationEvent newPost(String authorName, String postTitle, List<String> recipientEmails) {
        return NotificationEvent.builder()
            .eventType("NEW_POST")
            .authorName(authorName)
            .postTitle(postTitle)
            .recipientEmails(recipientEmails)
            .build();
    }

    public static NotificationEvent newUser(String userEmail, String userName) {
        return NotificationEvent.builder()
            .eventType("NEW_USER")
            .userEmail(userEmail)
            .userName(userName)
            .build();
    }
}
