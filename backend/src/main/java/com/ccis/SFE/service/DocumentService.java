package com.ccis.SFE.service;

import com.ccis.SFE.entity.Attachment;
import com.ccis.SFE.entity.DemandeSalle;
import com.ccis.SFE.entity.DemarcheAdministrative;
import com.ccis.SFE.entity.EspaceEntreprise;
import com.ccis.SFE.entity.Organization;
import com.ccis.SFE.repository.AttachmentRepository;
import fr.opensagres.xdocreport.document.IXDocReport;
import fr.opensagres.xdocreport.document.registry.XDocReportRegistry;
import fr.opensagres.xdocreport.template.IContext;
import fr.opensagres.xdocreport.template.TemplateEngineKind;
import org.apache.poi.xwpf.usermodel.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

@Service
public class DocumentService {

    private final DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    
    @Autowired
    private AttachmentRepository attachmentRepository;

    private String getMoisArabe(int monthNumber) {
        String[] moisArabes = {"يناير", "فبراير", "مارس", "أبريل", "ماي", "يونيو", "يوليوز", "غشت", "شتنبر", "أكتوبر", "نونبر", "دجنبر"};
        if (monthNumber >= 1 && monthNumber <= 12) return moisArabes[monthNumber - 1];
        return "";
    }

    // ==================== DEMANDE SALLE METHODS ====================

    public byte[] processAndDownloadZip(DemandeSalle demande, List<MultipartFile> documents) {
        try {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ZipOutputStream zos = new ZipOutputStream(baos);

            String nomAssoc = "Association";
            if (demande.getOrganization() != null && demande.getOrganization().getName() != null) {
                nomAssoc = demande.getOrganization().getName();
            }
            String nomAssocSafe = nomAssoc.replaceAll("[\\\\/:*?\"<>|]", "_");

            String dateDemande = demande.getCreatedAt() != null ? demande.getCreatedAt().toLocalDate().toString() : "Date";

            // Add uploaded documents to zip
            if (documents != null && !documents.isEmpty()) {
                for (MultipartFile file : documents) {
                    if (!file.isEmpty()) {
                        ZipEntry zipEntry = new ZipEntry("المرفقات/" + file.getOriginalFilename());
                        zos.putNextEntry(zipEntry);
                        zos.write(file.getBytes());
                        zos.closeEntry();
                    }
                }
            }
            
            // Also add attachments from database if any
            List<Attachment> dbAttachments = attachmentRepository.findByDemande(demande);
            for (Attachment attachment : dbAttachments) {
                // You would need to read the file from the stored path
                // This is a placeholder - implement based on your file storage strategy
            }

            String[] nomsFichiersArabes = {
                "طلب_قاعة_" + nomAssocSafe + "_" + dateDemande + ".docx",
                "إخبار_" + nomAssocSafe + "_" + dateDemande + ".docx",
                "موافقة_" + nomAssocSafe + "_" + dateDemande + ".docx"
            };

            for (int i = 1; i <= 3; i++) {
                String templatePath = "/templates/demande_template" + i + ".docx";
                byte[] docBytes = genererDocWithTemplate(demande, templatePath);
                ZipEntry zipEntry = new ZipEntry(nomsFichiersArabes[i - 1]);
                zos.putNextEntry(zipEntry);
                zos.write(docBytes);
                zos.closeEntry();
            }

            zos.close();
            return baos.toByteArray();

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Erreur lors de la génération des documents: " + e.getMessage());
        }
    }

