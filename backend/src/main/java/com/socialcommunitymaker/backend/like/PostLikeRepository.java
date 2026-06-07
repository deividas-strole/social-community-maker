package com.socialcommunitymaker.backend.like;

import com.socialcommunitymaker.backend.post.Post;
import com.socialcommunitymaker.backend.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PostLikeRepository extends JpaRepository<PostLike, Long> {

    boolean existsByPostAndUser(Post post, User user);

    Optional<PostLike> findByPostAndUser(Post post, User user);

    int countByPost(Post post);
}