package com.ccis.SFE.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
@Entity
@Table(name = "demarche_administrative")
public class DemarcheAdministrative extends BaseDemande {

    private String objetVisite; 
    private Double montant; 
    private String suiteDemande;
    private String observation;
    private LocalDateTime dateHeureDelivrance;

    public String getObjetVisite() {
        return objetVisite;
    }
    public void setObjetVisite(String objetVisite) {
        this.objetVisite = objetVisite;
    }
    public Double getMontant() {
        return montant;
    }
    public void setMontant(Double montant) {
        this.montant = montant;
    }
    public String getSuiteDemande() {
        return suiteDemande;
    }
    public void setSuiteDemande(String suiteDemande) {
        this.suiteDemande = suiteDemande;
    }

    public String getObservation() {
        return observation;
    }
    public void setObservation(String observation) {
        this.observation = observation;
    }
    public LocalDateTime getDateHeureDelivrance() {
        return dateHeureDelivrance;
    }
    public void setDateHeureDelivrance(LocalDateTime dateHeureDelivrance) {
        this.dateHeureDelivrance = dateHeureDelivrance;
    }
    
}