    private byte[] genererDocWithTemplate(DemandeSalle demande, String templatePath) throws Exception {
        InputStream in = getClass().getResourceAsStream(templatePath);
        if (in == null) throw new RuntimeException("Template introuvable: " + templatePath);

        IXDocReport report = XDocReportRegistry.getRegistry().loadReport(in, TemplateEngineKind.Freemarker);
        IContext context = report.createContext();

        Organization org = demande.getOrganization();
        String orgName = (org != null && org.getName() != null) ? org.getName() : "";
        boolean isCreee = (org != null && org.isOfficiallyCreated());

        context.put("NA", orgName);
        // Note: DemandeSalle doesn't have getAdresse() - using organization address instead
        context.put("V", org != null && org.getAdresse() != null ? org.getAdresse() : "");

        // Handle meeting date/time - using getReunion() instead of getDateHeureReunion()
        if (demande.getReunion() != null) {
            LocalDateTime dt = demande.getReunion();
            context.put("HR", convertTimeToArabicWords(dt.toLocalTime().toString()));
            String moisReunionArabe = getMoisArabe(dt.getMonthValue());
            context.put("DR", String.format("%02d", dt.getDayOfMonth()) + " " + moisReunionArabe + " " + dt.getYear());
        } else {
            context.put("HR", "");
            context.put("DR", "");
        }

        context.put("AS", demande.getActiviteOuSujet() != null ? demande.getActiviteOuSujet() : "");

        // Handle creation date
        if (demande.getCreatedAt() != null) {
            LocalDateTime createdAt = demande.getCreatedAt();
            context.put("DD", createdAt.getYear() + "/" + String.format("%02d", createdAt.getMonthValue()) + "/" + String.format("%02d", createdAt.getDayOfMonth()));
        } else {
            context.put("DD", "");
        }

        // Handle members based on association status
        if (isCreee) {
            context.put("TR1", "الجمعية المهنية");
            context.put("TR3", "رئيس الجمعية");
            context.put("TR5", "السيد رئيس الجمعية");
            context.put("NP1", demande.getMembres() != null ? demande.getMembres() : "");
        } else {
            context.put("TR1", "اللجنة التحضيرية لجمعية");
            context.put("TR3", "اللجنة التحضيرية");
            context.put("TR5", "السادة أعضاء اللجنة التحضيرية لجمعية");
            context.put("NP1", demande.getMembres() != null ? demande.getMembres() : "");
        }

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        report.process(context, out);
        return out.toByteArray();
    }

    private String convertTimeToArabicWords(String timeStr) {
        if (timeStr == null || !timeStr.contains(":")) return "";
        String[] parts = timeStr.split(":");
        int hour = Integer.parseInt(parts[0]);
        int minute = Integer.parseInt(parts[1]);

        String[] hoursArr = {"", "الواحدة", "الثانية", "الثالثة", "الرابعة", "الخامسة", "السادسة", "السابعة", "الثامنة", "التاسعة", "العاشرة", "الحادية عشرة", "الثانية عشرة"};

        String result = hoursArr[hour > 12 ? hour - 12 : (hour == 0 ? 12 : hour)];

        if (minute == 0) result += " تماماً";
        else if (minute == 30) result += " والنصف";
        else if (minute == 15) result += " والربع";
        else result += " و " + minute + " دقيقة";

        result += (hour >= 12) ? " مساءً" : " صباحاً";
        return result;
    }

    // ==================== DEMARCHE ADMINISTRATIVE METHODS ====================

    public byte[] generateDemarcheDocument(DemarcheAdministrative demarche) {
        try {
            Map<String, String> replacements = createDemarcheReplacementMap(demarche);
            
            String templatePath = "/templates/template_word_demarche.docx";
            InputStream in = getClass().getResourceAsStream(templatePath);
            
            if (in == null) {
                return generateSimpleDemarcheDoc(demarche);
            }
            
            XWPFDocument doc = new XWPFDocument(in);
            replaceTextInDocument(doc, replacements);
            
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            doc.write(out);
            doc.close();
            
            return out.toByteArray();
            
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Erreur lors de la génération du document: " + e.getMessage());
        }
    }

