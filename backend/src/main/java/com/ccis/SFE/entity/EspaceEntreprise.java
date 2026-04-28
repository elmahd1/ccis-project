package com.ccis.SFE.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "espace_entreprise")
public class EspaceEntreprise {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organization_id", nullable = false)
    private Organization organization;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "submitted_by", nullable = false)
    private User submittedBy;

    // Fields from old EspaceFicheController
    @Column(name = "taille_entreprise")
    private String tailleEntreprise; // e.g., TPE, PME

    @Column(name = "accepte_envoi")
    private Boolean accepteEnvoi; // Oui/Non checkbox for CCIS communications

    @Column(name = "objet_visite", length = 500)
    private String objetVisite; // Comma-separated list of selected checkboxes

    @Column(name = "qualite_conseiller")
    private String qualiteConseillerCCIS; 

    @Column(name = "date_depart")
    private LocalDate dateDepart;

    @Column(name = "heure_depart")
    private String heureDepart;

    @Column(name = "recommandation", length = 1000)
    private String recommandation;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private DemandeStatus status = DemandeStatus.EN_ATTENTE;

    public EspaceEntreprise() {}

    // --- Getters and Setters ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Organization getOrganization() { return organization; }
    public void setOrganization(Organization organization) { this.organization = organization; }
    public User getSubmittedBy() { return submittedBy; }
    public void setSubmittedBy(User submittedBy) { this.submittedBy = submittedBy; }
    public String getTailleEntreprise() { return tailleEntreprise; }
    public void setTailleEntreprise(String tailleEntreprise) { this.tailleEntreprise = tailleEntreprise; }
    public Boolean getAccepteEnvoi() { return accepteEnvoi; }
    public void setAccepteEnvoi(Boolean accepteEnvoi) { this.accepteEnvoi = accepteEnvoi; }
    public String getObjetVisite() { return objetVisite; }
    public void setObjetVisite(String objetVisite) { this.objetVisite = objetVisite; }
    public String getQualiteConseillerCCIS() { return qualiteConseillerCCIS; }
    public void setQualiteConseillerCCIS(String qualiteConseillerCCIS) { this.qualiteConseillerCCIS = qualiteConseillerCCIS; }
    public LocalDate getDateDepart() { return dateDepart; }
    public void setDateDepart(LocalDate dateDepart) { this.dateDepart = dateDepart; }
    public String getHeureDepart() { return heureDepart; }
    public void setHeureDepart(String heureDepart) { this.heureDepart = heureDepart; }
    public String getRecommandation() { return recommandation; }
    public void setRecommandation(String recommandation) { this.recommandation = recommandation; }
    public DemandeStatus getStatus() { return status; }
    public void setStatus(DemandeStatus status) { this.status = status; }

    public enum DemandeStatus { BROUILLON, EN_ATTENTE, VALIDE, REJETE }
}