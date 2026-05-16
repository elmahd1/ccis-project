// OrganizationController.java - Updated create method
package com.ccis.SFE.RESTControllers;

import com.ccis.SFE.dto.CreateOrganizationRequest;
import com.ccis.SFE.entity.Organization;
import com.ccis.SFE.entity.User;
import com.ccis.SFE.entity.UserOrganizationRole;
import com.ccis.SFE.repository.OrganizationRepository;
import com.ccis.SFE.repository.UserOrganizationRoleRepository;
import com.ccis.SFE.repository.UserRepository;
import com.ccis.SFE.service.ActivityLogService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
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
    
    @Autowired
    private ActivityLogService activityLogService;

    // 1. Client creates a new company/association profile (updated)
    @PostMapping("/create")
    public ResponseEntity<?> createOrganization(@RequestParam Long userId, 
                                                 @RequestBody CreateOrganizationRequest orgDetails,
                                                 HttpServletRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Check if user is active
        if (user.getAccountStatus() != User.AccountStatus.ACTIVE) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Votre compte doit être activé avant de créer une organisation.");
        }

        // Create Organization from DTO
        Organization org = new Organization();
        org.setName(orgDetails.getName());
        org.setType(orgDetails.getType());
        org.setIce(orgDetails.getIce());
        org.setFormeJuridique(orgDetails.getFormeJuridique());
        org.setSecteurActivite(orgDetails.getSecteurActivite());
        org.setActivite(orgDetails.getActivite());      // NEW
        org.setTaille(orgDetails.getTaille());          // NEW
        org.setAdresse(orgDetails.getAdresse());
        org.setVille(orgDetails.getVille());
        org.setTelFixe(orgDetails.getTelFixe());
        org.setTelGsm(orgDetails.getTelGsm());
        org.setEmailContact(orgDetails.getEmailContact());
        org.setSiteWeb(orgDetails.getSiteWeb());
        org.setDescription(orgDetails.getDescription());

        // Save the organization
        Organization savedOrg = orgRepository.save(org);

        // Link the user to this organization as the OWNER
        UserOrganizationRole link = new UserOrganizationRole(user, savedOrg, UserOrganizationRole.OrgRole.OWNER);
        roleRepository.save(link);
        
        // Log the creation
        activityLogService.logOrganizationAction(user, savedOrg, "CREATED", request);

        return ResponseEntity.ok(savedOrg);
    }
        
@GetMapping("/user/{userId}")
public ResponseEntity<?> getUserOrganizations(@PathVariable Long userId, HttpServletRequest request) {
    // // Debug logging
    // System.out.println("=== GET /organizations/user/" + userId + " ===");
    // System.out.println("Auth header: " + request.getHeader("Authorization"));
    
    // Get current authenticated user
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    // System.out.println("Authenticated user: " + (auth != null ? auth.getName() : "null"));
    // System.out.println("Authorities: " + (auth != null ? auth.getAuthorities() : "null"));
    
    List<UserOrganizationRole> roles = roleRepository.findByUserId(userId);
    
    List<Organization> userOrgs = roles.stream()
            .map(UserOrganizationRole::getOrganization)
            .collect(Collectors.toList());
            
    return ResponseEntity.ok(userOrgs);
}
    
    @GetMapping("/{id}")
    public ResponseEntity<Organization> getOrganizationById(@PathVariable Long id) {
        return orgRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYEE')")
    public ResponseEntity<List<Organization>> getAllOrganizations() {
        List<Organization> organizations = orgRepository.findAll();
        return ResponseEntity.ok(organizations);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteOrganization(@PathVariable Long id, 
                                                 @RequestParam Long userId,
                                                 HttpServletRequest request) {
        return orgRepository.findById(id).map(org -> {
            User user = userRepository.findById(userId).orElse(null);
            orgRepository.delete(org);
            if (user != null) {
                activityLogService.logOrganizationAction(user, org, "DELETED", request);
            }
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }
    @PutMapping("/{orgId}")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<?> updateOrganization(
            @PathVariable Long orgId,
            @RequestBody CreateOrganizationRequest updatedOrg,
            @RequestParam Long userId,
            HttpServletRequest request) {
        return orgRepository.findById(orgId).map(org -> {
            try {
                // Update allowed fields
                if (updatedOrg.getName() != null) org.setName(updatedOrg.getName());
                if (updatedOrg.getType() != null) org.setType(updatedOrg.getType());
                if (updatedOrg.getIce() != null) org.setIce(updatedOrg.getIce());
                if (updatedOrg.getFormeJuridique() != null) org.setFormeJuridique(updatedOrg.getFormeJuridique());
                if (updatedOrg.getSecteurActivite() != null) org.setSecteurActivite(updatedOrg.getSecteurActivite());
                if (updatedOrg.getActivite() != null) org.setActivite(updatedOrg.getActivite());
                if (updatedOrg.getTaille() != null) org.setTaille(updatedOrg.getTaille());
                if (updatedOrg.getAdresse() != null) org.setAdresse(updatedOrg.getAdresse());
                if (updatedOrg.getVille() != null) org.setVille(updatedOrg.getVille());
                if (updatedOrg.getTelFixe() != null) org.setTelFixe(updatedOrg.getTelFixe());
                if (updatedOrg.getTelGsm() != null) org.setTelGsm(updatedOrg.getTelGsm());
                if (updatedOrg.getEmailContact() != null) org.setEmailContact(updatedOrg.getEmailContact());
                if (updatedOrg.getSiteWeb() != null) org.setSiteWeb(updatedOrg.getSiteWeb());
                if (updatedOrg.getDescription() != null) org.setDescription(updatedOrg.getDescription());
                
                org.setUpdatedAt(LocalDateTime.now());
                
                Organization saved = orgRepository.save(org);
                
                User user = userRepository.findById(userId).orElse(null);
                if (user != null) {
                    activityLogService.logOrganizationAction(user, saved, "UPDATED", request);
                }
                
                return ResponseEntity.ok(saved);
            } catch (Exception e) {
                e.printStackTrace();
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Error updating organization: " + e.getMessage());
            }
        }).orElse(ResponseEntity.notFound().build());
    }
}