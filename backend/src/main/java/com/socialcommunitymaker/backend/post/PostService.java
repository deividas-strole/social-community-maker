package com.socialcommunitymaker.backend.post;

import com.socialcommunitymaker.backend.community.Community;
import com.socialcommunitymaker.backend.community.CommunityRepository;
import com.socialcommunitymaker.backend.security.JwtService;
import com.socialcommunitymaker.backend.user.User;
import com.socialcommunitymaker.backend.user.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import com.socialcommunitymaker.backend.community.CommunityMemberRepository;

import java.util.List;

@Service
public class PostService {

    private final PostRepository postRepository;
    private final CommunityRepository communityRepository;
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final CommunityMemberRepository communityMemberRepository;

    public PostService(
            PostRepository postRepository,
            CommunityRepository communityRepository,
            UserRepository userRepository,
            JwtService jwtService, CommunityMemberRepository communityMemberRepository
    ) {
        this.postRepository = postRepository;
        this.communityRepository = communityRepository;
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.communityMemberRepository = communityMemberRepository;
    }

    public PostResponse createPost(
            Long communityId,
            String authorizationHeader,
            CreatePostRequest request
    ) {
        User currentUser = getCurrentUserFromAuthorizationHeader(authorizationHeader);

        Community community = communityRepository.findById(communityId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Community not found"
                ));

        if (!communityMemberRepository.existsByCommunityAndUser(community, currentUser)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Only community members can create posts"
            );
        }

        String content = request.content().trim();

        Post post = new Post(
                community,
                currentUser,
                content
        );

        Post savedPost = postRepository.save(post);

        return PostResponse.from(savedPost);
    }

    public List<PostResponse> getCommunityPosts(Long communityId) {
        Community community = communityRepository.findById(communityId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Community not found"
                ));

        return postRepository
                .findByCommunityAndDeletedAtIsNullOrderByCreatedAtDesc(community)
                .stream()
                .map(PostResponse::from)
                .toList();
    }

    public void deletePost(Long postId, String authorizationHeader) {
        User currentUser = getCurrentUserFromAuthorizationHeader(authorizationHeader);

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Post not found"
                ));

        boolean isAuthor = post.getAuthor().getId().equals(currentUser.getId());
        boolean isCommunityOwner = post.getCommunity().getOwner().getId().equals(currentUser.getId());

        if (!isAuthor && !isCommunityOwner) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You do not have permission to delete this post"
            );
        }

        post.softDelete();
        postRepository.save(post);
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