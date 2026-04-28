package com.ccis.SFE.repository;

import com.ccis.SFE.entity.EspaceEntreprise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EspaceEntrepriseRepository extends JpaRepository<EspaceEntreprise, Long> {
    
    List<EspaceEntreprise> findByStatus(EspaceEntreprise.DemandeStatus status);
    List<EspaceEntreprise> findByOrganizationId(Long organizationId);
    List<EspaceEntreprise> findBySubmittedById(Long userId);
}