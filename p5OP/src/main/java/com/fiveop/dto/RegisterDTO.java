package com.fiveop.dto;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDate;
@Data
public class RegisterDTO {
    @NotBlank(message = "username không được để trống!")
    private String username;
    @NotBlank(message = "password không được để trống!")
    @Size(min = 8, message = "Mật khẩu phải có ít nhất 8 ký tự")
    private String password;
    @NotBlank(message = "Ghi đủ họ tên!")
    private String fullName;
    @Email(message = "Email không hợp lệ!")
    @NotBlank(message = "Email không được để trống!")
    private String email;
    private String address;

    @Pattern(regexp = "^0\\d{9}$", message = "Số điện thoại không hợp lệ!")
    private String phoneNumber;
    private String role;
}
