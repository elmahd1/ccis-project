package com.ccis.SFE.entity;
import jakarta.persistence.*;

@Entity
public class Attachment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String fileName;
    private String fileType;
    private String filePath; 

    @ManyToOne
    @JoinColumn(name = "demande_id")
    private BaseDemande demande;

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getFileName() {
        return fileName;
    }
    public void setFileName(String fileName) {
        this.fileName = fileName;
    }
    public String getFileType() {
        return fileType;
    }
    public void setFileType(String fileType) {
        this.fileType = fileType;
    }
    public String getFilePath() { 
        return filePath;
    }
    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }
    public BaseDemande getDemande() {
        return demande;
    }
    public void setDemande(BaseDemande demande) {
        this.demande = demande;
    }
}