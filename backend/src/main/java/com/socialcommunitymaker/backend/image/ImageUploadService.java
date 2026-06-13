package com.socialcommunitymaker.backend.image;

import com.cloudinary.Cloudinary;
import com.socialcommunitymaker.backend.profile.UserProfileResponse;
import com.socialcommunitymaker.backend.security.JwtService;
import com.socialcommunitymaker.backend.user.User;
import com.socialcommunitymaker.backend.user.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.Map;

@Service
public class ImageUploadService {

    private static final long MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024;

    private final Cloudinary cloudinary;
    private final UserRepository userRepository;
    private final JwtService jwtService;

    public ImageUploadService(
            Cloudinary cloudinary,
            UserRepository userRepository,
            JwtService jwtService
    ) {
        this.cloudinary = cloudinary;
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    public UserProfileResponse uploadAvatar(
            String authorizationHeader,
            MultipartFile file
    ) {
        User user = getCurrentUserFromAuthorizationHeader(authorizationHeader);
        validateImageFile(file);

        try {
            Map<?, ?> uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    Map.of(
                            "folder", "social-community-maker/avatars",
                            "resource_type", "image",
                            "overwrite", true
                    )
            );

            String secureUrl = uploadResult.get("secure_url").toString();

            user.setAvatarUrl(secureUrl);
            User savedUser = userRepository.save(user);

            return new UserProfileResponse(
                    savedUser.getId(),
                    savedUser.getEmail(),
                    savedUser.getUsername(),
                    savedUser.getDisplayName(),
                    savedUser.getBio(),
                    savedUser.getAvatarUrl(),
                    savedUser.getCreatedAt(),
                    java.util.List.of(),
                    java.util.List.of(),
                    java.util.List.of()
            );
        } catch (IOException exception) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Image upload failed"
            );
        }
    }

    private void validateImageFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Image file is required"
            );
        }

        if (file.getSize() > MAX_FILE_SIZE_BYTES) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Image must be 2MB or smaller"
            );
        }

        String contentType = file.getContentType();

        if (contentType == null || !contentType.startsWith("image/")) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Only image files are allowed"
            );
        }
    }

    private User getCurrentUserFromAuthorizationHeader(String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Missing or invalid Authorization header"
            );
        }

        String token = authorizationHeader.substring(7);
        String email = jwtService.extractEmail(token);

        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "Invalid token"
                ));

        if (!jwtService.isTokenValid(token, user)) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Invalid or expired token"
            );
        }

        return user;
    }

    public ImageUploadResponse uploadPostImage(
            String authorizationHeader,
            MultipartFile file
    ) {
        getCurrentUserFromAuthorizationHeader(authorizationHeader);
        validateImageFile(file);

        try {
            Map<?, ?> uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    Map.of(
                            "folder", "social-community-maker/posts",
                            "resource_type", "image"
                    )
            );

            String secureUrl = uploadResult.get("secure_url").toString();

            return new ImageUploadResponse(secureUrl);
        } catch (IOException exception) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Image upload failed"
            );
        }
    }
}