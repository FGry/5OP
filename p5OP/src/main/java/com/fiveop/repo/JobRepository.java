package com.fiveop.repo;

import com.fiveop.enity.Job;
import com.fiveop.enity.JobStatus;
import com.fiveop.enity.JobType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface JobRepository extends JpaRepository<Job, Long> {
    List<Job> findByStatusOrderByCreatedAtDesc(JobStatus status);
    List<Job> findByTitleContainingIgnoreCaseAndLocationContainingIgnoreCase(String title, String location);
    List<Job> findByCompanyId(Long companyId);
    @Query("SELECT j FROM Job j WHERE j.salaryMin >= :minSalary AND j.status = com.fiveop.enity.JobStatus.OPEN")
    List<Job> findJobsWithHighSalary(@Param("minSalary")BigDecimal minSalary);
    @Query("SELECT j FROM Job j WHERE j.status = com.fiveop.enity.JobStatus.OPEN " +
            "AND (:keyword IS NULL OR LOWER(j.title) LIKE :keyword OR LOWER(j.company.name) LIKE :keyword) " +
            "AND (:location IS NULL OR LOWER(j.location) LIKE :location) " +
            "AND (:type IS NULL OR j.type = :type)" +
            "AND (:salary IS NULL OR j.salaryMin >= :salary)")

    List<Job> searchJobs(@Param("keyword") String keyword,
                         @Param("location") String location,
                         @Param("type") JobType type,
                         @Param("salary") BigDecimal salary);
}
