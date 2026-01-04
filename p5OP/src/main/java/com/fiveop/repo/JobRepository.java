package com.fiveop.repo;

import com.fiveop.enity.Job;
import com.fiveop.enity.JobStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface JobRepository extends JpaRepository<Job, Long> {
    List<Job> findByStatus(JobStatus status);
    List<Job> findByTitleContainingIgnoreCaseAndLocationContainingIgnoreCase(String title, String location);
    List<Job> findByCompanyId(Long companyId);
    @Query("SELECT j FROM Job j WHERE j.salaryMin >= :minSalary AND j.status = com.fiveop.enity.JobStatus.OPEN")
    List<Job> findJobsWithHighSalary(@Param("minSalary")BigDecimal minSalary);
}
