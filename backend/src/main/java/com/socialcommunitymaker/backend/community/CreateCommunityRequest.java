package com.socialcommunitymaker.backend.community;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CreateCommunityRequest(
        @NotBlank(message = "Name is required")
        @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
        String name,

        @NotBlank(message = "Slug is required")
        @Size(min = 3, max = 100, message = "Slug must be between 3 and 100 characters")
        @Pattern(
                regexp = "^[a-z0-9]+(?:-[a-z0-9]+)*$",
                message = "Slug must use lowercase letters, numbers, and hyphens only"
        )
        String slug,

        @Size(max = 2000, message = "Description must be 2000 characters or less")
        String description,

        @NotNull(message = "Visibility is required")
        CommunityVisibility visibility
) {
}