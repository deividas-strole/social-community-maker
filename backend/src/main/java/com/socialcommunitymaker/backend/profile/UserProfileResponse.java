package com.socialcommunitymaker.backend.profile;

import java.time.LocalDateTime;
import java.util.List;

public record UserProfileResponse(
        Long id,
        String email,
        String username,
        String displayName,
        String bio,
        String avatarUrl,
        LocalDateTime createdAt,
        List<ProfileCommunityResponse> ownedCommunities,
        List<ProfileCommunityResponse> joinedCommunities,
        List<ProfilePostResponse> recentPosts
) {
}