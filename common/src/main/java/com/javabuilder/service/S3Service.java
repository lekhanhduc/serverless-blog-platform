package com.javabuilder.service;

import com.javabuilder.dto.UploadUrlResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;

import java.time.Duration;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class S3Service {

    private final S3Presigner s3Presigner;

    @Value("${aws.s3.bucket}")
    private String bucketName;

    @Value("${aws.s3.region}")
    private String region;

    public UploadUrlResponse generatePostUploadUrl(String postId, String contentType) {
        String key = "posts/" + postId + "/thumbnail-" + UUID.randomUUID() + getExtension(contentType);
        return generatePresignedUrl(key, contentType);
    }

    public UploadUrlResponse generateAvatarUploadUrl(String userId, String contentType) {
        String key = "avatars/" + userId + "/avatar-" + UUID.randomUUID() + getExtension(contentType);
        return generatePresignedUrl(key, contentType);
    }

    private UploadUrlResponse generatePresignedUrl(String key, String contentType) {
        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .contentType(contentType)
                .build();

        PutObjectPresignRequest presignRequest = PutObjectPresignRequest.builder()
                .signatureDuration(Duration.ofMinutes(15))
                .putObjectRequest(putObjectRequest)
                .build();

        var presignedUrl = s3Presigner.presignPutObject(presignRequest);
        String uploadUrl = presignedUrl.url().toString();
        String fileUrl = String.format("https://%s.s3.%s.amazonaws.com/%s", bucketName, region, key);

        return UploadUrlResponse.builder()
                .uploadUrl(uploadUrl)
                .fileUrl(fileUrl)
                .key(key)
                .build();
    }

    private String getExtension(String contentType) {
        return switch (contentType) {
            case "image/png" -> ".png";
            case "image/gif" -> ".gif";
            case "image/webp" -> ".webp";
            default -> ".jpg";
        };
    }
}
