package com.javabuilder.service;

import com.javabuilder.dto.LoginRequest;
import com.javabuilder.dto.LoginResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.cognitoidentityprovider.CognitoIdentityProviderClient;
import software.amazon.awssdk.services.cognitoidentityprovider.model.*;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final CognitoIdentityProviderClient cognitoClient;

    @Value("${aws.cognito.client-id}")
    private String clientId;

    public LoginResponse login(LoginRequest request) {
        Map<String, String> authParams = new HashMap<>();
        authParams.put("USERNAME", request.getUsername());
        authParams.put("PASSWORD", request.getPassword());

        InitiateAuthRequest authRequest = InitiateAuthRequest.builder()
                .authFlow(AuthFlowType.USER_PASSWORD_AUTH)
                .clientId(clientId)
                .authParameters(authParams)
                .build();

        InitiateAuthResponse authResponse = cognitoClient.initiateAuth(authRequest);

        if (authResponse.challengeName() != null) {
            throw new RuntimeException("Authentication challenge required: " + authResponse.challengeName());
        }

        AuthenticationResultType result = authResponse.authenticationResult();

        return LoginResponse.builder()
                .accessToken(result.accessToken())
                .idToken(result.idToken())
                .refreshToken(result.refreshToken())
                .expiresIn(result.expiresIn())
                .build();
    }
}
