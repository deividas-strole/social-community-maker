package com.socialcommunitymaker.backend.auth;

public record LoginResponse(
        String token,
        String tokenType,
        UserResponse user
) {
}