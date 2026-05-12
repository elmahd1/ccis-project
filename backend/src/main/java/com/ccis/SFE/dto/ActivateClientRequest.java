package com.ccis.SFE.dto;

public class ActivateClientRequest {
    private String qualite; // Employee's position/quality (e.g., "Conseiller CCIS", "Responsable")
    private String observation; // Optional observation about the activation
    
    public String getQualite() { return qualite; }
    public void setQualite(String qualite) { this.qualite = qualite; }
    
    public String getObservation() { return observation; }
    public void setObservation(String observation) { this.observation = observation; }
}