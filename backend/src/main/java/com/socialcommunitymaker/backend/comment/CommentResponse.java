package com.socialcommunitymaker.backend.comment;

import java.time.LocalDateTime;

public record CommentResponse(
        Long id,
        Long postId,
        CommentAuthorResponse author,
        String content,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {

    public static CommentResponse from(Comment comment) {
        return new CommentResponse(
                comment.getId(),
                comment.getPost().getId(),
                CommentAuthorResponse.from(comment.getAuthor()),
                comment.getContent(),
                comment.getCreatedAt(),
                comment.getUpdatedAt()
        );
    }
}