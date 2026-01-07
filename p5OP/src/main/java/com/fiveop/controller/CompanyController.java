package com.fiveop.controller;

import com.fiveop.config.SecurityConfig;
import com.fiveop.enity.Company;
import com.fiveop.enity.User;
import com.fiveop.repo.CompanyRepository;
import com.fiveop.repo.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/company")
@RequiredArgsConstructor
public class CompanyController {
    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;
    private User getCurrentUser(){
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng!"));
    }
    @GetMapping("/my-company")
    public ResponseEntity<?> getMyCompany(){
        User user = getCurrentUser();
        return ResponseEntity.ok(companyRepository.findByUserId(user.getId()).orElse(null));
    }
    @PostMapping("/save")
    private ResponseEntity<?> saveCompany(@RequestBody Company request){
        User user = getCurrentUser();
        Company company = companyRepository.findByUserId(user.getId())
                .orElse(new Company());
        company.setName(request.getName());
        company.setDescription(request.getDescription());
        company.setLogo(request.getLogo());
        company.setWebsite(request.getWebsite());
        company.setLocation(request.getLocation());
        company.setScale(request.getScale());
        if(company.getUser() == null){
            company.setUser(user);
        }
        try {
            Company savedCompany = companyRepository.save(company);
            return ResponseEntity.ok(savedCompany);
        } catch (Exception e){
            return ResponseEntity.badRequest().body("Tên công ty có thể đã tồn tại hoặc dữ liệu không hợp lệ!");
        }
    }
}
