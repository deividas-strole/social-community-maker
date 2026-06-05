package com.socialcommunitymaker.backend.auth;

public record LoginResponse(
        String message,
        UserResponse user
) {
}