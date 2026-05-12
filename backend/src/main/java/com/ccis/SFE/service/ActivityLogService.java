package com.ccis.SFE.service;

import com.ccis.SFE.entity.ActivityLog;
import com.ccis.SFE.entity.BaseDemande;
import com.ccis.SFE.entity.Organization;
import com.ccis.SFE.entity.User;
import com.ccis.SFE.repository.ActivityLogRepository;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
public class ActivityLogService {

    @Autowired
    private ActivityLogRepository activityLogRepository;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    private String getClientIp(HttpServletRequest request) {
        if (request == null) return "unknown";
        String ipAddress = request.getHeader("X-Forwarded-For");
        if (ipAddress == null || ipAddress.isEmpty()) {
            ipAddress = request.getRemoteAddr();
        }
        return ipAddress;
    }
    
    private String getUserAgent(HttpServletRequest request) {
        if (request == null) return "unknown";
        return request.getHeader("User-Agent");
    }
    
    private ActivityLog createLog(User user, String action, String description, HttpServletRequest request) {
        ActivityLog log = new ActivityLog();
        log.setAction(action);
        log.setDescription(description);
        log.setUser(user);
        log.setTimestamp(LocalDateTime.now());
        if (request != null) {
            log.setIpAddress(getClientIp(request));
            log.setUserAgent(getUserAgent(request));
        }
        return log;
    }
    
    public void logUserRegistration(User user, HttpServletRequest request) {
        ActivityLog log = createLog(user, "USER_REGISTERED", 
            "Nouvel utilisateur inscrit: " + user.getUsername() + " (" + user.getEmail() + ")", request);
        activityLogRepository.save(log);
    }
    
    public void logLogin(User user, HttpServletRequest request) {
        ActivityLog log = createLog(user, "USER_LOGIN", 
            "Connexion réussie: " + user.getUsername(), request);
        activityLogRepository.save(log);
    }
    
    public void logFailedLogin(String username, HttpServletRequest request) {
        ActivityLog log = new ActivityLog();
        log.setAction("LOGIN_FAILED");
        log.setDescription("Tentative de connexion échouée pour: " + username);
        log.setIpAddress(getClientIp(request));
        log.setUserAgent(getUserAgent(request));
        log.setTimestamp(LocalDateTime.now());
        activityLogRepository.save(log);
    }
    
    public void logProfileCompletion(User user, HttpServletRequest request) {
        ActivityLog log = createLog(user, "PROFILE_COMPLETED", 
            "Profil complété par: " + (user.getFullName() != null ? user.getFullName() : user.getUsername()), request);
        
        Map<String, String> details = new HashMap<>();
        details.put("statut", user.getStatut() != null ? user.getStatut().toString() : "");
        details.put("ville", user.getVille() != null ? user.getVille() : "");
        try {
            log.setDetails(objectMapper.writeValueAsString(details));
        } catch (Exception e) {
            log.setDetails(details.toString());
        }
        
        activityLogRepository.save(log);
    }
    
    // ========== ACCOUNT ACTIVATION/REJECTION METHODS ==========
    
    // NEW: Account activation logging (matches controller call)
    public void logAccountActivation(User admin, User client, String qualite, HttpServletRequest request) {
        ActivityLog log = createLog(admin, "ACCOUNT_ACTIVATED", 
            "Compte client activé: " + (client.getFullName() != null ? client.getFullName() : client.getUsername()) + 
            " (" + client.getUsername() + ") par " + (admin.getFullName() != null ? admin.getFullName() : admin.getUsername()), request);
        log.setTargetUser(client);
        
        Map<String, String> details = new HashMap<>();
        details.put("qualite", qualite);
        details.put("activatedAt", LocalDateTime.now().toString());
        
        try {
            log.setDetails(objectMapper.writeValueAsString(details));
        } catch (Exception e) {
            log.setDetails(details.toString());
        }
        
        activityLogRepository.save(log);
    }
    
    // NEW: Account rejection logging (matches controller call)
    public void logAccountRejection(User client, String reason, HttpServletRequest request) {
        ActivityLog log = new ActivityLog();
        log.setAction("ACCOUNT_REJECTED");
        log.setDescription("Compte client rejeté: " + (client.getFullName() != null ? client.getFullName() : client.getUsername()) + 
            " (" + client.getUsername() + ")");
        log.setTargetUser(client);
        log.setTimestamp(LocalDateTime.now());
        if (request != null) {
            log.setIpAddress(getClientIp(request));
            log.setUserAgent(getUserAgent(request));
        }
        
        if (reason != null) {
            Map<String, String> details = new HashMap<>();
            details.put("reason", reason);
            details.put("rejectedAt", LocalDateTime.now().toString());
            try {
                log.setDetails(objectMapper.writeValueAsString(details));
            } catch (Exception e) {
                log.setDetails(details.toString());
            }
        }
        
        activityLogRepository.save(log);
    }
    
