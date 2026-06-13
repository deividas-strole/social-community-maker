package com.socialcommunitymaker.backend.image;

import com.socialcommunitymaker.backend.profile.UserProfileResponse;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RequestMapping("/api/images")
@RestController
public class ImageUploadController {

    private final ImageUploadService imageUploadService;

    public ImageUploadController(ImageUploadService imageUploadService) {
        this.imageUploadService = imageUploadService;
    }

    @PostMapping("/avatar")
    public UserProfileResponse uploadAvatar(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestParam("file") MultipartFile file
    ) {
        return imageUploadService.uploadAvatar(authorizationHeader, file);
    }

    @PostMapping("/post")
    public ImageUploadResponse uploadPostImage(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestParam("file") MultipartFile file
    ) {
        return imageUploadService.uploadPostImage(authorizationHeader, file);
    }
}