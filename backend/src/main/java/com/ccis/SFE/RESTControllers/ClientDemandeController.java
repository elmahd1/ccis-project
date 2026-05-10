package com.ccis.SFE.RESTControllers;

import com.ccis.SFE.entity.*;
import com.ccis.SFE.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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

    @PostMapping("/administrative")
    public ResponseEntity<?> submitDemarche(@RequestParam Long userId, @RequestParam Long orgId, @RequestBody DemarcheAdministrative demarche) {
        return userRepo.findById(userId).map(user -> 
            orgRepo.findById(orgId).map(org -> {
                demarche.setSubmittedBy(user);
                demarche.setOrganization(org);
                demarche.setStatus(BaseDemande.DemandeStatus.EN_ATTENTE);
                return ResponseEntity.status(HttpStatus.CREATED).body(demarcheRepo.save(demarche));
            }).orElse(ResponseEntity.notFound().build())
        ).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/espace")
    public ResponseEntity<?> submitEspace(@RequestParam Long userId, @RequestParam Long orgId, @RequestBody EspaceEntreprise espace) {
        return userRepo.findById(userId).map(user -> 
            orgRepo.findById(orgId).map(org -> {
                espace.setSubmittedBy(user);
                espace.setOrganization(org);
                espace.setStatus(BaseDemande.DemandeStatus.EN_ATTENTE);
                return ResponseEntity.status(HttpStatus.CREATED).body(espaceRepo.save(espace));
            }).orElse(ResponseEntity.notFound().build())
        ).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/salle")
    public ResponseEntity<?> submitSalle(@RequestParam Long userId, @RequestParam Long orgId, @RequestBody DemandeSalle salle) {
        return userRepo.findById(userId).map(user -> 
            orgRepo.findById(orgId).map(org -> {
                salle.setSubmittedBy(user);
                salle.setOrganization(org);
                salle.setStatus(BaseDemande.DemandeStatus.EN_ATTENTE);
                return ResponseEntity.status(HttpStatus.CREATED).body(salleRepo.save(salle));
            }).orElse(ResponseEntity.notFound().build())
        ).orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/history/{orgId}")
    public ResponseEntity<Map<String, Object>> getFullHistory(@PathVariable Long orgId) {
        Map<String, Object> history = new HashMap<>();
        history.put("demarches", demarcheRepo.findByOrganizationId(orgId));
        history.put("espaces", espaceRepo.findByOrganizationId(orgId));
        history.put("salles", salleRepo.findByOrganizationId(orgId));
        return ResponseEntity.ok(history);
    }

    @GetMapping("/history/user/{userId}")
    public ResponseEntity<Map<String, Object>> getUserFullHistory(@PathVariable Long userId) {
        Map<String, Object> history = new HashMap<>();
        history.put("demarches", demarcheRepo.findBySubmittedById(userId));
        history.put("espaces", espaceRepo.findBySubmittedById(userId));
        history.put("salles", salleRepo.findBySubmittedById(userId));
        return ResponseEntity.ok(history);
    }
}