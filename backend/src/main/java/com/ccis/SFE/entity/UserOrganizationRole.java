package com.ccis.SFE.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "user_organization_roles")
public class UserOrganizationRole {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organization_id", nullable = false)
    private Organization organization;

    @Enumerated(EnumType.STRING)
    @Column(name = "org_role", nullable = false)
    private OrgRole role; // e.g., OWNER, MANAGER, VIEWER

    public UserOrganizationRole() {}

    public UserOrganizationRole(User user, Organization organization, OrgRole role) {
        this.user = user;
        this.organization = organization;
        this.role = role;
    }

    // --- Getters and Setters ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public Organization getOrganization() { return organization; }
    public void setOrganization(Organization organization) { this.organization = organization; }
    public OrgRole getRole() { return role; }
    public void setRole(OrgRole role) { this.role = role; }

    public enum OrgRole {
        OWNER,
        MANAGER,
        VIEWER
    }
}