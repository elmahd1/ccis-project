package com.ccis.SFE.RESTControllers;

import com.ccis.SFE.entity.*;
import com.ccis.SFE.repository.*;
import com.ccis.SFE.service.DocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/employee/demandes")
@CrossOrigin(origins = "*")
public class EmployeeDemandeController {

    @Autowired private DemarcheAdministrativeRepository demarcheRepo;
    @Autowired private EspaceEntrepriseRepository espaceRepo;
    @Autowired private DemandeSalleRepository salleRepo;
    @Autowired private DocumentService documentService;

    // --- 1. BOITE DE RECEPTION ---
    
    @GetMapping("/pending")
    public ResponseEntity<Map<String, Object>> getAllPendingRequests() {
        Map<String, Object> pending = new HashMap<>();
        pending.put("demarches", demarcheRepo.findByStatus(BaseDemande.DemandeStatus.EN_ATTENTE));
        pending.put("espaces", espaceRepo.findByStatus(BaseDemande.DemandeStatus.EN_ATTENTE));
        pending.put("salles", salleRepo.findByStatus(BaseDemande.DemandeStatus.EN_ATTENTE));
        return ResponseEntity.ok(pending);
    }

    // --- 2. VALIDATION ET REJET ---

    @PutMapping("/administrative/{id}/validate")
    public ResponseEntity<?> validateDemarche(@PathVariable Long id) {
        return demarcheRepo.findById(id).map(req -> {
            req.setStatus(BaseDemande.DemandeStatus.VALIDE);
            return ResponseEntity.ok(demarcheRepo.save(req));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/administrative/{id}/reject")
    public ResponseEntity<?> rejectDemarche(@PathVariable Long id) {
        return demarcheRepo.findById(id).map(req -> {
            req.setStatus(BaseDemande.DemandeStatus.REJETE);
            return ResponseEntity.ok(demarcheRepo.save(req));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/espace/{id}/validate")
    public ResponseEntity<?> validateEspace(@PathVariable Long id) {
        return espaceRepo.findById(id).map(req -> {
            req.setStatus(BaseDemande.DemandeStatus.VALIDE);
            return ResponseEntity.ok(espaceRepo.save(req));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/salle/{id}/validate")
    public ResponseEntity<?> validateSalle(@PathVariable Long id) {
        return salleRepo.findById(id).map(req -> {
            req.setStatus(BaseDemande.DemandeStatus.VALIDE);
            return ResponseEntity.ok(salleRepo.save(req));
        }).orElse(ResponseEntity.notFound().build());
    }

    // --- 3. DOWNLOADS ---

    @GetMapping("/{type}/{id}/download")
    public ResponseEntity<byte[]> downloadDocuments(@PathVariable String type, @PathVariable Long id) {
        try {
            byte[] fileData;
            String fileName;

            switch (type.toLowerCase()) {
                case "administrative":
                    DemarcheAdministrative demarche = demarcheRepo.findById(id).orElseThrow();
                    fileData = documentService.generateDemarcheDocument(demarche);
                    fileName = "Fiche_Demarche_" + id + ".docx";
                    break;
                case "espace":
                    EspaceEntreprise espace = espaceRepo.findById(id).orElseThrow();
                    fileData = documentService.generateEspaceDocument(espace);
                    fileName = "Fiche_Espace_" + id + ".docx";
                    break;
                case "salle":
                    DemandeSalle salle = salleRepo.findById(id).orElseThrow();
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
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}