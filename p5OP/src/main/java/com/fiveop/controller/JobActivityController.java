package com.fiveop.controller;

import com.fiveop.enity.Application;
import com.fiveop.enity.Job;
import com.fiveop.enity.SaveJob;
import com.fiveop.enity.User;
import com.fiveop.repo.ApplicationRepository;
import com.fiveop.repo.JobRepository;
import com.fiveop.repo.SaveJobRepository;
import com.fiveop.repo.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/activity")
@RequiredArgsConstructor
public class JobActivityController {
    private final SaveJobRepository saveJobRepository;
    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private User getCurrentUser(){
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng!"));
    }
    @PostMapping
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
    private ResponseEntity<?> applyJob(@PathVariable Long jobId){
        User user = getCurrentUser();
        Job job = jobRepository.findById(jobId).orElseThrow();
        Application application = Application.builder().user(user).job(job).build();
        applicationRepository.save(application);
        return ResponseEntity.ok("Ứng tuyển thành công");
    }
    @GetMapping("/applied")
    private ResponseEntity<?> getAppliedJobs(){
        User user = getCurrentUser();
        List<Application> applications = applicationRepository.findByJobId(user.getId());
        return ResponseEntity.ok(applications);
    }
}
