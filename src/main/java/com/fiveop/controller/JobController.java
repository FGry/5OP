package com.fiveop.controller;

import com.fiveop.enity.*;
import com.fiveop.repo.CompanyRepository;
import com.fiveop.repo.JobRepository;
import com.fiveop.repo.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
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
    @GetMapping("/search")
    public ResponseEntity<?> searchJobs(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) JobType type,
            @RequestParam(required = false) BigDecimal salary){

        if(keyword != null && keyword.trim().isEmpty()) keyword = null;
        if(location != null && (location.trim().isEmpty() || "Tất cả".equals(location))) location = null;

        String keywordParam = (keyword != null) ? "%" + keyword.toLowerCase() + "%" : null;
        String locationParam = (location != null) ? "%" + location.toLowerCase() + "%" : null;

        List<Job> jobs = jobRepository.searchJobs(keywordParam, locationParam, type, salary);
        return ResponseEntity.ok(jobs);
    }
    @GetMapping("/search-basic")
    public ResponseEntity<?> searchBasic(
            @RequestParam String title,
            @RequestParam String location) {
        List<Job> jobs = jobRepository.findByTitleContainingIgnoreCaseAndLocationContainingIgnoreCase(title, location);
        return ResponseEntity.ok(jobs);
    }
    @GetMapping("/company/{companyId}")
    public ResponseEntity<?> getJobsByCompany(@PathVariable Long companyId) {
        List<Job> jobs = jobRepository.findByCompanyId(companyId);
        return ResponseEntity.ok(jobs);
    }
    @GetMapping("/high-salary")
    public ResponseEntity<?> getHighSalaryJobs(@RequestParam BigDecimal minSalary) {
        List<Job> jobs = jobRepository.findJobsWithHighSalary(minSalary);
        return ResponseEntity.ok(jobs);
    }
    @GetMapping("/{id}")
    public ResponseEntity<?> getJobDetail(@PathVariable Long id){
        return jobRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
