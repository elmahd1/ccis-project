package com.ccis.SFE.security;

import com.ccis.SFE.entity.User;
import com.ccis.SFE.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminSeeder(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        // Check if an admin already exists
        if (!userRepository.existsByUsername("admin")) {
            
            // Create ADMIN user
            User adminUser = new User();
            adminUser.setUsername("admin");
            adminUser.setEmail("admin@example.com");
            adminUser.setPassword(passwordEncoder.encode("pw"));
            adminUser.setRole("ROLE_ADMIN");
            adminUser.setNom("Admin");
            adminUser.setPrenom("System");
            adminUser.setAccountStatus(User.AccountStatus.ACTIVE);
            userRepository.save(adminUser);
            System.out.println("✅ Default Admin account created! Username: admin | Password: pw");

            // Create EMPLOYEE user
            User employeeUser = new User();
            employeeUser.setUsername("employee");
            employeeUser.setEmail("employee@example.com");
            employeeUser.setNom("Bninha");
            employeeUser.setPrenom("Rachid");
            employeeUser.setPassword(passwordEncoder.encode("pw"));
            employeeUser.setRole("ROLE_EMPLOYEE");
            employeeUser.setAccountStatus(User.AccountStatus.ACTIVE);
            userRepository.save(employeeUser);
            System.out.println("✅ Default Employee account created! Username: employee | Password: pw");
            
        }
    }
}