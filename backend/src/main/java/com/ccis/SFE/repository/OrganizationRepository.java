package com.ccis.SFE.repository;

import com.ccis.SFE.entity.Organization;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrganizationRepository extends JpaRepository<Organization, Long> {
    Optional<Organization> findByIce(String ice);
    List<Organization> findByType(Organization.OrganizationType type);
    Boolean existsByIce(String ice);
    
    @Modifying
    @Transactional
    @Query("DELETE FROM Organization o WHERE o.id = ?1")
    void deleteByIdWithCascade(Long id);
    
    // @Query("SELECT CASE WHEN COUNT(d) > 0 THEN true ELSE false END FROM BaseDemande d WHERE d.organization.id = :id AND d.status = :status")
    // boolean existsByIdAndDemandesStatus(@Param("id") Long id, @Param("status") String status);

}