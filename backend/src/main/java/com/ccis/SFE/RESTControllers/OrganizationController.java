package com.ccis.SFE.RESTControllers;

import com.ccis.SFE.entity.Organization;
import com.ccis.SFE.entity.User;
import com.ccis.SFE.entity.UserOrganizationRole;
import com.ccis.SFE.repository.OrganizationRepository;
import com.ccis.SFE.repository.UserOrganizationRoleRepository;
import com.ccis.SFE.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/organizations")
@CrossOrigin(origins = "*")
public class OrganizationController {

    @Autowired
    private OrganizationRepository orgRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserOrganizationRoleRepository roleRepository;

    // 1. Client creates a new company/association profile
    @PostMapping("/create")
    public ResponseEntity<?> createOrganization(@RequestParam Long userId, @RequestBody Organization orgDetails) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Save the organization
        Organization savedOrg = orgRepository.save(orgDetails);

        // Link the user to this organization as the OWNER
        UserOrganizationRole link = new UserOrganizationRole(user, savedOrg, UserOrganizationRole.OrgRole.OWNER);
        roleRepository.save(link);

        return ResponseEntity.ok(savedOrg);
    }

    // 2. Get all organizations a specific user has access to
    @GetMapping("/my-workspaces/{userId}")
    public ResponseEntity<List<Organization>> getUserOrganizations(@PathVariable Long userId) {
        List<UserOrganizationRole> roles = roleRepository.findByUserId(userId);
        
        List<Organization> userOrgs = roles.stream()
                .map(UserOrganizationRole::getOrganization)
                .collect(Collectors.toList());
                
        return ResponseEntity.ok(userOrgs);
    }
}