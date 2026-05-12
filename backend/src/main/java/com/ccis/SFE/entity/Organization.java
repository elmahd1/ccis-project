package com.ccis.SFE.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "organizations")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Organization {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrganizationType type; // ASSOCIATION or ENTREPRISE

    // --- Identification ---
    @Column(unique = true)
    private String ice; // Identification Commune de l'Entreprise

    private String formeJuridique; // SARL, SA, Auto-entrepreneur, etc.
    
    private String secteurActivite;
    
    // NEW FIELDS - Company specific
    private String activite;        // Detailed activity description
    private String taille;          // MICRO, PETITE, MOYENNE, GRANDE

    // --- Contact Information ---
    private String adresse;
    private String ville;
    private String telFixe;
    private String telGsm;
    private String emailContact;
    private String siteWeb;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    // --- Specific Logic ---
    @Column(name = "is_officially_created")
    private boolean isOfficiallyCreated; // For Associations

    @Column(length = 1000)
    private String description;

    // --- Relationships ---
    @OneToMany(mappedBy = "organization", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("organization")
    private List<UserOrganizationRole> users = new ArrayList<>();

    @OneToMany(mappedBy = "organization")
    @JsonIgnore
    private List<BaseDemande> demandes = new ArrayList<>();

    public enum OrganizationType {
        ASSOCIATION, ENTREPRISE
    }
    
    // Enum for company size
    public enum TailleEntreprise {
        MICRO,      // 0-9 employees
        PETITE,     // 10-49 employees
        MOYENNE,    // 50-249 employees
        GRANDE      // 250+ employees
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public OrganizationType getType() { return type; }
    public void setType(OrganizationType type) { this.type = type; }
    
    public String getIce() { return ice; }
    public void setIce(String ice) { this.ice = ice; }
    
    public String getFormeJuridique() { return formeJuridique; }
    public void setFormeJuridique(String formeJuridique) { this.formeJuridique = formeJuridique; }
    
    public String getSecteurActivite() { return secteurActivite; }
    public void setSecteurActivite(String secteurActivite) { this.secteurActivite = secteurActivite; }
    
    public String getActivite() { return activite; }
    public void setActivite(String activite) { this.activite = activite; }
    
    public String getTaille() { return taille; }
    public void setTaille(String taille) { this.taille = taille; }
    
    public String getAdresse() { return adresse; }
    public void setAdresse(String adresse) { this.adresse = adresse; }
    
    public String getVille() { return ville; }
    public void setVille(String ville) { this.ville = ville; }
    
    public String getTelFixe() { return telFixe; }
    public void setTelFixe(String telFixe) { this.telFixe = telFixe; }
    
    public String getTelGsm() { return telGsm; }
    public void setTelGsm(String telGsm) { this.telGsm = telGsm; }
    
    public String getEmailContact() { return emailContact; }
    public void setEmailContact(String emailContact) { this.emailContact = emailContact; }
    
    public String getSiteWeb() { return siteWeb; }
    public void setSiteWeb(String siteWeb) { this.siteWeb = siteWeb; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    public boolean isOfficiallyCreated() { return isOfficiallyCreated; }
    public void setOfficiallyCreated(boolean isOfficiallyCreated) { this.isOfficiallyCreated = isOfficiallyCreated; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public List<UserOrganizationRole> getUsers() { return users; }
    public void setUsers(List<UserOrganizationRole> users) { this.users = users; }
    
    public List<BaseDemande> getDemandes() { return demandes; }
    public void setDemandes(List<BaseDemande> demandes) { this.demandes = demandes; }
}