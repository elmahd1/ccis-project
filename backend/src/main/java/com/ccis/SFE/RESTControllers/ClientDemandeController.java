package com.ccis.SFE.RESTControllers;

import com.ccis.SFE.entity.*;
import com.ccis.SFE.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/client/demandes")
@CrossOrigin(origins = "*")
public class ClientDemandeController {

    @Autowired private DemarcheAdministrativeRepository demarcheRepo;
    @Autowired private EspaceEntrepriseRepository espaceRepo;
    @Autowired private DemandeSalleRepository salleRepo;
    @Autowired private OrganizationRepository orgRepo;
    @Autowired private UserRepository userRepo;

    // --- 1. SOUMETTRE LES DEMANDES ---

    @PostMapping("/administrative")
    public ResponseEntity<?> submitDemarche(@RequestParam Long userId, @RequestParam Long orgId, @RequestBody DemarcheAdministrative demarche) {
        User user = userRepo.findById(userId).orElseThrow();
        Organization org = orgRepo.findById(orgId).orElseThrow();
        demarche.setSubmittedBy(user);
        demarche.setOrganization(org);
        demarche.setStatus(DemarcheAdministrative.DemandeStatus.EN_ATTENTE);
        return ResponseEntity.ok(demarcheRepo.save(demarche));
    }

    @PostMapping("/espace")
    public ResponseEntity<?> submitEspace(@RequestParam Long userId, @RequestParam Long orgId, @RequestBody EspaceEntreprise espace) {
        User user = userRepo.findById(userId).orElseThrow();
        Organization org = orgRepo.findById(orgId).orElseThrow();
        espace.setSubmittedBy(user);
        espace.setOrganization(org);
        espace.setStatus(EspaceEntreprise.DemandeStatus.EN_ATTENTE);
        return ResponseEntity.ok(espaceRepo.save(espace));
    }

    @PostMapping("/salle")
    public ResponseEntity<?> submitSalle(@RequestParam Long userId, @RequestParam Long orgId, @RequestBody DemandeSalle salle) {
        User user = userRepo.findById(userId).orElseThrow();
        Organization org = orgRepo.findById(orgId).orElseThrow();
        salle.setSubmittedBy(user);
        salle.setOrganization(org);
        salle.setStatus(DemandeSalle.DemandeStatus.EN_ATTENTE);
        return ResponseEntity.ok(salleRepo.save(salle));
    }

    // --- 2. HISTORIQUE GLOBAL POUR LE DASHBOARD CLIENT ---
    
    @GetMapping("/history/{orgId}")
    public ResponseEntity<Map<String, Object>> getFullHistory(@PathVariable Long orgId) {
        // We combine all history into one response for the Client Dashboard
        Map<String, Object> history = new HashMap<>();
        history.put("demarches", demarcheRepo.findByOrganizationId(orgId));
        history.put("espaces", espaceRepo.findByOrganizationId(orgId));
        history.put("salles", salleRepo.findByOrganizationId(orgId));
        return ResponseEntity.ok(history);
    }
}