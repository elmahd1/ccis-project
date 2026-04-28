package com.ccis.SFE.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "organizations")
public class Organization {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private OrganizationType type; // e.g., ASSOCIATION, ENTREPRISE

    @Column(length = 50)
    private String ice; // For enterprises

    @Column(length = 500)
    private String description;
    
    @Column(name = "is_officially_created")
    private boolean isOfficiallyCreated; // Replaces associationCreee from DemandeSalle

    // Link back to the bridge table
    @OneToMany(mappedBy = "organization", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UserOrganizationRole> users = new ArrayList<>();

    public Organization() {}

    public Organization(String name, OrganizationType type, String ice, String description, boolean isOfficiallyCreated) {
        this.name = name;
        this.type = type;
        this.ice = ice;
        this.description = description;
        this.isOfficiallyCreated = isOfficiallyCreated;
    }

    // --- Getters and Setters ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public OrganizationType getType() { return type; }
    public void setType(OrganizationType type) { this.type = type; }
    public String getIce() { return ice; }
    public void setIce(String ice) { this.ice = ice; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public boolean isOfficiallyCreated() { return isOfficiallyCreated; }
    public void setOfficiallyCreated(boolean officiallyCreated) { isOfficiallyCreated = officiallyCreated; }
    public List<UserOrganizationRole> getUsers() { return users; }
    public void setUsers(List<UserOrganizationRole> users) { this.users = users; }

    public enum OrganizationType {
        ASSOCIATION,
        ENTREPRISE
    }
}