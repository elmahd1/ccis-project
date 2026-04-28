package com.ccis.SFE.repository;

import com.ccis.SFE.entity.DemarcheAdministrative;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DemarcheAdministrativeRepository extends JpaRepository<DemarcheAdministrative, Long> {
    
    // For the Employee Dashboard: Find all papers waiting to be processed
    List<DemarcheAdministrative> findByStatus(DemarcheAdministrative.DemandeStatus status);

    // For the Client Dashboard: Find all administrative papers for a specific company
    List<DemarcheAdministrative> findByOrganizationId(Long organizationId);

    // Get all requests submitted by a specific user
    List<DemarcheAdministrative> findBySubmittedById(Long userId);
}