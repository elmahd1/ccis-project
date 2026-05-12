// AuthController.java - Updated
package com.ccis.SFE.RESTControllers;

import com.ccis.SFE.dto.*;
import com.ccis.SFE.entity.*;
import com.ccis.SFE.repository.*;
import com.ccis.SFE.security.CustomUserDetailsService;
import com.ccis.SFE.security.JwtUtil.JwtUtil;
import com.ccis.SFE.service.ActivityLogService;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private CustomUserDetailsService userDetailsService;
    
    @Autowired
    private ActivityLogService activityLogService;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest, HttpServletRequest request) {
        try {
            UserDetails userDetails = userDetailsService.loadUserByUsername(loginRequest.getUsername());
            
            User user = userRepository.findByUsername(loginRequest.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
                activityLogService.logFailedLogin(loginRequest.getUsername(), request);
                return ResponseEntity.badRequest().body(Map.of("error", "Mot de passe incorrect."));
            }
            
            // Check account status
            if (user.getAccountStatus() == User.AccountStatus.SUSPENDED) {
                return ResponseEntity.status(403).body(Map.of("error", "Votre compte a été suspendu. Veuillez contacter l'administrateur."));
            }
            
            if (user.getAccountStatus() == User.AccountStatus.REJECTED) {
                return ResponseEntity.status(403).body(Map.of("error", "Votre compte a été rejeté. Veuillez contacter l'administrateur pour plus d'informations."));
            }
            
            // Update last login
            user.setLastLogin(LocalDateTime.now());
            userRepository.save(user);

            String realToken = jwtUtil.generateToken(userDetails);
            
            // Log successful login
            activityLogService.logLogin(user, request);
            
            // Include account status in response
            Map<String, Object> response = new HashMap<>();
            response.put("token", realToken);
            response.put("id", user.getId());
            response.put("username", user.getUsername());
            response.put("role", user.getRole());
            response.put("accountStatus", user.getAccountStatus());
            response.put("profileCompleted", user.getAccountStatus() != User.AccountStatus.PENDING_PROFILE_COMPLETION);
            
            return ResponseEntity.ok(response);
            
        } catch (UsernameNotFoundException e) {
            activityLogService.logFailedLogin(loginRequest.getUsername(), request);
            return ResponseEntity.badRequest().body(Map.of("error", "Utilisateur non trouvé."));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody SignupRequest signUpRequest, HttpServletRequest request) {
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email déjà utilisé!"));
        }
        
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Nom d'utilisateur déjà pris!"));
        }

        User user = new User();
        user.setUsername(signUpRequest.getUsername());
        user.setPassword(passwordEncoder.encode(signUpRequest.getPassword()));
        user.setEmail(signUpRequest.getEmail());
        user.setRole("ROLE_CLIENT");
        user.setAccountStatus(User.AccountStatus.PENDING_PROFILE_COMPLETION); // Needs profile completion

        User savedUser = userRepository.save(user);
        
        // Log registration
        activityLogService.logUserRegistration(savedUser, request);
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Inscription réussie! Veuillez compléter votre profil.");
        response.put("userId", savedUser.getId());
        response.put("accountStatus", savedUser.getAccountStatus());
        
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/complete-profile/{userId}")
    public ResponseEntity<?> completeProfile(@PathVariable Long userId, 
                                             @RequestBody CompleteProfileRequest profileRequest,
                                             HttpServletRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        
        // Check if user is in the correct state
        if (user.getAccountStatus() != User.AccountStatus.PENDING_PROFILE_COMPLETION) {
            return ResponseEntity.badRequest().body(Map.of("error", "Le profil a déjà été complété ou le compte est déjà activé."));
        }
        
        // Update profile information
        user.setNom(profileRequest.getNom());
        user.setPrenom(profileRequest.getPrenom());
        user.setNumTelFixe(profileRequest.getNumTelFixe());
        user.setNumTelGsm(profileRequest.getNumTelGsm());
        user.setAdresse(profileRequest.getAdresse());
        user.setVille(profileRequest.getVille());
        user.setStatut(profileRequest.getStatut());
        user.setProfileCompletedAt(LocalDateTime.now());
        user.setAccountStatus(User.AccountStatus.PENDING_ACTIVATION); // Now waiting for employee activation
        
        userRepository.save(user);
        
        // Log profile completion
        activityLogService.logProfileCompletion(user, request);
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Profil complété avec succès! Votre compte est en attente d'activation par un employé.");
        response.put("accountStatus", user.getAccountStatus());
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/account-status/{userId}")
    public ResponseEntity<?> getAccountStatus(@PathVariable Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        
        Map<String, Object> response = new HashMap<>();
        response.put("accountStatus", user.getAccountStatus());
        response.put("role", user.getRole());
        response.put("profileCompleted", user.getProfileCompletedAt() != null);
        
        return ResponseEntity.ok(response);
    }
}