package com.ccis.SFE.dto;

import com.ccis.SFE.entity.Organization.OrganizationType;

public class CreateOrganizationRequest {
    private String name;
    private OrganizationType type;
    private String ice;
    private String formeJuridique;
    private String secteurActivite;
    private String activite;
    private String taille;
    private String adresse;
    private String ville;
    private String telFixe;
    private String telGsm;
    private String emailContact;
    private String siteWeb;
    private String description;
    
    // Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public OrganizationType getType() { return type; }
    public void setType(OrganizationType type) { this.type = type; }
    
    public String getIce() { return ice; }
    public void setIce(String ice) { this.ice = ice; }
    
    public String getFormeJuridique() { return formeJuridique; }
    public void setFormeJuridique(String formeJuridique) { this.formeJuridique = formeJuridique; }
    
    public String getSecteurActivite() { return secteurActivite; }
    public void setSecteurActivite(String secteurActivite) { this.secteurActivite = secteurActivite; }
    
    public String getActivite() { return activite; }
    public void setActivite(String activite) { this.activite = activite; }
    
    public String getTaille() { return taille; }
    public void setTaille(String taille) { this.taille = taille; }
    
    public String getAdresse() { return adresse; }
    public void setAdresse(String adresse) { this.adresse = adresse; }
    
    public String getVille() { return ville; }
    public void setVille(String ville) { this.ville = ville; }
    
    public String getTelFixe() { return telFixe; }
    public void setTelFixe(String telFixe) { this.telFixe = telFixe; }
    
    public String getTelGsm() { return telGsm; }
    public void setTelGsm(String telGsm) { this.telGsm = telGsm; }
    
    public String getEmailContact() { return emailContact; }
    public void setEmailContact(String emailContact) { this.emailContact = emailContact; }
    
    public String getSiteWeb() { return siteWeb; }
    public void setSiteWeb(String siteWeb) { this.siteWeb = siteWeb; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}