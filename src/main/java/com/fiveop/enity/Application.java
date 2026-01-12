package com.fiveop.enity;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "applications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Application {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name="cv", nullable = false)
    private String cv;
    @Column(name = "cover_letter", columnDefinition = "TEXT")
    private String coverLetter;
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ApplicationStatus status;
    @Column(name = "applied_at")
    private LocalDateTime appliedAt;
    @ManyToOne
    @JoinColumn(name="job_id")
    @ToString.Exclude
    private Job job;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @ToString.Exclude
    private User user;

    @PrePersist
    protected void onCreate(){
        appliedAt = LocalDateTime.now();
        if(status == null){
            status = ApplicationStatus.PENDING;
        }
    }
}
