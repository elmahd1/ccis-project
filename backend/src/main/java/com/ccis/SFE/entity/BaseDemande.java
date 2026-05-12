package com.ccis.SFE.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@Table(name = "base_demande") 
public abstract class BaseDemande {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organization_id", nullable = false)
    private Organization organization;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "submitted_by", nullable = false)
    private User submittedBy;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private DemandeStatus status = DemandeStatus.EN_ATTENTE;

    private LocalDateTime acceptedAt;

        @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "accepted_by", nullable = false)
    private User acceptedBy;
    
    @Transient
    private String organizationName;
    
    @Column(length = 500)
    private String observation; 

    public enum DemandeStatus {
        BROUILLON, EN_ATTENTE, VALIDE, REJETE
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public Organization getOrganization() {
        return organization;
    }
    public void setOrganization(Organization organization) {
        this.organization = organization;
    }
    public User getSubmittedBy() {
        return submittedBy;
    }
    public void setSubmittedBy(User submittedBy) {
        this.submittedBy = submittedBy;
    }
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    public DemandeStatus getStatus() {
        return status;
    }
    public void setStatus(DemandeStatus status) {
        this.status = status;
    }
    public String getOrganizationName() {
        return organizationName;
    }
    public void setOrganizationName(String organizationName) {
        this.organizationName = organizationName;
    }
    public String getObservation() {  // ADD GETTER
        return observation;
    }
    public void setObservation(String observation) {  // ADD SETTER
        this.observation = observation;
    }
    public LocalDateTime getAcceptedAt() {
        return acceptedAt;
    }
    public void setAcceptedAt(LocalDateTime acceptedAt) {
        this.acceptedAt = acceptedAt;
    }
    public User getAcceptedBy() {
        return acceptedBy;
    }
    public void setAcceptedBy(User acceptedBy) {
        this.acceptedBy = acceptedBy;
    }
    
}