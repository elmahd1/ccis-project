package com.ccis.SFE.dto;

import com.ccis.SFE.entity.User.StatutClient;

public class CompleteProfileRequest {
    private String nom;
    private String prenom;
    private String numTelFixe;
    private String numTelGsm;
    private String adresse;
    private String ville;
    private StatutClient statut;
    
    // Getters and Setters
    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }
    
    public String getPrenom() { return prenom; }
    public void setPrenom(String prenom) { this.prenom = prenom; }
    
    public String getNumTelFixe() { return numTelFixe; }
    public void setNumTelFixe(String numTelFixe) { this.numTelFixe = numTelFixe; }
    
    public String getNumTelGsm() { return numTelGsm; }
    public void setNumTelGsm(String numTelGsm) { this.numTelGsm = numTelGsm; }
    
    public String getAdresse() { return adresse; }
    public void setAdresse(String adresse) { this.adresse = adresse; }
    
    public String getVille() { return ville; }
    public void setVille(String ville) { this.ville = ville; }
    
    public StatutClient getStatut() { return statut; }
    public void setStatut(StatutClient statut) { this.statut = statut; }
}