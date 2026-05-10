package com.ccis.SFE.entity;
import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "demande_salle")
public class DemandeSalle extends BaseDemande {
    
    private LocalDateTime dateHeureReunion;
    private String activiteOuSujet;
    private String adresse;
    private String membres;     

    public LocalDateTime getDateHeureReunion() {
        return dateHeureReunion;
    }
    public void setDateHeureReunion(LocalDateTime dateHeureReunion) {
        this.dateHeureReunion = dateHeureReunion;
    }
    public String getActiviteOuSujet() {
        return activiteOuSujet;
    }
    public void setActiviteOuSujet(String activiteOuSujet) {
        this.activiteOuSujet = activiteOuSujet;
    }
    public String getAdresse() {
        return adresse;
    }
    public void setAdresse(String adresse) {
        this.adresse = adresse;
    }
    public String getMembres() {
        return membres;
    }
    public void setMembres(String membres) {
        this.membres = membres;
    }
    
}