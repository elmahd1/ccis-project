package com.ccis.SFE.RESTControllers;

import com.ccis.SFE.entity.*;
import com.ccis.SFE.repository.*;
import com.ccis.SFE.service.DocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.ccis.SFE.entity.DemarcheAdministrative;
import com.ccis.SFE.repository.DemarcheAdministrativeRepository;
import org.springframework.http.MediaType;
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

    // --- 1. BOITE DE RECEPTION (PENDING REQUESTS) ---
    
    @GetMapping("/pending")
    public ResponseEntity<Map<String, Object>> getAllPendingRequests() {
        Map<String, Object> pending = new HashMap<>();
        pending.put("demarches", demarcheRepo.findByStatus(DemarcheAdministrative.DemandeStatus.EN_ATTENTE));
        pending.put("espaces", espaceRepo.findByStatus(EspaceEntreprise.DemandeStatus.EN_ATTENTE));
        pending.put("salles", salleRepo.findByStatus(DemandeSalle.DemandeStatus.EN_ATTENTE));
        return ResponseEntity.ok(pending);
    }

    // --- 2. VALIDATION ET REJET ---

    @PutMapping("/administrative/{id}/validate")
    public ResponseEntity<?> validateDemarche(@PathVariable Long id) {
        DemarcheAdministrative req = demarcheRepo.findById(id).orElseThrow();
        req.setStatus(DemarcheAdministrative.DemandeStatus.VALIDE);
        return ResponseEntity.ok(demarcheRepo.save(req));
    }

    @PutMapping("/espace/{id}/validate")
    public ResponseEntity<?> validateEspace(@PathVariable Long id) {
        EspaceEntreprise req = espaceRepo.findById(id).orElseThrow();
        req.setStatus(EspaceEntreprise.DemandeStatus.VALIDE);
        return ResponseEntity.ok(espaceRepo.save(req));
    }

    @PutMapping("/salle/{id}/validate")
    public ResponseEntity<?> validateSalle(@PathVariable Long id) {
        DemandeSalle req = salleRepo.findById(id).orElseThrow();
        req.setStatus(DemandeSalle.DemandeStatus.VALIDE);
        return ResponseEntity.ok(salleRepo.save(req));
    }

    // --- 3. TELECHARGEMENT DES DOCUMENTS GENERES ---

    @GetMapping(value = "/administrative/{id}/download", produces = "application/vnd.openxmlformats-officedocument.wordprocessingml.document")
    public ResponseEntity<byte[]> downloadDemarche(@PathVariable Long id) {
        DemarcheAdministrative req = demarcheRepo.findById(id).orElseThrow();
        byte[] doc = documentService.generateDemarcheDocument(req);
        
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=Fiche_Demarche_" + id + ".docx");
        return ResponseEntity.ok().headers(headers).body(doc);
    }

    @GetMapping(value = "/espace/{id}/download", produces = "application/vnd.openxmlformats-officedocument.wordprocessingml.document")
    public ResponseEntity<byte[]> downloadEspace(@PathVariable Long id) {
        EspaceEntreprise req = espaceRepo.findById(id).orElseThrow();
        byte[] doc = documentService.generateEspaceDocument(req);
        
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=Fiche_Espace_" + id + ".docx");
        return ResponseEntity.ok().headers(headers).body(doc);
    }

    @GetMapping(value = "/salle/{id}/download", produces = "application/zip")
    public ResponseEntity<byte[]> downloadSalle(@PathVariable Long id) {
        DemandeSalle req = salleRepo.findById(id).orElseThrow();
        byte[] zipData = documentService.processAndDownloadZip(req, null);
        
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=Dossier_Salle_" + id + ".zip");
        return ResponseEntity.ok().headers(headers).body(zipData);
    }

    @GetMapping("/{type}/{id}/download")
    public ResponseEntity<byte[]> downloadDocuments(
            @PathVariable String type, 
            @PathVariable Long id) {
        
        try {
            byte[] fileData = null;
            String fileName = "documents_" + id;

            // Handle different types of requests
            switch (type.toLowerCase()) {
                case "administrative":
                    // DemarcheAdministrative demarche = demarcheRepo.findById(id).orElseThrow();
                    // fileData = documentService.generateOrFetchDemarcheDoc(demarche);
                    fileName += "_demarche.zip";
                    break;
                    
                case "espace":
                    // EspaceEntreprise espace = espaceRepo.findById(id).orElseThrow();
                    // fileData = documentService.generateOrFetchEspaceDoc(espace);
                    fileName += "_espace.zip";
                    break;
                    
                case "salle":
                    // DemandeSalle salle = salleRepo.findById(id).orElseThrow();
                    // fileData = documentService.processAndDownloadZip(salle, null); // Using your existing method
                    fileName += "_salle.zip";
                    break;
                    
                default:
                    return ResponseEntity.badRequest().body(null);
            }

            // Fallback for empty data during testing
            if (fileData == null) {
                fileData = "Fichiers non trouvés ou en cours de développement".getBytes();
                fileName += ".txt";
            }

            // Set the headers to force a file download in the browser
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDispositionFormData("attachment", fileName);

            return new ResponseEntity<>(fileData, headers, HttpStatus.OK);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}