package com.socialcommunitymaker.backend.comment;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @PostMapping("/api/posts/{postId}/comments")
    @ResponseStatus(HttpStatus.CREATED)
    public CommentResponse createComment(
            @PathVariable Long postId,
            @RequestHeader("Authorization") String authorizationHeader,
            @Valid @RequestBody CreateCommentRequest request
    ) {
        return commentService.createComment(postId, authorizationHeader, request);
    }

    @GetMapping("/api/posts/{postId}/comments")
    public List<CommentResponse> getPostComments(@PathVariable Long postId) {
        return commentService.getPostComments(postId);
    }

    @DeleteMapping("/api/comments/{commentId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteComment(
            @PathVariable Long commentId,
            @RequestHeader("Authorization") String authorizationHeader
    ) {
        commentService.deleteComment(commentId, authorizationHeader);
    }
}