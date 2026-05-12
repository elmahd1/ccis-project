package com.ccis.SFE.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "users")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class User implements org.springframework.security.core.userdetails.UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @JsonIgnore
    private String password;

    @Column(nullable = false, unique = true)
    private String email;

    private String role; // "ROLE_CLIENT", "ROLE_EMPLOYEE", "ROLE_ADMIN"
    
    // Client Profile Information
    private String nom;           // Last name
    private String prenom;        // First name
    private String numTelFixe;
    private String numTelGsm;
    private String adresse;
    private String ville;
    
    @Enumerated(EnumType.STRING)
    private StatutClient statut;  // AUTO_ENTREPRENEUR, PORTEUR_PROJET
    
    // Account status
    @Enumerated(EnumType.STRING)
    private AccountStatus accountStatus = AccountStatus.PENDING_PROFILE_COMPLETION;
    
    private LocalDateTime lastLogin;
    private LocalDateTime profileCompletedAt;
    private LocalDateTime activatedAt;
    
    // Who validated/activated this client
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "activated_by")
    @JsonIgnoreProperties({"password", "organizations"})
    private User activatedBy;
    
    private String activatedByQualite; // Store the qualite at time of activation
    
    // Relationships
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<UserOrganizationRole> organizations = new ArrayList<>();

    // ========== ENUMS ==========
    public enum StatutClient {
        AUTO_ENTREPRENEUR, PORTEUR_PROJET
    }
    
    public enum AccountStatus {
        PENDING_PROFILE_COMPLETION,  // Just registered, needs to complete profile
        PENDING_ACTIVATION,          // Profile completed, waiting for employee activation
        ACTIVE,                      // Fully activated
        SUSPENDED,                   // Temporarily suspended
        REJECTED                     // Account rejected by employee
    }

    // ========== Spring Security Methods ==========
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(this.role));
    }

    @Override public boolean isAccountNonExpired() { return true; }
    @Override public boolean isAccountNonLocked() { return true; }
    @Override public boolean isCredentialsNonExpired() { return true; }
    @Override public boolean isEnabled() { 
        return this.accountStatus == AccountStatus.ACTIVE; 
    }

    // ========== Getters and Setters ==========
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    @Override
    public String getPassword() { return this.password; }
    public void setPassword(String password) { this.password = password; }

    @Override
    public String getUsername() { return this.username; }
    public void setUsername(String username) { this.username = username; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    
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
    
    public AccountStatus getAccountStatus() { return accountStatus; }
    public void setAccountStatus(AccountStatus accountStatus) { this.accountStatus = accountStatus; }
    
    public LocalDateTime getLastLogin() { return lastLogin; }
    public void setLastLogin(LocalDateTime lastLogin) { this.lastLogin = lastLogin; }
    
    public LocalDateTime getProfileCompletedAt() { return profileCompletedAt; }
    public void setProfileCompletedAt(LocalDateTime profileCompletedAt) { this.profileCompletedAt = profileCompletedAt; }
    
    public LocalDateTime getActivatedAt() { return activatedAt; }
    public void setActivatedAt(LocalDateTime activatedAt) { this.activatedAt = activatedAt; }
    
    public User getActivatedBy() { return activatedBy; }
    public void setActivatedBy(User activatedBy) { this.activatedBy = activatedBy; }
    
    public String getActivatedByQualite() { return activatedByQualite; }
    public void setActivatedByQualite(String activatedByQualite) { this.activatedByQualite = activatedByQualite; }
    
    public List<UserOrganizationRole> getOrganizations() { return organizations; }
    public void setOrganizations(List<UserOrganizationRole> organizations) { this.organizations = organizations; }
    
    // Helper method to get full name
    public String getFullName() {
        return (prenom != null ? prenom : "") + " " + (nom != null ? nom : "");
    }
}