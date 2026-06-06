package com.socialcommunitymaker.backend.community;

import java.util.List;

public record MyCommunitiesResponse(
        List<CommunityResponse> ownedCommunities,
        List<CommunityResponse> joinedCommunities
) {
}