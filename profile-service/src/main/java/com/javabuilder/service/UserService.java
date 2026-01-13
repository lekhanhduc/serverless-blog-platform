package com.javabuilder.service;

import com.javabuilder.dto.CreateUserRequest;
import com.javabuilder.dto.PageResponse;
import com.javabuilder.dto.UpdateProfileRequest;
import com.javabuilder.entity.Profile;
import com.javabuilder.event.NotificationEvent;
import com.javabuilder.exception.ResourceNotFoundException;
import com.javabuilder.repository.ProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.cognitoidentityprovider.CognitoIdentityProviderClient;
import software.amazon.awssdk.services.cognitoidentityprovider.model.*;
import java.time.Instant;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final CognitoIdentityProviderClient cognitoClient;
    private final ProfileRepository profileRepository;
    private final SnsPublisher snsPublisher;

    @Value("${aws.cognito.user-pool-id}")
    private String userPoolId;

    public Profile createUser(CreateUserRequest request) {
        AdminCreateUserRequest cognitoRequest = AdminCreateUserRequest.builder()
                .userPoolId(userPoolId)
                .username(request.getUsername())
                .userAttributes(
                        AttributeType.builder().name("email").value(request.getEmail()).build(),
                        AttributeType.builder().name("email_verified").value("true").build()
                )
                .messageAction(MessageActionType.SUPPRESS)
                .build();

        AdminCreateUserResponse cognitoResponse = cognitoClient.adminCreateUser(cognitoRequest);
        String cognitoUserId = cognitoResponse.user().username();

        cognitoClient.adminSetUserPassword(AdminSetUserPasswordRequest.builder()
                .userPoolId(userPoolId)
                .username(cognitoUserId)
                .password(request.getPassword())
                .permanent(true)
                .build());

        cognitoClient.adminAddUserToGroup(AdminAddUserToGroupRequest.builder()
                .userPoolId(userPoolId)
                .username(cognitoUserId)
                .groupName("USER")
                .build());

        Profile profile = Profile.builder()
                .pk("USER#" + cognitoUserId)
                .sk("PROFILE")
                .email(request.getEmail())
                .username(request.getUsername())
                .role("USER")
                .createdAt(Instant.now())
                .build();

        profileRepository.save(profile);

        NotificationEvent event = NotificationEvent.newUser(request.getEmail(), request.getUsername());
        snsPublisher.publish(event);

        return profile;
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    public void deleteUser(String username) {
        cognitoClient.adminDeleteUser(AdminDeleteUserRequest.builder()
                .userPoolId(userPoolId)
                .username(username)
                .build());

        profileRepository.delete(username);
    }

    public Optional<Profile> getUserByUsername(String username) {
        return profileRepository.findByUserId(username);
    }

    public Profile me(String username) {
        return profileRepository.findByUserId(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    public Profile updateProfile(String username, UpdateProfileRequest request) {
        Profile profile = profileRepository.findByUserId(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        if (request.getAvatarUrl() != null) {
            profile.setAvatarUrl(request.getAvatarUrl());
        }
        
        profileRepository.save(profile);
        return profile;
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    public PageResponse<Profile> getAllUsers(int size, String nextToken) {
        return profileRepository.findAll(size, nextToken);
    }
}
