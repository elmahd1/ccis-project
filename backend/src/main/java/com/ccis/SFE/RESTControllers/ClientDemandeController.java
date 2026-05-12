package com.ccis.SFE.RESTControllers;

import com.ccis.SFE.entity.*;
import com.ccis.SFE.service.DemandeService;
import com.ccis.SFE.service.ActivityLogService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.servlet.http.HttpServletRequest;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/client/demandes")
@CrossOrigin(origins = "*")
public class ClientDemandeController {

    @Autowired
    private DemandeService demandeService;
    
    @Autowired
    private ActivityLogService activityLogService;

    // ==================== DEMARCHE ADMINISTRATIVE ====================
    
    @PostMapping("/administrative")
    public ResponseEntity<?> submitDemarche(
            @RequestParam Long userId, 
            @RequestParam Long orgId, 
            @RequestBody DemarcheAdministrative demarche,
            HttpServletRequest request) {
        try {
            DemarcheAdministrative saved = demandeService.createDemarche(userId, orgId, demarche);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error creating demande: " + e.getMessage()));
        }
    }

    // ==================== ESPACE ENTREPRISE ====================
    
    @PostMapping("/espace")
    public ResponseEntity<?> submitEspace(
            @RequestParam Long userId, 
            @RequestParam Long orgId, 
            @RequestBody EspaceEntreprise espace,
            HttpServletRequest request) {
        try {
            EspaceEntreprise saved = demandeService.createEspace(userId, orgId, espace);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error creating demande: " + e.getMessage()));
        }
    }

    // ==================== DEMANDE SALLE ====================
    
    @PostMapping("/salle")
    public ResponseEntity<?> submitSalle(
            @RequestParam Long userId, 
            @RequestParam Long orgId, 
            @RequestBody DemandeSalle salle,
            HttpServletRequest request) {
        try {
            DemandeSalle saved = demandeService.createSalle(userId, orgId, salle);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error creating demande: " + e.getMessage()));
        }
    }
    
    @PostMapping("/salle/{demandeId}/upload")
    public ResponseEntity<?> uploadSalleFiles(
            @PathVariable Long demandeId, 
            @RequestParam("files") List<MultipartFile> files,
            HttpServletRequest request) {
        try {
            List<Attachment> attachments = demandeService.uploadSalleAttachments(demandeId, files, request);
            return ResponseEntity.ok(Map.of(
                "message", "Files uploaded successfully",
                "count", attachments.size()
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error uploading files: " + e.getMessage()));
        }
    }
    
    @GetMapping("/salle/{demandeId}/attachments")
    public ResponseEntity<?> getSalleAttachments(@PathVariable Long demandeId) {
        try {
            List<Attachment> attachments = demandeService.getAttachmentsByDemande(demandeId);
            return ResponseEntity.ok(attachments);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // ==================== HISTORY ====================
    
    @GetMapping("/history/org/{orgId}")
    public ResponseEntity<?> getOrganizationHistory(@PathVariable Long orgId) {
        try {
            Map<String, Object> history = demandeService.getFullHistory(orgId);
            return ResponseEntity.ok(history);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/history/user/{userId}")
    public ResponseEntity<?> getUserHistory(@PathVariable Long userId) {
        try {
            Map<String, Object> history = demandeService.getUserFullHistory(userId);
            return ResponseEntity.ok(history);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }
}