    private Map<String, String> createDemarcheReplacementMap(DemarcheAdministrative demarche) {
        Map<String, String> replacements = new HashMap<>();
        
        Organization org = demarche.getOrganization();
        
        // Contact section
        replacements.put("{date_contact}", demarche.getCreatedAt() != null ? demarche.getCreatedAt().toLocalDate().toString() : "");
        replacements.put("{heure_contact}", demarche.getCreatedAt() != null ? demarche.getCreatedAt().toLocalTime().toString() : "");
        replacements.put("{type_demande}", "Demande administrative");
        replacements.put("{statut}", demarche.getStatus() != null ? demarche.getStatus().toString() : "");
        replacements.put("{objet_visite}", demarche.getObjetVisite() != null ? demarche.getObjetVisite() : "");
        replacements.put("{montant}", demarche.getMontant() != null ? String.valueOf(demarche.getMontant()) : "");
        
        // Demandeur section (from Organization)
        replacements.put("{nom_prenom}", org != null && org.getName() != null ? org.getName() : "");
        replacements.put("{tel_fixe}", org != null && org.getTelFixe() != null ? org.getTelFixe() : "");
        replacements.put("{tel_gsm}", org != null && org.getTelGsm() != null ? org.getTelGsm() : "");
        replacements.put("{email}", org != null && org.getEmailContact() != null ? org.getEmailContact() : "");
        replacements.put("{accepte_envois}", "Non spécifié");
        replacements.put("{site_web}", org != null && org.getSiteWeb() != null ? org.getSiteWeb() : "");
        replacements.put("{adresse}", org != null && org.getAdresse() != null ? org.getAdresse() : "");
        replacements.put("{ville}", org != null && org.getVille() != null ? org.getVille() : "");
        
        // Entreprise section
        replacements.put("{denomination}", org != null && org.getName() != null ? org.getName() : "");
        replacements.put("{representant_legal}", org != null && org.getName() != null ? org.getName() : "");
        replacements.put("{forme_juridique}", org != null && org.getFormeJuridique() != null ? org.getFormeJuridique() : "");
        replacements.put("{secteur_activite}", org != null && org.getSecteurActivite() != null ? org.getSecteurActivite() : "");
        replacements.put("{activite}", org != null && org.getDescription() != null ? org.getDescription() : "");
        replacements.put("{date_depot}", demarche.getCreatedAt() != null ? demarche.getCreatedAt().toLocalDate().toString() : "");
        replacements.put("{heure_depot}", demarche.getCreatedAt() != null ? demarche.getCreatedAt().toLocalTime().toString() : "");
        
        // CCIS section - could be populated from the logged-in employee
        replacements.put("{conseiller_ccis}", "");
        replacements.put("{qualite}", "");
        
        // Dossier section
        replacements.put("{etat_dossier}", demarche.getStatus() != null ? demarche.getStatus().toString() : "");
        // Note: DemarcheAdministrative doesn't have getSuiteDemande() or getDateHeureDelivrance()
        replacements.put("{suite_demande}", "");
        replacements.put("{observation}", demarche.getObservation() != null ? demarche.getObservation() : "");
        replacements.put("{date_delivrance}", "");
        replacements.put("{heure_delivrance}", "");
        
        return replacements;
    }

