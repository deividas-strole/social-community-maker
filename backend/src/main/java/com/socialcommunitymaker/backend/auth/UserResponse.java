package com.socialcommunitymaker.backend.auth;

import com.socialcommunitymaker.backend.user.User;

import java.time.LocalDateTime;

public record UserResponse(
        Long id,
        String email,
        String username,
        String displayName,
        String bio,
        String avatarUrl,
        LocalDateTime createdAt
) {

    public static UserResponse from(User user) {
        return new UserResponse(
                user.getId(),
                user.getEmail(),
                user.getUsername(),
                user.getDisplayName(),
                user.getBio(),
                user.getAvatarUrl(),
                user.getCreatedAt()
        );
    }
}