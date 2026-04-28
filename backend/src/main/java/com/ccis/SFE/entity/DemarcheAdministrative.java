package com.ccis.SFE.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "demarche_administrative")
public class DemarcheAdministrative {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organization_id", nullable = false)
    private Organization organization;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "submitted_by", nullable = false)
    private User submittedBy;

    // Fields from the old DemarcheFicheController
    @Column(name = "objet_visite")
    private String objetVisite; // e.g., "Visa des factures", "Certificat d'origine"

    @Column(name = "montant")
    private Double montant; 

    @Column(name = "suite_demande")
    private String suiteDemande;

    @Column(name = "observation", length = 1000)
    private String observation;

    @Column(name = "date_delivrance")
    private LocalDate dateDelivrance;

    @Column(name = "heure_delivrance")
    private String heureDelivrance;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private DemandeStatus status = DemandeStatus.EN_ATTENTE;

    public DemarcheAdministrative() {}

    // --- Getters and Setters ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Organization getOrganization() { return organization; }
    public void setOrganization(Organization organization) { this.organization = organization; }
    public User getSubmittedBy() { return submittedBy; }
    public void setSubmittedBy(User submittedBy) { this.submittedBy = submittedBy; }
    public String getObjetVisite() { return objetVisite; }
    public void setObjetVisite(String objetVisite) { this.objetVisite = objetVisite; }
    public Double getMontant() { return montant; }
    public void setMontant(Double montant) { this.montant = montant; }
    public String getSuiteDemande() { return suiteDemande; }
    public void setSuiteDemande(String suiteDemande) { this.suiteDemande = suiteDemande; }
    public String getObservation() { return observation; }
    public void setObservation(String observation) { this.observation = observation; }
    public LocalDate getDateDelivrance() { return dateDelivrance; }
    public void setDateDelivrance(LocalDate dateDelivrance) { this.dateDelivrance = dateDelivrance; }
    public String getHeureDelivrance() { return heureDelivrance; }
    public void setHeureDelivrance(String heureDelivrance) { this.heureDelivrance = heureDelivrance; }
    public DemandeStatus getStatus() { return status; }
    public void setStatus(DemandeStatus status) { this.status = status; }

    public enum DemandeStatus { BROUILLON, EN_ATTENTE, VALIDE, REJETE }
}