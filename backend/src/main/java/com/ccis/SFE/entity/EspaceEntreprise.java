package com.ccis.SFE.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
@Entity
@Table(name = "espace_entreprise")
public class EspaceEntreprise extends BaseDemande {

    private Boolean accepteEnvoi;
    @Column(length = 500)
    private String objetVisite;


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


}