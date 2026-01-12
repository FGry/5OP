package com.fiveop.repo;

import com.fiveop.enity.SaveJob;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SaveJobRepository extends JpaRepository<SaveJob, Long> {
    List<SaveJob> findByUserId(Long userId);
    Optional<SaveJob> findByUserIdAndJobId(Long userId, Long jobId);
    boolean existsByUserIdAndJobId(Long userId, Long jobId);
}
