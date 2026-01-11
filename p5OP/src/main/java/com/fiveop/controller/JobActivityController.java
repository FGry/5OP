package com.fiveop.controller;

import com.fiveop.enity.*;
import com.fiveop.repo.ApplicationRepository;
import com.fiveop.repo.JobRepository;
import com.fiveop.repo.SaveJobRepository;
import com.fiveop.repo.UserRepository;
import java.io.IOException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/activity")
@RequiredArgsConstructor
public class JobActivityController {
    private final SaveJobRepository saveJobRepository;
    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    // Đường dẫn thư mục lưu file
    private static final String UPLOAD_DIR = "uploads/cv/";

    private User getCurrentUser(){
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng!"));
    }

    @PostMapping("/save/{jobId}")
    public ResponseEntity<?> toggleSaveJob(@PathVariable Long jobId){
        User user = getCurrentUser();
        if(saveJobRepository.existsByUserIdAndJobId(user.getId(), jobId)){
            SaveJob saveJob = saveJobRepository.findByUserIdAndJobId(user.getId(), jobId).get();
            saveJobRepository.delete(saveJob);
            return ResponseEntity.ok("Đã bỏ lưu công việc");
        } else {
            Job job = jobRepository.findById(jobId).orElseThrow(() -> new RuntimeException("Không tìm thấy công việc!"));
            SaveJob saveJob = SaveJob.builder().user(user).job(job).build();
            saveJobRepository.save(saveJob);
            return ResponseEntity.ok("Đã lưu công việc");
        }
    }

    @GetMapping("/saved")
    private ResponseEntity<?> getSaveJobs(){
        User user = getCurrentUser();
        List<SaveJob> saveJobs = saveJobRepository.findByUserId(user.getId());
        List<Job> jobs = saveJobs.stream().map(SaveJob::getJob).collect(Collectors.toList());
        return ResponseEntity.ok(jobs);
    }

    @PostMapping("/apply/{jobId}")
    public ResponseEntity<?> applyJob(
            @PathVariable Long jobId,
            @RequestParam(value = "cvFile", required = false) MultipartFile cvFile,
            @RequestParam(value = "useProfileCv", required = false) Boolean useProfileCv
    ) {
        try {
            User user = getCurrentUser();
            Job job = jobRepository.findById(jobId)
                    .orElseThrow(() -> new RuntimeException("Công việc không tồn tại"));

            if (applicationRepository.existsByUserIdAndJobId(user.getId(), jobId)) {
                return ResponseEntity.badRequest().body("Bạn đã ứng tuyển công việc này rồi!");
            }

            String finalCvPath = null;

            if (Boolean.TRUE.equals(useProfileCv)) {
                if (user.getProfile() == null || user.getProfile().getCvUrl() == null || user.getProfile().getCvUrl().isEmpty()) {
                    return ResponseEntity.badRequest().body("Bạn chưa cập nhật CV trong hồ sơ cá nhân!");
                }

                String profileCvUrl = user.getProfile().getCvUrl();
                finalCvPath = profileCvUrl.startsWith("/") ? profileCvUrl.substring(1) : profileCvUrl;

                Path checkPath = Paths.get(finalCvPath);
                if (!Files.exists(checkPath)) {
                }
            }
            else if (cvFile != null && !cvFile.isEmpty()) {
                String fileName = UUID.randomUUID().toString() + "_" + cvFile.getOriginalFilename();
                Path uploadPath = Paths.get(UPLOAD_DIR);
                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                }
                Path filePath = uploadPath.resolve(fileName);
                Files.copy(cvFile.getInputStream(), filePath);

                finalCvPath = filePath.toString();
            }
            else {
                return ResponseEntity.badRequest().body("Vui lòng chọn CV hoặc upload CV mới!");
            }

            // Lưu vào Database
            Application application = Application.builder()
                    .user(user)
                    .job(job)
                    .cv(finalCvPath)
                    .status(ApplicationStatus.PENDING)
                    .build();

            applicationRepository.save(application);
            return ResponseEntity.ok("Ứng tuyển thành công!");

        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Lỗi hệ thống: " + e.getMessage());
        } catch (Exception e) {
            e.printStackTrace(); // In lỗi ra console để dễ debug
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
    }

    @GetMapping("/applied")
    private ResponseEntity<?> getAppliedJobs(){
        User user = getCurrentUser();
        List<Application> applications = applicationRepository.findByUserId(user.getId());
        return ResponseEntity.ok(applications);
    }
}