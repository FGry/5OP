package com.fiveop.controller;

import com.fiveop.enity.Profile;
import com.fiveop.enity.User;
import com.fiveop.repo.ProfileRepository;
import com.fiveop.repo.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {
    private final ProfileRepository profileRepository;
    private final UserRepository userRepository;
    private final Path fileStorageLocation = Paths.get("upload").toAbsolutePath().normalize();
    @GetMapping("/me")
    public ResponseEntity<?> getMyProfile(){
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
        Profile profile = profileRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                   Profile newProfile = new Profile();
                   newProfile.setUser(user);
                   newProfile.setFullName(user.getUsername());
                   return profileRepository.save(newProfile);
                });
        Map<String, Object> response = new HashMap<>();
        response.put("id", profile.getId());
        response.put("fullName", profile.getFullName());
        response.put("dob", profile.getDob());
        response.put("phone", profile.getPhone());
        response.put("address", profile.getAddress());
        response.put("cvUrl", profile.getCvUrl());
        response.put("email", user.getEmail());
        return ResponseEntity.ok(response);
    }
    @PutMapping("/update")
    public ResponseEntity<?> updateProfile(@RequestBody Profile request){
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
        Profile profile = profileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thông tin người dùng"));
        profile.setFullName(request.getFullName());
        profile.setDob(request.getDob());
        profile.setAddress(request.getAddress());
        profileRepository.save(profile);
        return ResponseEntity.ok("Cập nhật hồ sơ thành công");
    }
    @PostMapping("/upload-cv")
    public ResponseEntity<?> uploadCv(@RequestParam("file")MultipartFile file){
        try {
            if(!Files.exists(fileStorageLocation)){
                Files.createDirectories(fileStorageLocation);
            }
            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path targetLocation = fileStorageLocation.resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            User user = userRepository.findByUsername(username).orElseThrow();
            Profile profile = profileRepository.findByUserId(user.getId()).orElseThrow();
            String fileUrl = "/upload" + fileName;
            profile.setCvUrl(fileUrl);
            profile.setCvUrl(fileUrl);
            profileRepository.save(profile);
            return ResponseEntity.ok(Map.of("message", "Upload thành công", "cvUrl", fileUrl));
        }catch (IOException ex){
            return ResponseEntity.badRequest().body("Không thể upload file: " + ex.getMessage());
        }
    }
}
