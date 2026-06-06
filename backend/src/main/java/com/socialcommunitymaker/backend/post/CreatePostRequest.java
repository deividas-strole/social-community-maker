package com.socialcommunitymaker.backend.post;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreatePostRequest(
        @NotBlank(message = "Post content is required")
        @Size(max = 5000, message = "Post content must be 5000 characters or less")
        String content
) {
}