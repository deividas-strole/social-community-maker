package com.socialcommunitymaker.backend.community;

import com.socialcommunitymaker.backend.user.User;

public record CommunityOwnerResponse(
        Long id,
        String email,
        String username,
        String displayName
) {

    public static CommunityOwnerResponse from(User user) {
        return new CommunityOwnerResponse(
                user.getId(),
                user.getEmail(),
                user.getUsername(),
                user.getDisplayName()
        );
    }
}