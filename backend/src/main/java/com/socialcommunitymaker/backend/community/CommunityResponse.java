package com.socialcommunitymaker.backend.community;

import java.time.LocalDateTime;

public record CommunityResponse(
        Long id,
        String name,
        String slug,
        String description,
        CommunityVisibility visibility,
        CommunityOwnerResponse owner,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {

    public static CommunityResponse from(Community community) {
        return new CommunityResponse(
                community.getId(),
                community.getName(),
                community.getSlug(),
                community.getDescription(),
                community.getVisibility(),
                CommunityOwnerResponse.from(community.getOwner()),
                community.getCreatedAt(),
                community.getUpdatedAt()
        );
    }
}