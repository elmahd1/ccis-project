package com.ccis.SFE.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "activity_logs")
public class ActivityLog {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String action; // e.g., "USER_REGISTERED", "PROFILE_COMPLETED", "ACCOUNT_ACTIVATED", "DEMANDE_VALIDATED"
    
    @Column(length = 1000)
    private String description;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user; // Who performed the action
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "target_user_id")
    private User targetUser; // Who was affected (for admin actions)
    
    private Long entityId; // ID of the affected entity (Demande, Organization, etc.)
    private String entityType; // Type of entity (DemandeSalle, Organization, etc.)
    
    private String ipAddress;
    private String userAgent;
    
    @Column(nullable = false)
    private LocalDateTime timestamp = LocalDateTime.now();
    
    // Additional details as JSON string
    @Column(length = 2000)
    private String details;
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    
    public User getTargetUser() { return targetUser; }
    public void setTargetUser(User targetUser) { this.targetUser = targetUser; }
    
    public Long getEntityId() { return entityId; }
    public void setEntityId(Long entityId) { this.entityId = entityId; }
    
    public String getEntityType() { return entityType; }
    public void setEntityType(String entityType) { this.entityType = entityType; }
    
    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }
    
    public String getUserAgent() { return userAgent; }
    public void setUserAgent(String userAgent) { this.userAgent = userAgent; }
    
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
    
    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }
}