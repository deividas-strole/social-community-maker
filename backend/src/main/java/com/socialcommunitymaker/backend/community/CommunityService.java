package com.socialcommunitymaker.backend.community;

import com.socialcommunitymaker.backend.security.JwtService;
import com.socialcommunitymaker.backend.user.User;
import com.socialcommunitymaker.backend.user.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class CommunityService {

    private final CommunityRepository communityRepository;
    private final UserRepository userRepository;
    private final JwtService jwtService;

    public CommunityService(
            CommunityRepository communityRepository,
            UserRepository userRepository,
            JwtService jwtService
    ) {
        this.communityRepository = communityRepository;
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    public CommunityResponse createCommunity(
            String authorizationHeader,
            CreateCommunityRequest request
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

    public List<CommunityResponse> getPublicCommunities() {
        return communityRepository
                .findByVisibilityOrderByCreatedAtDesc(CommunityVisibility.PUBLIC)
                .stream()
                .map(CommunityResponse::from)
                .toList();
    }

    public CommunityResponse getCommunityBySlug(String slug) {
        Community community = communityRepository.findBySlugIgnoreCase(slug)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Community not found"
                ));

        return CommunityResponse.from(community);
    }

    public List<CommunityResponse> getMyCommunities(String authorizationHeader) {
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