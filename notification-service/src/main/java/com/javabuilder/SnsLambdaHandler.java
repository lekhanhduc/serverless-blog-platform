package com.javabuilder;

import brevoApi.TransactionalEmailsApi;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.SNSEvent;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.javabuilder.dto.BrevoSecret;
import brevo.ApiClient;
import brevo.Configuration;
import brevo.auth.ApiKeyAuth;
import brevoModel.SendSmtpEmail;
import brevoModel.SendSmtpEmailSender;
import brevoModel.SendSmtpEmailTo;
import software.amazon.awssdk.services.secretsmanager.SecretsManagerClient;
import software.amazon.awssdk.services.secretsmanager.model.GetSecretValueRequest;
import java.util.List;

public class SnsLambdaHandler implements RequestHandler<SNSEvent, String> {

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final TransactionalEmailsApi emailApi;
    private final String senderEmail;
    private final String senderName;

    public SnsLambdaHandler() {
        this.senderEmail = System.getenv("MAIL_SENDER_EMAIL");
        this.senderName = System.getenv("MAIL_SENDER_NAME");
        String apiKey = loadBrevoApiKey();

        ApiClient client = Configuration.getDefaultApiClient();
        ApiKeyAuth auth = (ApiKeyAuth) client.getAuthentication("api-key");
        auth.setApiKey(apiKey);

        this.emailApi = new TransactionalEmailsApi(client);
    }

    private String loadBrevoApiKey() {
        String secretName = System.getenv("BREVO_SECRET_NAME");

        try (SecretsManagerClient client = SecretsManagerClient.create()) {
            String secretString = client.getSecretValue(
                GetSecretValueRequest.builder()
                    .secretId(secretName)
                    .build()
            ).secretString();

            BrevoSecret secret = objectMapper.readValue(secretString, BrevoSecret.class);
            return secret.getApiKey();
        } catch (Exception e) {
            throw new RuntimeException("Failed to load Brevo API key from Secrets Manager", e);
        }
    }

    @Override
    public String handleRequest(SNSEvent event, Context context) {
        if (event == null || event.getRecords() == null || event.getRecords().isEmpty()) {
            context.getLogger().log("No SNS records to process");
            return "NO_RECORDS";
        }

        for (SNSEvent.SNSRecord record : event.getRecords()) {
            String message = record.getSNS().getMessage();
            context.getLogger().log("Processing message: " + message);

            try {
                processMessage(message, context);
            } catch (Exception e) {
                context.getLogger().log("Error processing message: " + e.getMessage());
            }
        }

        return "OK";
    }

    private void processMessage(String message, Context context) throws Exception {
        JsonNode event = objectMapper.readTree(message);
        String eventType = event.get("eventType").asText();

        switch (eventType) {
            case "NEW_COMMENT" -> sendNewCommentEmail(event, context);
            case "NEW_POST" -> sendNewPostEmail(event, context);
            case "NEW_USER" -> sendWelcomeEmail(event, context);
            default -> context.getLogger().log("Unknown event type: " + eventType);
        }
    }

    private void sendNewCommentEmail(JsonNode event, Context context) throws Exception {
        String toEmail = event.get("authorEmail").asText();
        String authorName = event.get("authorName").asText();
        String commenterName = event.get("commenterName").asText();
        String postTitle = event.get("postTitle").asText();
        String commentContent = event.get("commentContent").asText();

        String subject = commenterName + " đã bình luận bài viết của bạn";
        String htmlContent = buildCommentEmailHtml(authorName, commenterName, postTitle, commentContent);

        sendEmail(toEmail, subject, htmlContent);
        context.getLogger().log("Sent new comment notification to " + toEmail);
    }

    private void sendNewPostEmail(JsonNode event, Context context) throws Exception {
        String authorName = event.get("authorName").asText();
        String postTitle = event.get("postTitle").asText();
        JsonNode recipientsNode = event.get("recipientEmails");

        if (recipientsNode == null || !recipientsNode.isArray()) {
            context.getLogger().log("No recipients for new post notification");
            return;
        }

        String subject = authorName + " vừa đăng bài viết mới: " + postTitle;
        String htmlContent = buildNewPostEmailHtml(authorName, postTitle);

        for (JsonNode emailNode : recipientsNode) {
            try {
                sendEmail(emailNode.asText(), subject, htmlContent);
                context.getLogger().log("Sent new post notification to " + emailNode.asText());
            } catch (Exception e) {
                context.getLogger().log("Failed to send to " + emailNode.asText() + ": " + e.getMessage());
            }
        }
    }

    private void sendWelcomeEmail(JsonNode event, Context context) throws Exception {
        String toEmail = event.get("userEmail").asText();
        String userName = event.get("userName").asText();

        String subject = "Chào mừng " + userName + " đến với Blog!";
        String htmlContent = buildWelcomeEmailHtml(userName);

        sendEmail(toEmail, subject, htmlContent);
        context.getLogger().log("Sent welcome email to " + toEmail);
    }

    private void sendEmail(String toEmail, String subject, String htmlContent) throws Exception {
        SendSmtpEmail email = new SendSmtpEmail();
        email.setSender(new SendSmtpEmailSender().email(senderEmail).name(senderName));
        email.setTo(List.of(new SendSmtpEmailTo().email(toEmail)));
        email.setSubject(subject);
        email.setHtmlContent(htmlContent);

        emailApi.sendTransacEmail(email);
    }

    private String buildCommentEmailHtml(String authorName, String commenterName, String postTitle, String commentContent) {
        return """
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background-color: #4F46E5; padding: 20px; border-radius: 8px 8px 0 0;">
                    <h1 style="color: white; margin: 0;">📝 Bình luận mới</h1>
                </div>
                <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px;">
                    <p>Xin chào <strong>%s</strong>,</p>
                    <p><strong>%s</strong> đã bình luận trên bài viết "<em>%s</em>":</p>
                    <blockquote style="border-left: 4px solid #4F46E5; padding-left: 15px; color: #555; margin: 20px 0;">
                        %s
                    </blockquote>
                    <p style="color: #888; font-size: 12px;">© 2026 Blog Notification</p>
                </div>
            </div>
            """.formatted(authorName, commenterName, postTitle, commentContent);
    }

    private String buildNewPostEmailHtml(String authorName, String postTitle) {
        return """
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background-color: #2563EB; padding: 20px; border-radius: 8px 8px 0 0;">
                    <h1 style="color: white; margin: 0;">📢 Bài viết mới</h1>
                </div>
                <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px;">
                    <p>Xin chào,</p>
                    <p><strong>%s</strong> vừa đăng một bài viết mới:</p>
                    <h2 style="color: #2563EB; margin: 20px 0;">%s</h2>
                    <p>Hãy ghé thăm blog để đọc ngay!</p>
                    <p style="color: #888; font-size: 12px;">© 2026 Blog Notification</p>
                </div>
            </div>
            """.formatted(authorName, postTitle);
    }

    private String buildWelcomeEmailHtml(String userName) {
        return """
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background-color: #10B981; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
                    <h1 style="color: white; margin: 0;">🎉 Chào mừng!</h1>
                </div>
                <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; text-align: center;">
                    <p style="font-size: 18px;">Xin chào <strong>%s</strong>,</p>
                    <p>Cảm ơn bạn đã đăng ký tài khoản tại Blog!</p>
                    <p>Bắt đầu khám phá và chia sẻ bài viết ngay.</p>
                    <p style="color: #888; font-size: 12px;">© 2026 Blog Notification</p>
                </div>
            </div>
            """.formatted(userName);
    }
}
