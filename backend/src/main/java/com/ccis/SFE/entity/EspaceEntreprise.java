package com.ccis.SFE.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
@Entity
@Table(name = "espace_entreprise")
public class EspaceEntreprise extends BaseDemande {

    private String tailleEntreprise; 
    private Boolean accepteEnvoi;
    @Column(length = 500)
    private String objetVisite;
    private String qualiteConseillerCCIS;
    private LocalDateTime dateHeureDepart;  
    private String recommandation;

    public String getTailleEntreprise() {
        return tailleEntreprise;
    }
    public void setTailleEntreprise(String tailleEntreprise) {
        this.tailleEntreprise = tailleEntreprise;
    }
    public Boolean getAccepteEnvoi() {
        return accepteEnvoi;
    }
    public void setAccepteEnvoi(Boolean accepteEnvoi) {
        this.accepteEnvoi = accepteEnvoi;
    }
    public String getObjetVisite() {
        return objetVisite;
    }
    public void setObjetVisite(String objetVisite) {
        this.objetVisite = objetVisite;
    }
    public String getQualiteConseillerCCIS() {
        return qualiteConseillerCCIS;
    }
    public void setQualiteConseillerCCIS(String qualiteConseillerCCIS) {
        this.qualiteConseillerCCIS = qualiteConseillerCCIS;
    }
    public LocalDateTime getDateHeureDepart() {
        return dateHeureDepart;
    }
    public void setDateHeureDepart(LocalDateTime dateHeureDepart) {
        this.dateHeureDepart = dateHeureDepart;
    }
    public String getRecommandation() {
        return recommandation;
    }
    public void setRecommandation(String recommandation) {
        this.recommandation = recommandation;
    }

}