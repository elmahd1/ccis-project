package com.ccis.SFE.repository;

import com.ccis.SFE.entity.UserOrganizationRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserOrganizationRoleRepository extends JpaRepository<UserOrganizationRole, Long> {
    // Find all organizations a specific user has access to (For the Client Dashboard)
    List<UserOrganizationRole> findByUserId(Long userId);

    // Find all users attached to a specific organization (For Admin/Employee review)
    List<UserOrganizationRole> findByOrganizationId(Long organizationId);

    // Check if a specific user already has a role in a specific organization
    Optional<UserOrganizationRole> findByUserIdAndOrganizationId(Long userId, Long organizationId);
}