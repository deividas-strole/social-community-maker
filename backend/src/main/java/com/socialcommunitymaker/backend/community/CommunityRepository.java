package com.socialcommunitymaker.backend.community;

import com.socialcommunitymaker.backend.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CommunityRepository extends JpaRepository<Community, Long> {

    boolean existsBySlugIgnoreCase(String slug);

    Optional<Community> findBySlugIgnoreCase(String slug);

    List<Community> findByOwnerOrderByCreatedAtDesc(User owner);

    List<Community> findByVisibilityOrderByCreatedAtDesc(CommunityVisibility visibility);

    List<Community> findByVisibilityAndNameContainingIgnoreCaseOrVisibilityAndSlugContainingIgnoreCaseOrVisibilityAndDescriptionContainingIgnoreCaseOrderByCreatedAtDesc(
            CommunityVisibility nameVisibility,
            String name,
            CommunityVisibility slugVisibility,
            String slug,
            CommunityVisibility descriptionVisibility,
            String description
    );
}