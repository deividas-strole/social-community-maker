package com.socialcommunitymaker.backend.community;

import java.time.LocalDateTime;

public record CommunityMembershipResponse(
        Long id,
        Long communityId,
        Long userId,
        CommunityRole role,
        LocalDateTime joinedAt
) {

    public static CommunityMembershipResponse from(CommunityMember member) {
        return new CommunityMembershipResponse(
                member.getId(),
                member.getCommunity().getId(),
                member.getUser().getId(),
                member.getRole(),
                member.getJoinedAt()
        );
    }
}