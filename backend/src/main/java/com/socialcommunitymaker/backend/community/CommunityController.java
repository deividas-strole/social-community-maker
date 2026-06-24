package com.socialcommunitymaker.backend.community;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/communities")
public class CommunityController {

    private final CommunityService communityService;

    public CommunityController(CommunityService communityService) {
        this.communityService = communityService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CommunityResponse createCommunity(
            @RequestHeader("Authorization") String authorizationHeader,
            @Valid @RequestBody CreateCommunityRequest request
    ) {
        return communityService.createCommunity(authorizationHeader, request);
    }

    @GetMapping("/me")
    public MyCommunitiesResponse getMyCommunities(
            @RequestHeader("Authorization") String authorizationHeader
    ) {
        return communityService.getMyCommunities(authorizationHeader);
    }

    @GetMapping
    public List<CommunityResponse> getPublicCommunities(
            @RequestParam(value = "search", required = false) String search
    ) {
        return communityService.getPublicCommunities(search);
    }

    @GetMapping("/{slug}")
    public CommunityResponse getCommunityBySlug(
            @PathVariable String slug,
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader
    ) {
        return communityService.getCommunityBySlug(slug, authorizationHeader);
    }

    @PostMapping("/{communityId}/join")
    @ResponseStatus(HttpStatus.CREATED)
    public CommunityMembershipResponse joinCommunity(
            @PathVariable Long communityId,
            @RequestHeader("Authorization") String authorizationHeader
    ) {
        return communityService.joinCommunity(communityId, authorizationHeader);
    }

    @DeleteMapping("/{communityId}/leave")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void leaveCommunity(
            @PathVariable Long communityId,
            @RequestHeader("Authorization") String authorizationHeader
    ) {
        communityService.leaveCommunity(communityId, authorizationHeader);
    }
}