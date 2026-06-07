package com.socialcommunitymaker.backend.like;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/posts/{postId}/likes")
public class PostLikeController {

    private final PostLikeService postLikeService;

    public PostLikeController(PostLikeService postLikeService) {
        this.postLikeService = postLikeService;
    }

    @PostMapping
    public LikeResponse likePost(
            @PathVariable Long postId,
            @RequestHeader("Authorization") String authorizationHeader
    ) {
        return postLikeService.likePost(postId, authorizationHeader);
    }

    @DeleteMapping
    public LikeResponse unlikePost(
            @PathVariable Long postId,
            @RequestHeader("Authorization") String authorizationHeader
    ) {
        return postLikeService.unlikePost(postId, authorizationHeader);
    }
}