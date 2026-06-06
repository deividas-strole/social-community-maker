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

    @GetMapping
    public List<CommunityResponse> getPublicCommunities() {
        return communityService.getPublicCommunities();
    }

    @GetMapping("/{slug}")
    public CommunityResponse getCommunityBySlug(@PathVariable String slug) {
        return communityService.getCommunityBySlug(slug);
    }

    @GetMapping("/me")
    public List<CommunityResponse> getMyCommunities(
            @RequestHeader("Authorization") String authorizationHeader
    ) {
        return communityService.getMyCommunities(authorizationHeader);
    }
}