    private byte[] generateSimpleDemarcheDoc(DemarcheAdministrative demarche) throws Exception {
        try (XWPFDocument doc = new XWPFDocument(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            
            Organization org = demarche.getOrganization();
            
            // Title
            XWPFParagraph titlePara = doc.createParagraph();
            titlePara.setAlignment(ParagraphAlignment.CENTER);
            XWPFRun titleRun = titlePara.createRun();
            titleRun.setText("FICHE DÉMARCHE ADMINISTRATIVE");
            titleRun.setBold(true);
            titleRun.setFontSize(18);
            titlePara.createRun().addBreak();
            
            // Contact Info
            addSection(doc, "1. CONTACT");
            addField(doc, "Date contact:", demarche.getCreatedAt() != null ? demarche.getCreatedAt().toLocalDate().toString() : "");
            addField(doc, "Heure contact:", demarche.getCreatedAt() != null ? demarche.getCreatedAt().toLocalTime().toString() : "");
            addField(doc, "Type demande:", "Demande administrative");
            addField(doc, "Statut:", demarche.getStatus() != null ? demarche.getStatus().toString() : "");
            addField(doc, "Objet visite:", demarche.getObjetVisite());
            addField(doc, "Montant:", demarche.getMontant() != null ? String.valueOf(demarche.getMontant()) : "");
            
            // Demandeur Info
            addSection(doc, "2. IDENTIFICATION DU DEMANDEUR");
            addField(doc, "Nom et prénom:", org != null ? org.getName() : "");
            addField(doc, "Téléphone fixe:", org != null ? org.getTelFixe() : "");
            addField(doc, "GSM:", org != null ? org.getTelGsm() : "");
            addField(doc, "Email:", org != null ? org.getEmailContact() : "");
            addField(doc, "Adresse:", org != null ? org.getAdresse() : "");
            addField(doc, "Ville:", org != null ? org.getVille() : "");
            
            // Entreprise Info
            addSection(doc, "3. IDENTIFICATION DE L'ENTREPRISE");
            addField(doc, "Dénomination:", org != null ? org.getName() : "");
            addField(doc, "Représentant légal:", org != null ? org.getName() : "");
            addField(doc, "Forme juridique:", org != null ? org.getFormeJuridique() : "");
            addField(doc, "Secteur d'activité:", org != null ? org.getSecteurActivite() : "");
            addField(doc, "Activité:", org != null ? org.getDescription() : "");
            
            // CCIS Info
            addSection(doc, "4. CONSEILLER CCIS");
            addField(doc, "Nom et prénom:", "");
            addField(doc, "Qualité:", "");
            
            // Dossier Info
            addSection(doc, "5. INFORMATIONS DOSSIER");
            addField(doc, "État du dossier:", demarche.getStatus() != null ? demarche.getStatus().toString() : "");
            addField(doc, "Observation:", demarche.getObservation());
            
            doc.write(out);
            return out.toByteArray();
        }
    }

    // ==================== ESPACE ENTREPRISE METHODS ====================

    public byte[] generateEspaceDocument(EspaceEntreprise espace) {
        try {
            Map<String, String> replacements = createEspaceReplacementMap(espace);
            
            String templatePath = "/templates/template_word_espace_entreprise.docx";
            InputStream in = getClass().getResourceAsStream(templatePath);
            
            if (in == null) {
                return generateSimpleEspaceDoc(espace);
            }
            
            XWPFDocument doc = new XWPFDocument(in);
            replaceTextInDocument(doc, replacements);
            
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            doc.write(out);
            doc.close();
            
            return out.toByteArray();
            
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Erreur lors de la génération du document: " + e.getMessage());
        }
    }

    private Map<String, String> createEspaceReplacementMap(EspaceEntreprise espace) {
        Map<String, String> replacements = new HashMap<>();
        
        Organization org = espace.getOrganization();
        
        // Contact section
        replacements.put("{date_contact}", espace.getCreatedAt() != null ? espace.getCreatedAt().toLocalDate().toString() : "");
        replacements.put("{heure_contact}", espace.getCreatedAt() != null ? espace.getCreatedAt().toLocalTime().toString() : "");
        
        // Objet visite 
        String objetVisite = espace.getObjetVisite() != null ? espace.getObjetVisite() : "";
        replacements.put("{objet_visite}", objetVisite);
        
        // Demandeur section
        replacements.put("{nom_prenom}", org != null && org.getName() != null ? org.getName() : "");
        replacements.put("{tel_fixe}", org != null && org.getTelFixe() != null ? org.getTelFixe() : "");
        replacements.put("{tel_gsm}", org != null && org.getTelGsm() != null ? org.getTelGsm() : "");
        replacements.put("{email}", org != null && org.getEmailContact() != null ? org.getEmailContact() : "");
        replacements.put("{site_web}", org != null && org.getSiteWeb() != null ? org.getSiteWeb() : "");
        replacements.put("{adresse}", org != null && org.getAdresse() != null ? org.getAdresse() : "");
        replacements.put("{ville}", org != null && org.getVille() != null ? org.getVille() : "");
        replacements.put("{accepte_envois}", Boolean.TRUE.equals(espace.getAccepteEnvoi()) ? "☑" : "☐");
        
        // Entreprise section
        replacements.put("{denomination}", org != null && org.getName() != null ? org.getName() : "");
        replacements.put("{ice}", org != null && org.getIce() != null ? org.getIce() : "");
        replacements.put("{nom_representant_legal}", org != null && org.getName() != null ? org.getName() : "");
        replacements.put("{forme_juridique}", org != null && org.getFormeJuridique() != null ? org.getFormeJuridique() : "");
        replacements.put("{taille_entreprise}", org != null && org.getTaille() != null ? org.getTaille() : "");
        replacements.put("{secteur_activite}", org != null && org.getSecteurActivite() != null ? org.getSecteurActivite() : "");
        replacements.put("{activite}", org != null && org.getDescription() != null ? org.getDescription() : "");
        
        // CCIS section
        replacements.put("{conseilleur_ccis}", "");
        replacements.put("{qualite}", "");
        
        return replacements;
    }

    private byte[] generateSimpleEspaceDoc(EspaceEntreprise espace) throws Exception {
        try (XWPFDocument doc = new XWPFDocument(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            
            Organization org = espace.getOrganization();
            
            XWPFParagraph titlePara = doc.createParagraph();
            titlePara.setAlignment(ParagraphAlignment.CENTER);
            XWPFRun titleRun = titlePara.createRun();
            titleRun.setText("FICHE ESPACE ENTREPRISE");
            titleRun.setBold(true);
            titleRun.setFontSize(18);
            titlePara.createRun().addBreak();
            
            // Contact
            addSection(doc, "1. CONTACT");
            addField(doc, "Date de contact:", espace.getCreatedAt() != null ? espace.getCreatedAt().toLocalDate().toString() : "");
            addField(doc, "Heure de contact:", espace.getCreatedAt() != null ? espace.getCreatedAt().toLocalTime().toString() : "");
            
            // Objet de la visite
            addSection(doc, "2. OBJET DE LA VISITE");
            addField(doc, "Objet:", espace.getObjetVisite());
            
            // Demandeur
            addSection(doc, "3. IDENTIFICATION DU DEMANDEUR");
            addField(doc, "Nom et prénom:", org != null ? org.getName() : "");
            addField(doc, "Téléphone fixe:", org != null ? org.getTelFixe() : "");
            addField(doc, "GSM:", org != null ? org.getTelGsm() : "");
            addField(doc, "Email:", org != null ? org.getEmailContact() : "");
            addField(doc, "Adresse:", org != null ? org.getAdresse() : "");
            addField(doc, "Ville:", org != null ? org.getVille() : "");
            addField(doc, "Accepte envois:", Boolean.TRUE.equals(espace.getAccepteEnvoi()) ? "Oui" : "Non");
            
            // Entreprise
            addSection(doc, "4. IDENTIFICATION DE L'ENTREPRISE");
            addField(doc, "Dénomination:", org != null ? org.getName() : "");
            addField(doc, "Code ICE:", org != null ? org.getIce() : "");
            addField(doc, "Représentant légal:", org != null ? org.getName() : "");
            addField(doc, "Forme juridique:", org != null ? org.getFormeJuridique() : "");
            addField(doc, "Taille entreprise:", org != null ? org.getTaille() : "");
            addField(doc, "Secteur d'activité:", org != null ? org.getSecteurActivite() : "");
            addField(doc, "Activité:", org != null ? org.getDescription() : "");
            
            // CCIS
            addSection(doc, "5. CONSEILLER CCIS");
            addField(doc, "Conseiller:", "");
            addField(doc, "Qualité:", "");
            
            doc.write(out);
            return out.toByteArray();
        }
    }

    // ==================== HELPER METHODS ====================

    private void addSection(XWPFDocument doc, String title) {
        XWPFParagraph para = doc.createParagraph();
        XWPFRun run = para.createRun();
        run.setText(title);
        run.setBold(true);
        run.setFontSize(14);
        run.addBreak();
    }

    private void addField(XWPFDocument doc, String label, String value) {
        XWPFParagraph para = doc.createParagraph();
        XWPFRun run = para.createRun();
        run.setText(label + " ");
        run.setBold(true);
        run = para.createRun();
        run.setText(value != null ? value : "");
        run.addBreak();
    }

    private void replaceTextInDocument(XWPFDocument doc, Map<String, String> replacements) {
        // Replace in paragraphs
        for (XWPFParagraph paragraph : doc.getParagraphs()) {
            replaceTextInParagraph(paragraph, replacements);
        }
        
        // Replace in tables
        for (XWPFTable table : doc.getTables()) {
            for (XWPFTableRow row : table.getRows()) {
                for (XWPFTableCell cell : row.getTableCells()) {
                    for (XWPFParagraph paragraph : cell.getParagraphs()) {
                        replaceTextInParagraph(paragraph, replacements);
                    }
                }
            }
        }
    }

    private void replaceTextInParagraph(XWPFParagraph paragraph, Map<String, String> replacements) {
        List<XWPFRun> runs = paragraph.getRuns();
        if (runs == null || runs.isEmpty()) return;
        
        StringBuilder fullText = new StringBuilder();
        for (XWPFRun run : runs) {
            String text = run.getText(0);
            if (text != null) {
                fullText.append(text);
            }
        }
        
        String text = fullText.toString();
        for (Map.Entry<String, String> entry : replacements.entrySet()) {
            if (entry.getKey() != null && entry.getValue() != null) {
                text = text.replace(entry.getKey(), entry.getValue());
            }
        }
        
        // Clear and rewrite runs
        for (int i = runs.size() - 1; i > 0; i--) {
            paragraph.removeRun(i);
        }
        
        if (runs.size() > 0) {
            runs.get(0).setText(text, 0);
        } else {
            XWPFRun newRun = paragraph.createRun();
            newRun.setText(text);
        }
    }

 
}