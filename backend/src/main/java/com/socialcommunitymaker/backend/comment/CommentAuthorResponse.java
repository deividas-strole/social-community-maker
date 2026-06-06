package com.socialcommunitymaker.backend.comment;

import com.socialcommunitymaker.backend.user.User;

public record CommentAuthorResponse(
        Long id,
        String username,
        String displayName
) {

    public static CommentAuthorResponse from(User user) {
        return new CommentAuthorResponse(
                user.getId(),
                user.getUsername(),
                user.getDisplayName()
        );
    }
}