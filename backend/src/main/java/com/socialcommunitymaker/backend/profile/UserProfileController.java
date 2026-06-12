package com.socialcommunitymaker.backend.profile;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/api/users")
@RestController
public class UserProfileController {

    private final UserProfileService userProfileService;

    public UserProfileController(UserProfileService userProfileService) {
        this.userProfileService = userProfileService;
    }

    @GetMapping("/{username}")
    public UserProfileResponse getProfileByUsername(@PathVariable String username) {
        return userProfileService.getProfileByUsername(username);
    }

    @PutMapping("/me/profile")
    public UserProfileResponse updateCurrentUserProfile(
            @RequestHeader("Authorization") String authorizationHeader,
            @Valid @RequestBody UpdateProfileRequest request
    ) {
        return userProfileService.updateCurrentUserProfile(authorizationHeader, request);
    }
}