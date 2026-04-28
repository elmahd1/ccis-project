package com.ccis.SFE.repository;

import com.ccis.SFE.entity.DemandeSalle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DemandeSalleRepository extends JpaRepository<DemandeSalle, Long> {
    
    // For the Employee Dashboard: Get all requests that are pending validation
    List<DemandeSalle> findByStatus(DemandeSalle.DemandeStatus status);

    // For the Client Dashboard: Get all requests made for a specific company/association
    List<DemandeSalle> findByOrganizationId(Long organizationId);

    // Get all requests submitted by a specific user
    List<DemandeSalle> findBySubmittedById(Long userId);
}