package com.fiveop.enity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import jakarta.validation.constraints.Pattern;
@Entity
@Table(name = "profile")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Profile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "full_name", nullable = false, length = 50)
    private String fullName;
    @Column(name = "dob")
    private LocalDate dob;

    @Column(name = "phone", length = 15, unique = true)
    @Pattern(regexp = "^0\\d{9}$", message = "Số điện thoại phải gồm 10 chữ số và bắt đầu bằng số 0")
    private String phone;
    @Column(name = "address")
    private String address;
    @OneToOne
    @JoinColumn(name = "users_id", referencedColumnName = "id")
    private User user;
}
