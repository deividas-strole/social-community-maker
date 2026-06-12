package com.socialcommunitymaker.backend.profile;

import java.time.LocalDateTime;

public record ProfilePostResponse(
        Long id,
        Long communityId,
        String communityName,
        String communitySlug,
        String content,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}