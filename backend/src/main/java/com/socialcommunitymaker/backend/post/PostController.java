package com.socialcommunitymaker.backend.post;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class PostController {

    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    @PostMapping("/api/communities/{communityId}/posts")
    @ResponseStatus(HttpStatus.CREATED)
    public PostResponse createPost(
            @PathVariable Long communityId,
            @RequestHeader("Authorization") String authorizationHeader,
            @Valid @RequestBody CreatePostRequest request
    ) {
        return postService.createPost(communityId, authorizationHeader, request);
    }

    @GetMapping("/api/communities/{communityId}/posts")
    public List<PostResponse> getCommunityPosts(
            @PathVariable Long communityId,
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader
    ) {
        return postService.getCommunityPosts(communityId, authorizationHeader);
    }

    @PutMapping("/api/posts/{postId}")
    public PostResponse updatePost(
            @PathVariable Long postId,
            @RequestHeader("Authorization") String authorizationHeader,
            @Valid @RequestBody UpdatePostRequest request
    ) {
        return postService.updatePost(postId, authorizationHeader, request);
    }

    @DeleteMapping("/api/posts/{postId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletePost(
            @PathVariable Long postId,
            @RequestHeader("Authorization") String authorizationHeader
    ) {
        postService.deletePost(postId, authorizationHeader);
    }
}