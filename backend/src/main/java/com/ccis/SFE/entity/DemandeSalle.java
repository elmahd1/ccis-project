package com.ccis.SFE.entity;

import java.time.LocalDateTime;
import jakarta.persistence.*;

@Entity
@Table(name = "demande_salle")
public class DemandeSalle extends BaseDemande {
    
    private LocalDateTime reunion;
    private String activiteOuSujet;
    private String membres;
    
    @Column(length = 500)
    private String motifRejet;

    public LocalDateTime getReunion() {
        return reunion;
    }
    public void setReunion(LocalDateTime reunion) {
        this.reunion = reunion;
    }
    public String getActiviteOuSujet() {
        return activiteOuSujet;
    }
    public void setActiviteOuSujet(String activiteOuSujet) {
        this.activiteOuSujet = activiteOuSujet;
    }
    public String getMembres() {
        return membres;
    }
    public void setMembres(String membres) {
        this.membres = membres;
    }
    public String getMotifRejet() {
        return motifRejet;
    }
    public void setMotifRejet(String motifRejet) {
        this.motifRejet = motifRejet;
    }
}