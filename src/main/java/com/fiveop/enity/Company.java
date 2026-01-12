package com.fiveop.enity;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "companies")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Company {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "name", nullable = false, unique = true)
    private String name;
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
    @Column(name = "logo", nullable = false, columnDefinition = "TEXT")
    private String logo;
    @Column(name = "website")
    private String website;
    @Column(name = "location", nullable = false)
    private String location;
    @Enumerated(EnumType.STRING)
    @Column(name = "scale", nullable = false)
    private CompanyScale scale;
    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    @JsonIgnore
    @ToString.Exclude
    private User user;
    @OneToMany(mappedBy = "company", cascade = CascadeType.ALL)
    @ToString.Exclude
    @JsonIgnore
    private List<Job> jobs;

}
