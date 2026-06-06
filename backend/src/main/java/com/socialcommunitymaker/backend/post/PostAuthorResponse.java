package com.socialcommunitymaker.backend.post;

import com.socialcommunitymaker.backend.user.User;

public record PostAuthorResponse(
        Long id,
        String username,
        String displayName
) {

    public static PostAuthorResponse from(User user) {
        return new PostAuthorResponse(
                user.getId(),
                user.getUsername(),
                user.getDisplayName()
        );
    }
}