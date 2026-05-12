package com.ccis.SFE.repository;

import com.ccis.SFE.entity.BaseDemande;
import com.ccis.SFE.entity.DemandeSalle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DemandeSalleRepository extends JpaRepository<DemandeSalle, Long> {
    
    List<DemandeSalle> findByStatus(BaseDemande.DemandeStatus status);

    List<DemandeSalle> findByOrganizationId(Long organizationId);

    List<DemandeSalle> findBySubmittedById(Long userId);
}