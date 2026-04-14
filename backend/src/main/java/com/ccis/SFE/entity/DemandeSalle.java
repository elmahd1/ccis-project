package com.ccis.SFE.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonProperty;


import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalDateTime;

import org.jspecify.annotations.Nullable;

@Entity
@Table(name = "demande_salle")
public class DemandeSalle {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "nom_association", nullable = false)
    private String nomAssociation;

    @Column(name = "is_created")
    private boolean associationCreee;
    
    @Column(name = "date_demande")
    private LocalDate dateDemande;

    @Column(name = "date_reunion")
    private LocalDate dateReunion;
    
    @Column(name = "heure_reunion")
    private String heureReunion; // Changed to String to handle formatting easily

    @Column(name = "membre1")
    private String membre1;
    
    @Column(name = "membre2")
    private String membre2;
    
    @Column(name = "membre3")
    private String membre3;

    @Column(name = "adresse") // Renamed from ville
    private String adresse;

    @Column(name = "activite_sujet") // New field
    private String activiteOuSujet;


    
    // Constructors
    public DemandeSalle() {}
    
    public DemandeSalle(String nomAssociation, LocalDate dateDemande, LocalDate dateReunion, 
                        String heureReunion, String membre1, String membre2, String membre3, String activiteOuSujet, String adresse) {
        this.nomAssociation = nomAssociation;
        this.dateDemande = dateDemande;
        this.dateReunion = dateReunion;
        this.heureReunion = heureReunion.toString(); // Convert Time to String
        this.membre1 = membre1;
        this.membre2 = membre2;
        this.membre3 = membre3;
        this.activiteOuSujet = activiteOuSujet;
        this.adresse = adresse;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getNomAssociation() {
        return nomAssociation;
    }
    
    public void setNomAssociation(String nomAssociation) {
        this.nomAssociation = nomAssociation;
    }
    
    public LocalDate getDateDemande() {
        return dateDemande;
    }
    
    public void setDateDemande(LocalDate dateDemande) {
        this.dateDemande = dateDemande;
    }
    
    public LocalDate getDateReunion() {
        return dateReunion;
    }
    
    public void setDateReunion(LocalDate dateReunion) {
        this.dateReunion = dateReunion;
    }
    
    public String getHeureReunion() {
        return heureReunion;
    }
    
    public void setHeureReunion(String heureReunion) {
        this.heureReunion = heureReunion;
    }
    
    public String getMembre1() {
        return membre1;
    }
    
    public void setMembre1(String membre1) {
        this.membre1 = membre1;
    }
    
    public String getMembre2() {
        return membre2;
    }
    
    public void setMembre2(String membre2) {
        this.membre2 = membre2;
    }
    
    public String getMembre3() {
        return membre3;
    }
    
    public void setMembre3(String membre3) {
        this.membre3 = membre3;
    }
    
    // public LocalDateTime getCreatedAt() {
    //     return createdAt;
    // }
    
    // public void setCreatedAt(LocalDateTime createdAt) {
    //     this.createdAt = createdAt;
    // }

    public Object getVille() {
        return adresse;
    }
    public void setVille(String ville) {
        this.adresse = ville;
    }
    public boolean isAssociationCreee() {
        return associationCreee;
    }
    public void setAssociationCreee(boolean associationCreee) {
        this.associationCreee = associationCreee;
    }
    public String getActiviteOuSujet() {
        return activiteOuSujet;
    }
    public void setActiviteOuSujet(String activiteOuSujet) {
        this.activiteOuSujet = activiteOuSujet;
    }
    
}