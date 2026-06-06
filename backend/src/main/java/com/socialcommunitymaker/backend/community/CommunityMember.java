package com.socialcommunitymaker.backend.community;

import com.socialcommunitymaker.backend.user.User;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "community_members",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_community_members_community_user",
                        columnNames = {"community_id", "user_id"}
                )
        }
)
public class CommunityMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "community_id", nullable = false)
    private Community community;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private CommunityRole role;

    @Column(nullable = false)
    private LocalDateTime joinedAt;

    public CommunityMember() {
    }

    public CommunityMember(Community community, User user, CommunityRole role) {
        this.community = community;
        this.user = user;
        this.role = role;
    }

    @PrePersist
    protected void onCreate() {
        this.joinedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public Community getCommunity() {
        return community;
    }

    public User getUser() {
        return user;
    }

    public CommunityRole getRole() {
        return role;
    }

    public LocalDateTime getJoinedAt() {
        return joinedAt;
    }
}