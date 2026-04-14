package com.ccis.SFE.RESTControllers;

import com.ccis.SFE.entity.DemandeSalle;
import com.ccis.SFE.repository.DemandeSalleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/demandes")
@CrossOrigin(origins = "http://localhost:3000")
public class DemandeSalleController {

    @Autowired
    private DemandeSalleRepository demandeSalleRepository;

    @GetMapping("/liste")
    public List<DemandeSalle> getToutesLesDemandes() {
        System.err.println("Récupération de toutes les demandes de salle...");
        System.out.println("Nombre de demandes trouvées : " + demandeSalleRepository.count());
        return demandeSalleRepository.findAll();

    }
    // Éditer une association
    @PutMapping("/editer/{id}")
    public ResponseEntity<DemandeSalle> editerDemande(@PathVariable Long id, @RequestBody DemandeSalle demandeDetails) {
        Optional<DemandeSalle> demandeOptional = demandeSalleRepository.findById(id);

        if (!demandeOptional.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        DemandeSalle demandeToUpdate = demandeOptional.get();
        demandeToUpdate.setNomAssociation(demandeDetails.getNomAssociation());
        demandeToUpdate.setVille((String) demandeDetails.getVille());
        demandeToUpdate.setDateDemande(demandeDetails.getDateDemande());
        demandeToUpdate.setDateReunion(demandeDetails.getDateReunion());
        demandeToUpdate.setHeureReunion(demandeDetails.getHeureReunion());
        demandeToUpdate.setMembre1(demandeDetails.getMembre1());
        demandeToUpdate.setMembre2(demandeDetails.getMembre2());
        demandeToUpdate.setMembre3(demandeDetails.getMembre3());
        demandeToUpdate.setAssociationCreee(demandeDetails.isAssociationCreee());

        DemandeSalle updatedDemande = demandeSalleRepository.save(demandeToUpdate);
        return ResponseEntity.ok(updatedDemande);
    }

    @DeleteMapping("/supprimer/{id}")
    public ResponseEntity<Void> supprimerDemande(@PathVariable Long id) {
        Optional<DemandeSalle> demandeOptional = demandeSalleRepository.findById(id);

        if (!demandeOptional.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        demandeSalleRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}