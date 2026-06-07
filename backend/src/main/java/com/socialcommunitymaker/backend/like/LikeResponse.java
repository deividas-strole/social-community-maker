package com.socialcommunitymaker.backend.like;

public record LikeResponse(
        Long postId,
        boolean likedByCurrentUser,
        int likeCount
) {
}