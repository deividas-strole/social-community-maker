package com.socialcommunitymaker.backend.community;

import com.socialcommunitymaker.backend.security.JwtService;
import com.socialcommunitymaker.backend.user.User;
import com.socialcommunitymaker.backend.user.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/communities")
public class CommunityController {

    private final CommunityRepository communityRepository;
    private final UserRepository userRepository;
    private final JwtService jwtService;

    public CommunityController(
            CommunityRepository communityRepository,
            UserRepository userRepository,
            JwtService jwtService
    ) {
        this.communityRepository = communityRepository;
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CommunityResponse createCommunity(
            @RequestHeader("Authorization") String authorizationHeader,
            @Valid @RequestBody CreateCommunityRequest request
    ) {
        User currentUser = getCurrentUserFromAuthorizationHeader(authorizationHeader);

        String name = request.name().trim();
        String slug = request.slug().trim().toLowerCase();
        String description = request.description() == null ? null : request.description().trim();

        if (communityRepository.existsBySlugIgnoreCase(slug)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Community slug is already in use"
            );
        }

        Community community = new Community(
                name,
                slug,
                description,
                request.visibility(),
                currentUser
        );

        Community savedCommunity = communityRepository.save(community);

        return CommunityResponse.from(savedCommunity);
    }

    @GetMapping
    public List<CommunityResponse> getPublicCommunities() {
        return communityRepository
                .findByVisibilityOrderByCreatedAtDesc(CommunityVisibility.PUBLIC)
                .stream()
                .map(CommunityResponse::from)
                .toList();
    }

    @GetMapping("/{slug}")
    public CommunityResponse getCommunityBySlug(@PathVariable String slug) {
        Community community = communityRepository.findBySlugIgnoreCase(slug)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Community not found"
                ));

        return CommunityResponse.from(community);
    }

    @GetMapping("/me")
    public List<CommunityResponse> getMyCommunities(
            @RequestHeader("Authorization") String authorizationHeader
    ) {
        User currentUser = getCurrentUserFromAuthorizationHeader(authorizationHeader);

        return communityRepository
                .findByOwnerOrderByCreatedAtDesc(currentUser)
                .stream()
                .map(CommunityResponse::from)
                .toList();
    }

    private User getCurrentUserFromAuthorizationHeader(String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Missing or invalid Authorization header"
            );
        }

        String token = authorizationHeader.substring(7);
        String email = jwtService.extractEmail(token);

        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "Invalid token"
                ));

        if (!jwtService.isTokenValid(token, user)) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Invalid or expired token"
            );
        }

        return user;
    }
}