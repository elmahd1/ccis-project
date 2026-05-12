package com.ccis.SFE.entity;

import jakarta.persistence.*;
@Entity
@Table(name = "demarche_administrative")
public class DemarcheAdministrative extends BaseDemande {

    private String objetVisite;
    private String document;
    private Double montant; 

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
    public String getDocument() {
        return document;
    }
    public void setDocument(String document) {
        this.document = document;
    }

    
}