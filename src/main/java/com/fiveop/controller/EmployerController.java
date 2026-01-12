package com.fiveop.controller;

import com.fiveop.enity.*;
import com.fiveop.repo.ApplicationRepository;
import com.fiveop.repo.CompanyRepository;
import com.fiveop.repo.JobRepository;
import com.fiveop.repo.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("api/employer")
@RequiredArgsConstructor
public class EmployerController {
    private final JobRepository jobRepository;
    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;
    private final ApplicationRepository applicationRepository;
    private User getCurrentUser(){
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng!"));
    }
    private Company getCurrentCompany(){
        User user = getCurrentUser();
        return companyRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Bạn chưa tạo hồ sơ công ty!"));
    }
    @GetMapping("/jobs")
    public ResponseEntity<?> getMyJobs(){
        try{
            Company company = getCurrentCompany();
            List<Job> jobs = jobRepository.findByCompanyId(company.getId());
            return ResponseEntity.ok(jobs);
        } catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @GetMapping("/applications")
    private ResponseEntity<?> getCompanyApplications(){
        try {
            Company company = getCurrentCompany();
            List<Job> jobs = jobRepository.findByCompanyId(company.getId());
            List<Application> applications = new ArrayList<>();
            for (Job job : jobs){
                List<Application> apps = applicationRepository.findByJobId(job.getId());
                applications.addAll(apps);
            }
            return ResponseEntity.ok(applications);
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @PutMapping("/applications/{appId}/status")
    private ResponseEntity<?> updateApplicationStatus(@PathVariable Long appId,@RequestParam String status){
        try {
            Application app = applicationRepository.findById(appId)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn ứng tuyển!"));
            Company myCompany = getCurrentCompany();
            if(!app.getJob().getCompany().getId().equals(myCompany.getId())){
                return ResponseEntity.status(403).body("Bạn không có quyền xử lí đơn này!");
            }
            try {
                ApplicationStatus newStatus = ApplicationStatus.valueOf(status);
                app.setStatus(newStatus);
                applicationRepository.save(app);
                return ResponseEntity.ok(app);
            } catch (IllegalArgumentException e){
                return ResponseEntity.badRequest().body("Trạng thái không hợp lệ!");
            }
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @DeleteMapping("/job/{jobId}")
    public ResponseEntity<?> deleteJob(@PathVariable Long jobId){
        try {
            Company company = getCurrentCompany();
            Job job = jobRepository.findById(jobId).orElseThrow(() -> new RuntimeException("Không tìm thấy công việc!"));
            if(!job.getCompany().getId().equals(company.getId())){
                return ResponseEntity.status(403).body("Không có quyền xoá!");
            }
            jobRepository.delete(job);
            return ResponseEntity.ok("Xoá thành công!");
        } catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
