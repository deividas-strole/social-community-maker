package com.socialcommunitymaker.backend.like;

import com.socialcommunitymaker.backend.community.CommunityMemberRepository;
import com.socialcommunitymaker.backend.post.Post;
import com.socialcommunitymaker.backend.post.PostRepository;
import com.socialcommunitymaker.backend.security.JwtService;
import com.socialcommunitymaker.backend.user.User;
import com.socialcommunitymaker.backend.user.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class PostLikeService {

    private final PostLikeRepository postLikeRepository;
    private final PostRepository postRepository;
    private final CommunityMemberRepository communityMemberRepository;
    private final UserRepository userRepository;
    private final JwtService jwtService;

    public PostLikeService(
            PostLikeRepository postLikeRepository,
            PostRepository postRepository,
            CommunityMemberRepository communityMemberRepository,
            UserRepository userRepository,
            JwtService jwtService
    ) {
        this.postLikeRepository = postLikeRepository;
        this.postRepository = postRepository;
        this.communityMemberRepository = communityMemberRepository;
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    public LikeResponse likePost(Long postId, String authorizationHeader) {
        User currentUser = getCurrentUserFromAuthorizationHeader(authorizationHeader);

        Post post = getActivePost(postId);

        if (!communityMemberRepository.existsByCommunityAndUser(post.getCommunity(), currentUser)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Only community members can like posts"
            );
        }

        if (!postLikeRepository.existsByPostAndUser(post, currentUser)) {
            PostLike postLike = new PostLike(post, currentUser);
            postLikeRepository.save(postLike);
        }

        int likeCount = postLikeRepository.countByPost(post);

        return new LikeResponse(
                post.getId(),
                true,
                likeCount
        );
    }

    public LikeResponse unlikePost(Long postId, String authorizationHeader) {
        User currentUser = getCurrentUserFromAuthorizationHeader(authorizationHeader);

        Post post = getActivePost(postId);

        postLikeRepository.findByPostAndUser(post, currentUser)
                .ifPresent(postLikeRepository::delete);

        int likeCount = postLikeRepository.countByPost(post);

        return new LikeResponse(
                post.getId(),
                false,
                likeCount
        );
    }

    private Post getActivePost(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Post not found"
                ));

        if (post.getDeletedAt() != null) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Post not found"
            );
        }

        return post;
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