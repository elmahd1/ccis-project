package com.ccis.SFE.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "demande_salle")
public class DemandeSalle {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    // Linking the request to the specific Organization
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organization_id", nullable = false)
    private Organization organization;

    // Linking the request to the specific User who submitted it
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "submitted_by", nullable = false)
    private User submittedBy;
    
    @Column(name = "date_demande")
    private LocalDate dateDemande;

    @Column(name = "date_reunion")
    private LocalDate dateReunion;
    
    @Column(name = "heure_reunion")
    private String heureReunion;

    @Column(name = "membre1")
    private String membre1;
    
    @Column(name = "membre2")
    private String membre2;
    
    @Column(name = "membre3")
    private String membre3;

    @Column(name = "adresse")
    private String adresse;

    @Column(name = "activite_sujet")
    private String activiteOuSujet;

    // A status field is vital since you are adding Client/Employee workflows
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private DemandeStatus status = DemandeStatus.EN_ATTENTE;
    
    public DemandeSalle() {}

    // --- Getters and Setters ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Organization getOrganization() { return organization; }
    public void setOrganization(Organization organization) { this.organization = organization; }
    public User getSubmittedBy() { return submittedBy; }
    public void setSubmittedBy(User submittedBy) { this.submittedBy = submittedBy; }
    public LocalDate getDateDemande() { return dateDemande; }
    public void setDateDemande(LocalDate dateDemande) { this.dateDemande = dateDemande; }
    public LocalDate getDateReunion() { return dateReunion; }
    public void setDateReunion(LocalDate dateReunion) { this.dateReunion = dateReunion; }
    public String getHeureReunion() { return heureReunion; }
    public void setHeureReunion(String heureReunion) { this.heureReunion = heureReunion; }
    public String getMembre1() { return membre1; }
    public void setMembre1(String membre1) { this.membre1 = membre1; }
    public String getMembre2() { return membre2; }
    public void setMembre2(String membre2) { this.membre2 = membre2; }
    public String getMembre3() { return membre3; }
    public void setMembre3(String membre3) { this.membre3 = membre3; }
    public String getAdresse() { return adresse; }
    public void setAdresse(String adresse) { this.adresse = adresse; }
    public String getActiviteOuSujet() { return activiteOuSujet; }
    public void setActiviteOuSujet(String activiteOuSujet) { this.activiteOuSujet = activiteOuSujet; }
    public DemandeStatus getStatus() { return status; }
    public void setStatus(DemandeStatus status) { this.status = status; }

    public enum DemandeStatus {
        BROUILLON, // Draft
        EN_ATTENTE, // Pending approval
        VALIDE, // Approved by employee
        REJETE // Rejected
    }
}