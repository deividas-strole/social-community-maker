package com.socialcommunitymaker.backend.community;

import java.time.LocalDateTime;

public record CommunityResponse(
        Long id,
        String name,
        String slug,
        String description,
        CommunityVisibility visibility,
        CommunityOwnerResponse owner,
        Boolean currentUserIsMember,
        CommunityRole currentUserRole,
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
                null,
                null,
                community.getCreatedAt(),
                community.getUpdatedAt()
        );
    }

    public static CommunityResponse from(
            Community community,
            boolean currentUserIsMember,
            CommunityRole currentUserRole
    ) {
        return new CommunityResponse(
                community.getId(),
                community.getName(),
                community.getSlug(),
                community.getDescription(),
                community.getVisibility(),
                CommunityOwnerResponse.from(community.getOwner()),
                currentUserIsMember,
                currentUserRole,
                community.getCreatedAt(),
                community.getUpdatedAt()
        );
    }
}