package com.socialcommunitymaker.backend.comment;

import com.socialcommunitymaker.backend.community.CommunityMemberRepository;
import com.socialcommunitymaker.backend.post.Post;
import com.socialcommunitymaker.backend.post.PostRepository;
import com.socialcommunitymaker.backend.security.JwtService;
import com.socialcommunitymaker.backend.user.User;
import com.socialcommunitymaker.backend.user.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final CommunityMemberRepository communityMemberRepository;
    private final UserRepository userRepository;
    private final JwtService jwtService;

    public CommentService(
            CommentRepository commentRepository,
            PostRepository postRepository,
            CommunityMemberRepository communityMemberRepository,
            UserRepository userRepository,
            JwtService jwtService
    ) {
        this.commentRepository = commentRepository;
        this.postRepository = postRepository;
        this.communityMemberRepository = communityMemberRepository;
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    public CommentResponse createComment(
            Long postId,
            String authorizationHeader,
            CreateCommentRequest request
    ) {
        User currentUser = getCurrentUserFromAuthorizationHeader(authorizationHeader);

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

        if (!communityMemberRepository.existsByCommunityAndUser(post.getCommunity(), currentUser)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Only community members can comment"
            );
        }

        String content = request.content().trim();

        Comment comment = new Comment(
                post,
                currentUser,
                content
        );

        Comment savedComment = commentRepository.save(comment);

        return CommentResponse.from(savedComment);
    }

    public List<CommentResponse> getPostComments(Long postId) {
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

        return commentRepository
                .findByPostAndDeletedAtIsNullOrderByCreatedAtAsc(post)
                .stream()
                .map(CommentResponse::from)
                .toList();
    }

    public void deleteComment(Long commentId, String authorizationHeader) {
        User currentUser = getCurrentUserFromAuthorizationHeader(authorizationHeader);

        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Comment not found"
                ));

        if (comment.getDeletedAt() != null) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Comment not found"
            );
        }

        boolean isAuthor = comment.getAuthor().getId().equals(currentUser.getId());
        boolean isCommunityOwner = comment.getPost()
                .getCommunity()
                .getOwner()
                .getId()
                .equals(currentUser.getId());

        if (!isAuthor && !isCommunityOwner) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You do not have permission to delete this comment"
            );
        }

        comment.softDelete();
        commentRepository.save(comment);
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