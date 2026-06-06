package com.socialcommunitymaker.backend.comment;

import com.socialcommunitymaker.backend.post.Post;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    List<Comment> findByPostAndDeletedAtIsNullOrderByCreatedAtAsc(Post post);

    int countByPostAndDeletedAtIsNull(Post post);
}