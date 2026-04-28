package com.ccis.SFE.repository;

import com.ccis.SFE.entity.Organization;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrganizationRepository extends JpaRepository<Organization, Long> {
    Optional<Organization> findByIce(String ice);
    List<Organization> findByType(Organization.OrganizationType type);
    Boolean existsByIce(String ice);
}