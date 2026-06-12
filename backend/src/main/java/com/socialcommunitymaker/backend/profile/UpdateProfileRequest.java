package com.socialcommunitymaker.backend.profile;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdateProfileRequest(
        @NotBlank(message = "Display name is required")
        @Size(max = 100, message = "Display name must be 100 characters or fewer")
        String displayName,

        @Size(max = 500, message = "Bio must be 500 characters or fewer")
        String bio,

        @Size(max = 500, message = "Avatar URL must be 500 characters or fewer")
        String avatarUrl
) {
}