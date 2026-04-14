package com.ccis.SFE.RESTControllers;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.IOException;
import java.util.List;

import com.ccis.SFE.entity.DemandeSalle;
import com.ccis.SFE.repository.DemandeSalleRepository;
import com.ccis.SFE.service.DocumentService;

@RestController
@RequestMapping("/api/documents")
@CrossOrigin(origins = "http://localhost:3000")
public class DocumentController {

    @Autowired
    private DocumentService documentService;

    @Autowired
    private DemandeSalleRepository demandeSalleRepository;

    @PostMapping(value = "/generer-pdf", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<byte[]> genererDocumentPdf(
            @RequestPart("demande") DemandeSalle request, 
            @RequestPart(value = "documents", required = false) List<MultipartFile> documents) throws IOException { 

        DemandeSalle savedDemande = demandeSalleRepository.save(request);

        // Récupère le ZIP
        byte[] zipBytes = documentService.processAndDownloadZip(savedDemande, documents);

        // En-têtes pour lancer le téléchargement directement
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("application/zip"));       
        String nomFichier = "Dossier_" + request.getNomAssociation().replaceAll("[\\\\/:*?\"<>|\\s]", "_") + ".zip";
        headers.setContentDispositionFormData("attachment", nomFichier);
        
        return new ResponseEntity<>(zipBytes, headers, HttpStatus.OK);
    }
}