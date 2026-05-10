package com.ccis.SFE.RESTControllers;

import com.ccis.SFE.entity.User;
import com.ccis.SFE.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserProfile(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Ensure you never send back the raw password in the JSON response!
        user.setPassword(""); 
        return ResponseEntity.ok(user);
    }

    // Example of an Admin-only route: View all users
    @GetMapping("/all")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userRepository.findAll();
        System.out.println("Fetched all users: " + users.size());
        // clear passwords before sending to front-end
        users.forEach(u -> u.setPassword("")); 
        return ResponseEntity.ok(users);
    }
    // Add this to your UserController.java

@PostMapping("/create-employee")
public ResponseEntity<?> createEmployee(@RequestBody User employee) {
    // 1. Basic validation
    if (userRepository.findByUsername(employee.getUsername()).isPresent()) {
        return ResponseEntity.badRequest().body("Error: Username is already taken!");
    }

    if (userRepository.findByEmail(employee.getEmail()).isPresent()) {
        return ResponseEntity.badRequest().body("Error: Email is already in use!");
    }

    // 2. Set default properties for an employee
    employee.setRole("ROLE_EMPLOYEE"); 
    
    // IMPORTANT: In a real app, you must hash the password before saving!
    // employee.setPassword(passwordEncoder.encode(employee.getPassword()));
    
    User savedUser = userRepository.save(employee);
    savedUser.setPassword(""); // Hide password in response
    
    return ResponseEntity.ok(savedUser);
}
// Add this to UserController.java

@DeleteMapping("/{id}")
public ResponseEntity<?> deleteUser(@PathVariable Long id) {
    return userRepository.findById(id)
            .map(user -> {
                // Security check: Don't let them delete the last admin if you want
                if ("ROLE_ADMIN".equals(user.getRole())) {
                    return ResponseEntity.badRequest().body("Cannot delete an Admin account.");
                }
                userRepository.delete(user);
                return ResponseEntity.ok().body("User deleted successfully");
            })
            .orElse(ResponseEntity.notFound().build());
}
}