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

    // Get the logged-in user's profile details
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
    // @PreAuthorize("hasRole('ADMIN')")  <- Add Spring Security annotations later
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userRepository.findAll();
        // clear passwords before sending to front-end
        users.forEach(u -> u.setPassword("")); 
        return ResponseEntity.ok(users);
    }
}