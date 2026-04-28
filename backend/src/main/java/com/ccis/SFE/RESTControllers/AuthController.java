package com.ccis.SFE.RESTControllers;

import com.ccis.SFE.dto.JwtResponse;
import com.ccis.SFE.dto.LoginRequest;
import com.ccis.SFE.dto.SignupRequest;
import com.ccis.SFE.entity.User;
import com.ccis.SFE.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private com.ccis.SFE.security.JwtUtil.JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        // Find the user in the database
        User user = userRepository.findByUsername(loginRequest.getUsername())
                .orElse(null);

        if (user == null) {
            return ResponseEntity.badRequest().body("Erreur: Utilisateur non trouvé.");
        }

        // 🛑 THE FIX: Convert your database 'User' into Spring Security's 'UserDetails'
        UserDetails userDetails = org.springframework.security.core.userdetails.User
                .withUsername(user.getUsername())
                .password(user.getPassword())
                .authorities(user.getRole())
                .build();

        // Now we can safely pass the userDetails to generate the token!
        String realToken = jwtUtil.generateToken(userDetails);

        // Return the real token to the frontend
        return ResponseEntity.ok(new JwtResponse(
                realToken, 
                user.getId(), 
                user.getUsername(), 
                user.getRole()
        ));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody SignupRequest signUpRequest) {
        // 1. Check if email exists
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity.badRequest().body("Error: Email is already in use!");
        }

        // 2. Create the user object. Default role is ROLE_CLIENT for public signups.
        User user = new User(
                signUpRequest.getUsername(), 
                "encrypted_password_here", // Use PasswordEncoder!
                signUpRequest.getEmail(), 
                "ROLE_CLIENT" 
        );

        userRepository.save(user);

        return ResponseEntity.ok("User registered successfully!");
    }
}