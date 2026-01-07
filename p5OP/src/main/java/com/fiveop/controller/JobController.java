package com.fiveop.controller;

import com.fiveop.enity.Company;
import com.fiveop.enity.Job;
import com.fiveop.enity.JobStatus;
import com.fiveop.enity.User;
import com.fiveop.repo.CompanyRepository;
import com.fiveop.repo.JobRepository;
import com.fiveop.repo.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobController {
    private final JobRepository jobRepository;
    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;
    @GetMapping("/public")
    public ResponseEntity<?> getAllOpenJobs(){
        List<Job> jobs = jobRepository.findByStatusOrderByCreatedAtDesc(JobStatus.OPEN);
        return ResponseEntity.ok(jobs);
    }
    @PostMapping("/create")
    public ResponseEntity<?> createJob(@RequestBody Job jobRequest){
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng!"));
        Company company = companyRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Bạn chưa tạo hồ sơ công ty!"));
        jobRequest.setCompany(company);
        if(jobRequest.getStatus() == null){
            jobRequest.setStatus(JobStatus.OPEN);
        }
        Job saveJob = jobRepository.save(jobRequest);
        return ResponseEntity.ok(saveJob);
    }
}
