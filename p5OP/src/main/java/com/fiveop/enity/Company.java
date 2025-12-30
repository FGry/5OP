package com.fiveop.enity;
import jakarta.persistence.*;
import lombok.*;
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
    @Column(columnDefinition = "TEXT")
    private String description;
    @Column(name = "logo", nullable = false)
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
    @ToString.Exclude
    private User user;
    @OneToMany(mappedBy = "job", cascade = CascadeType.ALL)
    private Job job;

}
