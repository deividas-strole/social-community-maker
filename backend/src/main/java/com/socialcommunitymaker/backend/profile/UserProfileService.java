package com.socialcommunitymaker.backend.profile;

import com.socialcommunitymaker.backend.community.Community;
import com.socialcommunitymaker.backend.community.CommunityMember;
import com.socialcommunitymaker.backend.community.CommunityMemberRepository;
import com.socialcommunitymaker.backend.community.CommunityRepository;
import com.socialcommunitymaker.backend.post.Post;
import com.socialcommunitymaker.backend.post.PostRepository;
import com.socialcommunitymaker.backend.user.User;
import com.socialcommunitymaker.backend.user.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class UserProfileService {

    private final UserRepository userRepository;
    private final CommunityRepository communityRepository;
    private final CommunityMemberRepository communityMemberRepository;
    private final PostRepository postRepository;

    public UserProfileService(
            UserRepository userRepository,
            CommunityRepository communityRepository,
            CommunityMemberRepository communityMemberRepository,
            PostRepository postRepository
    ) {
        this.userRepository = userRepository;
        this.communityRepository = communityRepository;
        this.communityMemberRepository = communityMemberRepository;
        this.postRepository = postRepository;
    }

    public UserProfileResponse getProfileByUsername(String username) {
        User user = userRepository.findByUsernameIgnoreCase(username)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "User not found"
                ));

        List<ProfileCommunityResponse> ownedCommunities = communityRepository
                .findByOwnerOrderByCreatedAtDesc(user)
                .stream()
                .map(this::toCommunityResponse)
                .toList();

        List<ProfileCommunityResponse> joinedCommunities = communityMemberRepository
                .findByUserOrderByJoinedAtDesc(user)
                .stream()
                .filter(member -> member.getRole() != null)
                .filter(member -> member.getCommunity() != null)
                .filter(member -> !member.getCommunity().getOwner().getId().equals(user.getId()))
                .map(CommunityMember::getCommunity)
                .map(this::toCommunityResponse)
                .toList();

        List<ProfilePostResponse> recentPosts = postRepository
                .findTop10ByAuthorAndDeletedAtIsNullOrderByCreatedAtDesc(user)
                .stream()
                .map(this::toPostResponse)
                .toList();

        return new UserProfileResponse(
                user.getId(),
                user.getEmail(),
                user.getUsername(),
                user.getDisplayName(),
                user.getBio(),
                user.getAvatarUrl(),
                user.getCreatedAt(),
                ownedCommunities,
                joinedCommunities,
                recentPosts
        );
    }

    private ProfileCommunityResponse toCommunityResponse(Community community) {
        return new ProfileCommunityResponse(
                community.getId(),
                community.getName(),
                community.getSlug(),
                community.getDescription(),
                community.getVisibility(),
                community.getCreatedAt()
        );
    }

    private ProfilePostResponse toPostResponse(Post post) {
        return new ProfilePostResponse(
                post.getId(),
                post.getCommunity().getId(),
                post.getCommunity().getName(),
                post.getCommunity().getSlug(),
                post.getContent(),
                post.getCreatedAt(),
                post.getUpdatedAt()
        );
    }
}