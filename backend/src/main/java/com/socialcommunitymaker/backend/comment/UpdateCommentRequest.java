package com.socialcommunitymaker.backend.comment;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdateCommentRequest(
        @NotBlank(message = "Comment content is required")
        @Size(max = 2000, message = "Comment content must be 2000 characters or less")
        String content
) {
}