    // Alternative signature for rejection with admin info
    public void logAccountRejection(User admin, User client, String reason, HttpServletRequest request) {
        ActivityLog log = createLog(admin, "ACCOUNT_REJECTED", 
            "Compte client rejeté: " + (client.getFullName() != null ? client.getFullName() : client.getUsername()) + 
            " (" + client.getUsername() + ") par " + (admin.getFullName() != null ? admin.getFullName() : admin.getUsername()), request);
        log.setTargetUser(client);
        
        if (reason != null) {
            Map<String, String> details = new HashMap<>();
            details.put("reason", reason);
            details.put("rejectedAt", LocalDateTime.now().toString());
            try {
                log.setDetails(objectMapper.writeValueAsString(details));
            } catch (Exception e) {
                log.setDetails(details.toString());
            }
        }
        
        activityLogRepository.save(log);
    }
    
    // ========== EXISTING METHODS (keep these) ==========
    
    public void logClientActivation(User admin, User client, String qualite, String observation, HttpServletRequest request) {
        ActivityLog log = createLog(admin, "CLIENT_ACTIVATED", 
            "Compte client activé: " + (client.getFullName() != null ? client.getFullName() : client.getUsername()) + 
            " (" + client.getUsername() + ") par " + (admin.getFullName() != null ? admin.getFullName() : admin.getUsername()), request);
        log.setTargetUser(client);
        
        Map<String, String> details = new HashMap<>();
        details.put("qualite", qualite);
        if (observation != null) details.put("observation", observation);
        
        try {
            log.setDetails(objectMapper.writeValueAsString(details));
        } catch (Exception e) {
            log.setDetails(details.toString());
        }
        
        activityLogRepository.save(log);
    }
    
    public void logClientRejection(User admin, User client, String reason, HttpServletRequest request) {
        ActivityLog log = createLog(admin, "CLIENT_REJECTED", 
            "Compte client rejeté: " + (client.getFullName() != null ? client.getFullName() : client.getUsername()) + 
            " (" + client.getUsername() + ") par " + (admin.getFullName() != null ? admin.getFullName() : admin.getUsername()), request);
        log.setTargetUser(client);
        
        if (reason != null) {
            log.setDetails("Raison: " + reason);
        }
        
        activityLogRepository.save(log);
    }
    
    public void logClientSuspension(User admin, User client, String reason, HttpServletRequest request) {
        ActivityLog log = createLog(admin, "CLIENT_SUSPENDED", 
            "Compte client suspendu: " + (client.getFullName() != null ? client.getFullName() : client.getUsername()) + 
            " (" + client.getUsername() + ") par " + (admin.getFullName() != null ? admin.getFullName() : admin.getUsername()), request);
        log.setTargetUser(client);
        
        if (reason != null) {
            log.setDetails("Raison: " + reason);
        }
        
        activityLogRepository.save(log);
    }
    
    public void logClientReactivation(User admin, User client, HttpServletRequest request) {
        ActivityLog log = createLog(admin, "CLIENT_REACTIVATED", 
            "Compte client réactivé: " + (client.getFullName() != null ? client.getFullName() : client.getUsername()) + 
            " (" + client.getUsername() + ") par " + (admin.getFullName() != null ? admin.getFullName() : admin.getUsername()), request);
        log.setTargetUser(client);
        activityLogRepository.save(log);
    }
    
    public void logDemandeAction(User employee, BaseDemande demande, String action, String qualite, HttpServletRequest request) {
        String demandeType = demande.getClass().getSimpleName();
        String description = String.format("%s: %s #%d pour l'organisation '%s' par %s (Qualité: %s)", 
            action, demandeType, demande.getId(), 
            demande.getOrganization() != null ? demande.getOrganization().getName() : "N/A",
            employee != null ? (employee.getFullName() != null ? employee.getFullName() : employee.getUsername()) : "Unknown",
            qualite);
        
        ActivityLog log = createLog(employee, "DEMANDE_" + action.toUpperCase(), description, request);
        log.setEntityId(demande.getId());
        log.setEntityType(demandeType);
        if (demande.getSubmittedBy() != null) {
            log.setTargetUser(demande.getSubmittedBy());
        }
        
        Map<String, String> details = new HashMap<>();
        details.put("qualite", qualite);
        details.put("status", demande.getStatus().toString());
        
        if (demande.getObservation() != null) {
            details.put("observation", demande.getObservation());
        }
        
        try {
            log.setDetails(objectMapper.writeValueAsString(details));
        } catch (Exception e) {
            log.setDetails(details.toString());
        }
        
        activityLogRepository.save(log);
    }
    
    public void logOrganizationAction(User user, Organization org, String action, HttpServletRequest request) {
        ActivityLog log = createLog(user, "ORGANIZATION_" + action.toUpperCase(), 
            action + " organisation: " + org.getName() + " par " + 
            (user.getFullName() != null ? user.getFullName() : user.getUsername()), request);
        log.setEntityId(org.getId());
        log.setEntityType("Organization");
        activityLogRepository.save(log);
    }
    
    public void logDemandeCreation(User client, BaseDemande demande, HttpServletRequest request) {
        String demandeType = demande.getClass().getSimpleName();
        ActivityLog log = createLog(client, "DEMANDE_CREATED", 
            "Nouvelle demande créée: " + demandeType + " pour l'organisation '" + 
            (demande.getOrganization() != null ? demande.getOrganization().getName() : "N/A") + "'", request);
        log.setEntityId(demande.getId());
        log.setEntityType(demandeType);
        activityLogRepository.save(log);
    }
}