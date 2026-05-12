package com.ccis.SFE.RESTControllers;

import com.ccis.SFE.entity.*;
import com.ccis.SFE.service.DemandeService;
import com.ccis.SFE.service.DocumentService;
import com.ccis.SFE.service.ActivityLogService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/employee/demandes")
@CrossOrigin(origins = "*")
public class EmployeeDemandeController {

    @Autowired 
    private DemandeService demandeService;
    
    @Autowired 
    private DocumentService documentService;
    
    @Autowired 
    private ActivityLogService activityLogService;

    // ==================== PENDING REQUESTS ====================
    
    @GetMapping("/pending")
    public ResponseEntity<?> getAllPendingRequests() {
        try {
            Map<String, Object> pending = demandeService.getAllPendingRequests();
            return ResponseEntity.ok(pending);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // ==================== DEMARCHE ADMINISTRATIVE ====================
    
    @PutMapping("/administrative/{id}/validate")
    public ResponseEntity<?> validateDemarche(
            @PathVariable Long id, 
            @RequestParam Long employeeId,
            @RequestBody Map<String, String> body,
            HttpServletRequest request) {
        try {
            String qualite = body.get("qualite");
            DemarcheAdministrative updated = demandeService.validateDemarche(id, employeeId, qualite);
            
            // Log the action
            User employee = null; // You would fetch this from the service or repository
            activityLogService.logDemandeAction(employee, updated, "VALIDATED", qualite, request);
            
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/administrative/{id}/reject")
    public ResponseEntity<?> rejectDemarche(
            @PathVariable Long id, 
            @RequestParam Long employeeId,
            @RequestBody Map<String, String> body,
            HttpServletRequest request) {
        try {
            String qualite = body.get("qualite");
            String observation = body.get("observation");
            DemarcheAdministrative updated = demandeService.rejectDemarche(id, employeeId, observation, qualite);
            
            User employee = null;
            activityLogService.logDemandeAction(employee, updated, "REJECTED", qualite, request);
            
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // ==================== ESPACE ENTREPRISE ====================
    
    @PutMapping("/espace/{id}/validate")
    public ResponseEntity<?> validateEspace(
            @PathVariable Long id,
            @RequestParam Long employeeId,
            @RequestBody Map<String, String> body,
            HttpServletRequest request) {
        try {
            String qualite = body.get("qualite");
            EspaceEntreprise updated = demandeService.validateEspace(id, employeeId, qualite);
            
            User employee = null;
            activityLogService.logDemandeAction(employee, updated, "VALIDATED", qualite, request);
            
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }
    
    @PutMapping("/espace/{id}/reject")
    public ResponseEntity<?> rejectEspace(
            @PathVariable Long id,
            @RequestParam Long employeeId,
            @RequestBody Map<String, String> body,
            HttpServletRequest request) {
        try {
            String qualite = body.get("qualite");
            String observation = body.get("observation");
            EspaceEntreprise updated = demandeService.rejectEspace(id, employeeId, observation, qualite);
            
            User employee = null;
            activityLogService.logDemandeAction(employee, updated, "REJECTED", qualite, request);
            
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // ==================== DEMANDE SALLE ====================
    
    @PutMapping("/salle/{id}/validate")
    public ResponseEntity<?> validateSalle(
            @PathVariable Long id,
            @RequestParam Long employeeId,
            @RequestBody Map<String, String> body,
            HttpServletRequest request) {
        try {
            String qualite = body.get("qualite");
            DemandeSalle updated = demandeService.validateSalle(id, employeeId, qualite);
            
            User employee = null;
            activityLogService.logDemandeAction(employee, updated, "VALIDATED", qualite, request);
            
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }
    
    @PutMapping("/salle/{id}/reject")
    public ResponseEntity<?> rejectSalle(
            @PathVariable Long id,
            @RequestParam Long employeeId,
            @RequestBody Map<String, String> body,
            HttpServletRequest request) {
        try {
            String qualite = body.get("qualite");
            String observation = body.get("observation");
            DemandeSalle updated = demandeService.rejectSalle(id, employeeId, observation, qualite);
            
            User employee = null;
            activityLogService.logDemandeAction(employee, updated, "REJECTED", qualite, request);
            
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // ==================== DOCUMENT DOWNLOAD ====================
    
    @GetMapping("/{type}/{id}/download")
    public ResponseEntity<byte[]> downloadDocuments(
            @PathVariable String type, 
            @PathVariable Long id) {
        try {
            byte[] fileData;
            String fileName;

            switch (type.toLowerCase()) {
                case "administrative":
                    DemarcheAdministrative demarche = demandeService.getDemarcheById(id);
                    fileData = documentService.generateDemarcheDocument(demarche);
                    fileName = "Fiche_Demarche_" + id + ".docx";
                    break;
                case "espace":
                    EspaceEntreprise espace = demandeService.getEspaceById(id);
                    fileData = documentService.generateEspaceDocument(espace);
                    fileName = "Fiche_Espace_" + id + ".docx";
                    break;
                case "salle":
                    DemandeSalle salle = demandeService.getSalleById(id);
                    fileData = documentService.processAndDownloadZip(salle, null);
                    fileName = "Dossier_Salle_" + id + ".zip";
                    break;
                default:
                    return ResponseEntity.badRequest().build();
            }

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(type.equalsIgnoreCase("salle") ? 
                    MediaType.valueOf("application/zip") : 
                    MediaType.valueOf("application/vnd.openxmlformats-officedocument.wordprocessingml.document"));
            headers.setContentDispositionFormData("attachment", fileName);

            return new ResponseEntity<>(fileData, headers, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}