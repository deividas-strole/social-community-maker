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
    private final CommunityMemberRepository communityMemberRepository;
    private final UserRepository userRepository;
    private final JwtService jwtService;

    public CommunityService(
            CommunityRepository communityRepository,
            CommunityMemberRepository communityMemberRepository,
            UserRepository userRepository,
            JwtService jwtService
    ) {
        this.communityRepository = communityRepository;
        this.communityMemberRepository = communityMemberRepository;
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

        CommunityMember ownerMembership = new CommunityMember(
                savedCommunity,
                currentUser,
                CommunityRole.OWNER
        );

        communityMemberRepository.save(ownerMembership);

        return CommunityResponse.from(savedCommunity, true, CommunityRole.OWNER);
    }

    public List<CommunityResponse> getPublicCommunities(String search) {
        String trimmedSearch = search == null ? "" : search.trim();

        if (trimmedSearch.isEmpty()) {
            return communityRepository
                    .findByVisibilityOrderByCreatedAtDesc(CommunityVisibility.PUBLIC)
                    .stream()
                    .map(CommunityResponse::from)
                    .toList();
        }

        return communityRepository
                .findByVisibilityAndNameContainingIgnoreCaseOrVisibilityAndSlugContainingIgnoreCaseOrVisibilityAndDescriptionContainingIgnoreCaseOrderByCreatedAtDesc(
                        CommunityVisibility.PUBLIC,
                        trimmedSearch,
                        CommunityVisibility.PUBLIC,
                        trimmedSearch,
                        CommunityVisibility.PUBLIC,
                        trimmedSearch
                )
                .stream()
                .map(CommunityResponse::from)
                .toList();
    }

    public CommunityResponse getCommunityBySlug(String slug, String authorizationHeader) {
        Community community = communityRepository.findBySlugIgnoreCase(slug)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Community not found"
                ));

        User currentUser = getCurrentUserFromOptionalAuthorizationHeader(authorizationHeader);

        if (currentUser == null) {
            return CommunityResponse.from(community);
        }

        return communityMemberRepository.findByCommunityAndUser(community, currentUser)
                .map(member -> CommunityResponse.from(community, true, member.getRole()))
                .orElseGet(() -> CommunityResponse.from(community, false, null));
    }

    public MyCommunitiesResponse getMyCommunities(String authorizationHeader) {
        User currentUser = getCurrentUserFromAuthorizationHeader(authorizationHeader);

        List<CommunityResponse> ownedCommunities = communityRepository
                .findByOwnerOrderByCreatedAtDesc(currentUser)
                .stream()
                .map(community -> CommunityResponse.from(community, true, CommunityRole.OWNER))
                .toList();

        List<CommunityResponse> joinedCommunities = communityMemberRepository
                .findByUserOrderByJoinedAtDesc(currentUser)
                .stream()
                .filter(member -> member.getRole() != CommunityRole.OWNER)
                .map(member -> CommunityResponse.from(
                        member.getCommunity(),
                        true,
                        member.getRole()
                ))
                .toList();

        return new MyCommunitiesResponse(ownedCommunities, joinedCommunities);
    }

    public CommunityMembershipResponse joinCommunity(
            Long communityId,
            String authorizationHeader
    ) {
        User currentUser = getCurrentUserFromAuthorizationHeader(authorizationHeader);

        Community community = communityRepository.findById(communityId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Community not found"
                ));

        if (community.getOwner().getId().equals(currentUser.getId())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Community owner is already a member"
            );
        }

        if (communityMemberRepository.existsByCommunityAndUser(community, currentUser)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "User is already a community member"
            );
        }

        if (community.getVisibility() != CommunityVisibility.PUBLIC) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Only public communities can be joined at this time"
            );
        }

        CommunityMember member = new CommunityMember(
                community,
                currentUser,
                CommunityRole.MEMBER
        );

        CommunityMember savedMember = communityMemberRepository.save(member);

        return CommunityMembershipResponse.from(savedMember);
    }

    public void leaveCommunity(
            Long communityId,
            String authorizationHeader
    ) {
        User currentUser = getCurrentUserFromAuthorizationHeader(authorizationHeader);

        Community community = communityRepository.findById(communityId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Community not found"
                ));

        CommunityMember member = communityMemberRepository.findByCommunityAndUser(community, currentUser)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "User is not a member of this community"
                ));

        if (member.getRole() == CommunityRole.OWNER) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Community owner cannot leave their own community"
            );
        }

        communityMemberRepository.delete(member);
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

    private User getCurrentUserFromOptionalAuthorizationHeader(String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            return null;
        }

        String token = authorizationHeader.substring(7);
        String email = jwtService.extractEmail(token);

        return userRepository.findByEmailIgnoreCase(email)
                .filter(user -> jwtService.isTokenValid(token, user))
                .orElse(null);
    }
}