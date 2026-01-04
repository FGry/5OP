package com.fiveop.service;

import com.fiveop.dto.RegisterDTO;
import com.fiveop.enity.Profile;
import com.fiveop.enity.Role;
import com.fiveop.enity.User;
import com.fiveop.repo.ProfileRepository;
import com.fiveop.repo.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Locale;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;
    private final PasswordEncoder passwordEncoder;
    @Transactional
    public User register(RegisterDTO request){
        if(userRepository.existsByUsername(request.getUsername())){
            throw new RuntimeException("Tên đăng nhập đã tồn tại!");
        }
        if(userRepository.existsByEmail(request.getEmail())){
            throw new RuntimeException("Email đã tổn tại!");
        }
        if(profileRepository.existsByPhone(request.getPhoneNumber())){
            throw new RuntimeException("Số điện thoại đã tồn tại!");
        }
        Role role;
        try{
            role = Role.valueOf(request.getRole().toUpperCase());
        } catch (IllegalArgumentException e){
            role = Role.USER;
        }
        User user = User.builder().username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .email(request.getEmail())
                .role(role)
                .build();
        Profile profile = Profile.builder()
                .fullName(request.getFullName())
                .phone(request.getPhoneNumber())
                .address(request.getAddress())
                .user(user)
                .build();
        user.setProfile(profile);
        return userRepository.save(user);
    }
}
