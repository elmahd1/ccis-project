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
        // Check if an admin already exists in the database
        if (!userRepository.existsByUsername("admin")) {
            
            User adminUser = new User();
            adminUser.setUsername("admin");
            adminUser.setEmail("admin@example.com");
            adminUser.setPassword(passwordEncoder.encode("admin123")); 
            adminUser.setRole("ROLE_ADMIN"); // Set as Admin
            
            userRepository.save(adminUser);
            System.out.println("✅ Default Admin account created successfully! Username: admin | Password: admin123");
        }
    }
}