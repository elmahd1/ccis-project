package com.ccis.SFE.service;

import com.ccis.SFE.entity.*;
import com.ccis.SFE.repository.*;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class DemandeService {

    @Autowired
    private DemarcheAdministrativeRepository demarcheRepo;
    
    @Autowired
    private EspaceEntrepriseRepository espaceRepo;
    
    @Autowired
    private DemandeSalleRepository salleRepo;
    
    @Autowired
    private OrganizationRepository orgRepo;
    
    @Autowired
    private UserRepository userRepo;
    
    @Autowired
    private AttachmentRepository attachmentRepo;
    
    @Autowired
    private ActivityLogService activityLogService;
    
    private final String UPLOAD_DIR = "uploads/";
    
    // ==================== DEMARCHE ADMINISTRATIVE ====================
    
    @Transactional
    public DemarcheAdministrative createDemarche(Long userId, Long orgId, DemarcheAdministrative demarche) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Organization org = orgRepo.findById(orgId)
                .orElseThrow(() -> new RuntimeException("Organization not found"));
        
        demarche.setSubmittedBy(user);
        demarche.setOrganization(org);
        demarche.setStatus(BaseDemande.DemandeStatus.EN_ATTENTE);
        demarche.setCreatedAt(LocalDateTime.now());
        
        return demarcheRepo.save(demarche);
    }
    
    public List<DemarcheAdministrative> getDemarchesByOrganization(Long orgId) {
        return demarcheRepo.findByOrganizationId(orgId);
    }
    
    public List<DemarcheAdministrative> getDemarchesByUser(Long userId) {
        return demarcheRepo.findBySubmittedById(userId);
    }
    
    public List<DemarcheAdministrative> getPendingDemarches() {
        return demarcheRepo.findByStatus(BaseDemande.DemandeStatus.EN_ATTENTE);
    }
    
    public DemarcheAdministrative getDemarcheById(Long id) {
        return demarcheRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Demarche not found"));
    }
    
    @Transactional
    public DemarcheAdministrative validateDemarche(Long id, Long employeeId, String qualite) {
        DemarcheAdministrative demarche = getDemarcheById(id);
        demarche.setStatus(BaseDemande.DemandeStatus.VALIDE);
        demarche.setAcceptedAt(LocalDateTime.now());
        
        User employee = userRepo.findById(employeeId).orElse(null);
        if (employee != null) {
            demarche.setAcceptedBy(employee);
        }
        
        return demarcheRepo.save(demarche);
    }
    
    @Transactional
    public DemarcheAdministrative rejectDemarche(Long id, Long employeeId, String observation, String qualite) {
        DemarcheAdministrative demarche = getDemarcheById(id);
        demarche.setStatus(BaseDemande.DemandeStatus.REJETE);
        demarche.setObservation(observation);
        demarche.setAcceptedAt(LocalDateTime.now());
        
        User employee = userRepo.findById(employeeId).orElse(null);
        if (employee != null) {
            demarche.setAcceptedBy(employee);
        }
        
        return demarcheRepo.save(demarche);
    }
    
    // ==================== ESPACE ENTREPRISE ====================
    
    @Transactional
    public EspaceEntreprise createEspace(Long userId, Long orgId, EspaceEntreprise espace) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Organization org = orgRepo.findById(orgId)
                .orElseThrow(() -> new RuntimeException("Organization not found"));
        
        espace.setSubmittedBy(user);
        espace.setOrganization(org);
        espace.setStatus(BaseDemande.DemandeStatus.EN_ATTENTE);
        espace.setCreatedAt(LocalDateTime.now());
        
        return espaceRepo.save(espace);
    }
    
    public List<EspaceEntreprise> getEspacesByOrganization(Long orgId) {
        return espaceRepo.findByOrganizationId(orgId);
    }
    
    public List<EspaceEntreprise> getEspacesByUser(Long userId) {
        return espaceRepo.findBySubmittedById(userId);
    }
    
    public List<EspaceEntreprise> getPendingEspaces() {
        return espaceRepo.findByStatus(BaseDemande.DemandeStatus.EN_ATTENTE);
    }
    
    public EspaceEntreprise getEspaceById(Long id) {
        return espaceRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Espace not found"));
    }
    
    @Transactional
    public EspaceEntreprise validateEspace(Long id, Long employeeId, String qualite) {
        EspaceEntreprise espace = getEspaceById(id);
        espace.setStatus(BaseDemande.DemandeStatus.VALIDE);
        espace.setAcceptedAt(LocalDateTime.now());
        
        User employee = userRepo.findById(employeeId).orElse(null);
        if (employee != null) {
            espace.setAcceptedBy(employee);
        }
        
        return espaceRepo.save(espace);
    }
    
    @Transactional
    public EspaceEntreprise rejectEspace(Long id, Long employeeId, String observation, String qualite) {
        EspaceEntreprise espace = getEspaceById(id);
        espace.setStatus(BaseDemande.DemandeStatus.REJETE);
        espace.setObservation(observation);
        espace.setAcceptedAt(LocalDateTime.now());
        
        User employee = userRepo.findById(employeeId).orElse(null);
        if (employee != null) {
            espace.setAcceptedBy(employee);
        }
        
        return espaceRepo.save(espace);
    }
    
    // ==================== DEMANDE SALLE ====================
    
    @Transactional
    public DemandeSalle createSalle(Long userId, Long orgId, DemandeSalle salle) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Organization org = orgRepo.findById(orgId)
                .orElseThrow(() -> new RuntimeException("Organization not found"));
        
        salle.setSubmittedBy(user);
        salle.setOrganization(org);
        salle.setStatus(BaseDemande.DemandeStatus.EN_ATTENTE);
        salle.setCreatedAt(LocalDateTime.now());
        
        return salleRepo.save(salle);
    }
    
    public List<DemandeSalle> getSallesByOrganization(Long orgId) {
        return salleRepo.findByOrganizationId(orgId);
    }
    
    public List<DemandeSalle> getSallesByUser(Long userId) {
        return salleRepo.findBySubmittedById(userId);
    }
    
    public List<DemandeSalle> getPendingSalles() {
        return salleRepo.findByStatus(BaseDemande.DemandeStatus.EN_ATTENTE);
    }
    
    public DemandeSalle getSalleById(Long id) {
        return salleRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Salle demande not found"));
    }
    
    @Transactional
    public DemandeSalle validateSalle(Long id, Long employeeId, String qualite) {
        DemandeSalle salle = getSalleById(id);
        salle.setStatus(BaseDemande.DemandeStatus.VALIDE);
        salle.setAcceptedAt(LocalDateTime.now());
        
        User employee = userRepo.findById(employeeId).orElse(null);
        if (employee != null) {
            salle.setAcceptedBy(employee);
        }
        
        return salleRepo.save(salle);
    }
    
    @Transactional
    public DemandeSalle rejectSalle(Long id, Long employeeId, String observation, String qualite) {
        DemandeSalle salle = getSalleById(id);
        salle.setStatus(BaseDemande.DemandeStatus.REJETE);
        salle.setObservation(observation);
        salle.setAcceptedAt(LocalDateTime.now());
        
        User employee = userRepo.findById(employeeId).orElse(null);
        if (employee != null) {
            salle.setAcceptedBy(employee);
        }
        
        return salleRepo.save(salle);
    }
    
    // ==================== ATTACHMENTS ====================
    
    @Transactional
    public List<Attachment> uploadSalleAttachments(Long demandeId, List<MultipartFile> files, HttpServletRequest request) {
        DemandeSalle demande = getSalleById(demandeId);
        List<Attachment> attachments = new ArrayList<>();
        
        try {
            String uploadDir = UPLOAD_DIR + "salle/" + demandeId + "/";
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            
            for (MultipartFile file : files) {
                if (!file.isEmpty()) {
                    String originalFileName = file.getOriginalFilename();
                    String fileExtension = "";
                    if (originalFileName != null && originalFileName.contains(".")) {
                        fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
                    }
                    String uniqueFileName = UUID.randomUUID().toString() + fileExtension;
                    String filePath = uploadDir + uniqueFileName;
                    
                    Files.copy(file.getInputStream(), Paths.get(filePath));
                    
                    Attachment attachment = new Attachment();
                    attachment.setFileName(originalFileName);
                    attachment.setFileType(file.getContentType());
                    attachment.setFilePath(filePath);
                    attachment.setDemande(demande);
                    
                    attachments.add(attachmentRepo.save(attachment));
                }
            }
        } catch (IOException e) {
            throw new RuntimeException("Error uploading files: " + e.getMessage());
        }
        
        return attachments;
    }
    
    public List<Attachment> getAttachmentsByDemande(Long demandeId) {
        return attachmentRepo.findByDemandeId(demandeId);
    }
    
    // ==================== PENDING REQUESTS SUMMARY ====================
    
    public Map<String, Object> getAllPendingRequests() {
        Map<String, Object> pending = new HashMap<>();
        pending.put("demarches", getPendingDemarches());
        pending.put("espaces", getPendingEspaces());
        pending.put("salles", getPendingSalles());
        return pending;
    }
    
    public Map<String, Object> getFullHistory(Long orgId) {
        Map<String, Object> history = new HashMap<>();
        history.put("demarches", getDemarchesByOrganization(orgId));
        history.put("espaces", getEspacesByOrganization(orgId));
        history.put("salles", getSallesByOrganization(orgId));
        return history;
    }
    
    public Map<String, Object> getUserFullHistory(Long userId) {
        Map<String, Object> history = new HashMap<>();
        history.put("demarches", getDemarchesByUser(userId));
        history.put("espaces", getEspacesByUser(userId));
        history.put("salles", getSallesByUser(userId));
        return history;
    }
}