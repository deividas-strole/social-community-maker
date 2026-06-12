package com.socialcommunitymaker.backend.profile;

import com.socialcommunitymaker.backend.community.CommunityVisibility;

import java.time.LocalDateTime;

public record ProfileCommunityResponse(
        Long id,
        String name,
        String slug,
        String description,
        CommunityVisibility visibility,
        LocalDateTime createdAt
) {
}
