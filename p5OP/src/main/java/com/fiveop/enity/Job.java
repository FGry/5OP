package com.fiveop.enity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "job")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Job {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "title", nullable = false)
    private String title;
    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;
    @Column(columnDefinition = "TEXT", nullable = false)
    private String requirements;
    @Column(columnDefinition = "TEXT", nullable = false)
    private String benefits;
    @Column(name = "salaryMin", precision = 15, scale = 0)
    private BigDecimal salaryMin;
    @Column(name = "salaryMax", precision = 15, scale = 0)
    private BigDecimal salaryMax;
    @Column(name = "location", nullable = false)
    private String location;
    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private JobType type;
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private JobStatus status;
    @Column(name = "deadline")
    private LocalDate deadLine;
    @Column(name = "created_at")
    private LocalDate createdAT;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;
    @PrePersist
    protected void onCreate(){
        if(status == null){
            status = JobStatus.PENDING;
        }
    }
}
