package com.ccis.SFE.RESTControllers;

import com.ccis.SFE.dto.JwtResponse;
import com.ccis.SFE.dto.LoginRequest;
import com.ccis.SFE.dto.SignupRequest;
import com.ccis.SFE.entity.User;
import com.ccis.SFE.repository.UserRepository;
import com.ccis.SFE.security.JwtUtil.JwtUtil;

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
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        User user = userRepository.findByUsername(loginRequest.getUsername())
                .orElse(null);

        if (user == null) {
            return ResponseEntity.badRequest().body("Erreur: Utilisateur non trouvé.");
        }

        UserDetails userDetails = org.springframework.security.core.userdetails.User
                .withUsername(user.getUsername())
                .password(user.getPassword())
                .authorities(user.getRole())
                .build();

        String realToken = jwtUtil.generateToken(userDetails);

        return ResponseEntity.ok(new JwtResponse(
                realToken, 
                user.getId(), 
                user.getUsername(), 
                user.getRole()
        ));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity.badRequest().body("Error: Email is already in use!");
        }

        // Use Setters since the User class didn't show a constructor
        User user = new User();
        user.setUsername(signUpRequest.getUsername());
        // In a real app, use: passwordEncoder.encode(signUpRequest.getPassword())
        user.setPassword(signUpRequest.getPassword()); 
        user.setEmail(signUpRequest.getEmail());
        user.setRole("ROLE_CLIENT"); 

        userRepository.save(user);
        return ResponseEntity.ok("User registered successfully!");
    }
}