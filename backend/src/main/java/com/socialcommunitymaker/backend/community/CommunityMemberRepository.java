package com.socialcommunitymaker.backend.community;

import com.socialcommunitymaker.backend.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CommunityMemberRepository extends JpaRepository<CommunityMember, Long> {

    boolean existsByCommunityAndUser(Community community, User user);

    Optional<CommunityMember> findByCommunityAndUser(Community community, User user);

    List<CommunityMember> findByUserOrderByJoinedAtDesc(User user);

    List<CommunityMember> findByCommunityOrderByJoinedAtDesc(Community community);
}