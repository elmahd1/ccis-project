package com.ccis.SFE.RESTControllers;

import com.ccis.SFE.entity.User;
import com.ccis.SFE.repository.UserRepository;
import com.ccis.SFE.service.ActivityLogService;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ActivityLogService activityLogService;

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserProfile(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setPassword(""); 
        return ResponseEntity.ok(user);
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userRepository.findAll();
        System.out.println("Fetched all users: " + users.size());
        users.forEach(u -> u.setPassword("")); 
        return ResponseEntity.ok(users);
    }

    @PostMapping("/create-employee")
    public ResponseEntity<?> createEmployee(@RequestBody User employee) {
        if (userRepository.findByUsername(employee.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Error: Username is already taken!");
        }

        if (userRepository.findByEmail(employee.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Error: Email is already in use!");
        }

        employee.setRole("ROLE_EMPLOYEE");
        employee.setAccountStatus(User.AccountStatus.ACTIVE); // Employees are active by default
        employee.setPassword(passwordEncoder.encode(employee.getPassword()));
        
        User savedUser = userRepository.save(employee);
        savedUser.setPassword("");
        
        return ResponseEntity.ok(savedUser);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(user -> {
                    if ("ROLE_ADMIN".equals(user.getRole())) {
                        return ResponseEntity.badRequest().body("Cannot delete an Admin account.");
                    }
                    userRepository.delete(user);
                    return ResponseEntity.ok().body("User deleted successfully");
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // ========== ACCOUNT MANAGEMENT ENDPOINTS ==========

    // Activate a client account (Employee/Admin only)
    @PutMapping("/admin/users/{id}/activate")
    @PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYEE')")
    public ResponseEntity<?> activateUser(
            @PathVariable Long id,
            @RequestParam String qualite,
            HttpServletRequest request) {
        
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Only clients can be activated
        if (!"ROLE_CLIENT".equals(user.getRole())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Only client accounts can be activated"));
        }
        
        // Only accounts in PENDING_ACTIVATION status can be activated
        if (user.getAccountStatus() != User.AccountStatus.PENDING_ACTIVATION) {
            return ResponseEntity.badRequest().body(Map.of("error", "Account is not pending activation"));
        }
        
        // Get current logged-in user (employee/admin)
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = userRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new RuntimeException("Current user not found"));
        
        // Activate the account
        user.setAccountStatus(User.AccountStatus.ACTIVE);
        user.setActivatedAt(LocalDateTime.now());
        user.setActivatedBy(currentUser);
        user.setActivatedByQualite(qualite);
        
        userRepository.save(user);
        
        // Log the activation - using the correct method signature
        activityLogService.logAccountActivation(currentUser, user, qualite, request);
        
        return ResponseEntity.ok(Map.of(
            "message", "Account activated successfully",
            "userId", user.getId()
        ));
    }

    // Reject a client account
    @PutMapping("/admin/users/{id}/reject")
    @PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYEE')")
    public ResponseEntity<?> rejectUser(
            @PathVariable Long id,
            @RequestParam String reason,
            HttpServletRequest request) {
        
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (!"ROLE_CLIENT".equals(user.getRole())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Only client accounts can be rejected"));
        }
        
        if (user.getAccountStatus() != User.AccountStatus.PENDING_ACTIVATION) {
            return ResponseEntity.badRequest().body(Map.of("error", "Account is not pending activation"));
        }
        
        // Get current logged-in user (employee/admin)
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = userRepository.findByUsername(auth.getName()).orElse(null);
        
        user.setAccountStatus(User.AccountStatus.REJECTED);
        userRepository.save(user);
        
        // Log the rejection - using method with admin info
        if (currentUser != null) {
            activityLogService.logAccountRejection(currentUser, user, reason, request);
        } else {
            activityLogService.logAccountRejection(user, reason, request);
        }
        
        return ResponseEntity.ok(Map.of(
            "message", "Account rejected",
            "userId", user.getId()
        ));
    }
}