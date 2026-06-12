package com.socialcommunitymaker.backend.post;

import com.socialcommunitymaker.backend.community.Community;
import com.socialcommunitymaker.backend.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {

    List<Post> findByCommunityAndDeletedAtIsNullOrderByCreatedAtDesc(Community community);

    List<Post> findTop10ByAuthorAndDeletedAtIsNullOrderByCreatedAtDesc(User author);
}