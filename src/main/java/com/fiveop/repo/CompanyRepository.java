package com.fiveop.repo;

import com.fiveop.enity.Company;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CompanyRepository extends JpaRepository<Company, Long> {
    Optional<Company> findByUserId(Long userId);
    List<Company> findByNameContainingIgnoreCase(String name);
}
