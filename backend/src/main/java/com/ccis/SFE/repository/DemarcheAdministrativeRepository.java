package com.ccis.SFE.repository;

import com.ccis.SFE.entity.BaseDemande;
import com.ccis.SFE.entity.DemarcheAdministrative;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DemarcheAdministrativeRepository extends JpaRepository<DemarcheAdministrative, Long> {
    
    List<DemarcheAdministrative> findByStatus(BaseDemande.DemandeStatus status);

    List<DemarcheAdministrative> findByOrganizationId(Long organizationId);

    List<DemarcheAdministrative> findBySubmittedById(Long userId);
}