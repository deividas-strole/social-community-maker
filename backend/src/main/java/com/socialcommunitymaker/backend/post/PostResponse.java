package com.socialcommunitymaker.backend.post;

import java.time.LocalDateTime;

public record PostResponse(
        Long id,
        Long communityId,
        PostAuthorResponse author,
        String content,
        int likeCount,
        int commentCount,
        boolean likedByCurrentUser,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {

    public static PostResponse from(Post post) {
        return new PostResponse(
                post.getId(),
                post.getCommunity().getId(),
                PostAuthorResponse.from(post.getAuthor()),
                post.getContent(),
                0,
                0,
                false,
                post.getCreatedAt(),
                post.getUpdatedAt()
        );
    }

    public static PostResponse from(
            Post post,
            int likeCount,
            int commentCount,
            boolean likedByCurrentUser
    ) {
        return new PostResponse(
                post.getId(),
                post.getCommunity().getId(),
                PostAuthorResponse.from(post.getAuthor()),
                post.getContent(),
                likeCount,
                commentCount,
                likedByCurrentUser,
                post.getCreatedAt(),
                post.getUpdatedAt()
        );
    }
}