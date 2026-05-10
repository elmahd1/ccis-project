package com.ccis.SFE.service;

import com.ccis.SFE.entity.DemandeSalle;
import com.ccis.SFE.entity.DemarcheAdministrative;
import com.ccis.SFE.entity.EspaceEntreprise;
import com.ccis.SFE.entity.Organization;
import fr.opensagres.xdocreport.document.IXDocReport;
import fr.opensagres.xdocreport.document.registry.XDocReportRegistry;
import fr.opensagres.xdocreport.template.IContext;
import fr.opensagres.xdocreport.template.TemplateEngineKind;
import org.apache.poi.xwpf.usermodel.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.time.LocalDateTime;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

@Service
public class DocumentService {

    private String getMoisArabe(int monthNumber) {
        String[] moisArabes = {"يناير", "فبراير", "مارس", "أبريل", "ماي", "يونيو", "يوليوز", "غشت", "شتنبر", "أكتوبر", "نونبر", "دجنبر"};
        if (monthNumber >= 1 && monthNumber <= 12) return moisArabes[monthNumber - 1];
        return "";
    }

    public byte[] processAndDownloadZip(DemandeSalle demande, List<MultipartFile> documents) {
        try {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ZipOutputStream zos = new ZipOutputStream(baos);

            String nomAssoc = "Association";
            if (demande.getOrganization() != null && demande.getOrganization().getName() != null) {
                nomAssoc = demande.getOrganization().getName();
            }
            String nomAssocSafe = nomAssoc.replaceAll("[\\\\/:*?\"<>|]", "_");
            
            // FIX: BaseDemande uses 'createdAt' instead of 'dateDemande'
            String dateDemande = demande.getCreatedAt() != null ? demande.getCreatedAt().toLocalDate().toString() : "Date";

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

            String[] nomsFichiersArabes = {
                "طلب_قاعة_" + nomAssocSafe + "_" + dateDemande + ".docx",
                "إخبار_" + nomAssocSafe + "_" + dateDemande + ".docx",
                "موافقة_" + nomAssocSafe + "_" + dateDemande + ".docx"
            };

            for (int i = 1; i <= 3; i++) {
                String templatePath = "/templates/demande_template" + i + ".docx"; 
                byte[] docBytes = genererDocWithTemplate(demande, templatePath);

                ZipEntry zipEntry = new ZipEntry(nomsFichiersArabes[i-1]);
                zos.putNextEntry(zipEntry);
                zos.write(docBytes);
                zos.closeEntry();
            }

            zos.close();
            return baos.toByteArray();

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Erreur lors de la génération des documents.");
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
        context.put("V", demande.getAdresse()); 
        
        // FIX: DemandeSalle uses 'dateHeureReunion'
        if (demande.getDateHeureReunion() != null) {
            LocalDateTime dt = demande.getDateHeureReunion();
            context.put("HR", convertTimeToArabicWords(dt.toLocalTime().toString()));
            String moisReunionArabe = getMoisArabe(dt.getMonthValue());
            context.put("DR", String.format("%02d", dt.getDayOfMonth()) + " " + moisReunionArabe + " " + dt.getYear());
        }
        
        context.put("AS", demande.getActiviteOuSujet() != null ? demande.getActiviteOuSujet() : "");
        
        // FIX: BaseDemande uses 'createdAt'
        if(demande.getCreatedAt() != null) {
            LocalDateTime createdAt = demande.getCreatedAt();
            context.put("DD", createdAt.getYear() + "/" + String.format("%02d", createdAt.getMonthValue()) + "/" + String.format("%02d", createdAt.getDayOfMonth()));
        }

        if (isCreee) {
            context.put("TR1", "الجمعية المهنية"); 
            context.put("TR3", "رئيس جمعية");
            context.put("TR5","السيد رئيس الجمعية");
            context.put("NP1", demande.getMembres()); 
        } else {
            context.put("TR1", "اللجنة التحضيرية لجمعية");
            context.put("TR3", "اللجنة التحضيرية");
            context.put("TR5","السادة أعضاء اللجنة التحضيرية لجمعية");
            context.put("NP1", demande.getMembres()); 
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

    public byte[] exportAssociationsToWord(List<DemandeSalle> demandes) throws Exception {
        try (XWPFDocument document = new XWPFDocument();
             ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            XWPFParagraph titlePara = document.createParagraph();
            titlePara.setAlignment(ParagraphAlignment.CENTER);
            XWPFRun titleRun = titlePara.createRun();
            titleRun.setText("أنشطة الجمعيات المهنية وتنشيط المجموعات");
            titleRun.setBold(true);
            titleRun.setFontSize(20);

            XWPFTable table = document.createTable();
            table.setWidth("100%");
            table.getCTTbl().addNewTblPr().addNewBidiVisual(); 

            XWPFTableRow headerRow = table.getRow(0);
            String[] headers = {"اسم الجمعية أو الهيئة", "النشاط أو الموضوع", "التاريخ"};
            
            for (int i = 0; i < 3; i++) {
                XWPFTableCell cell = (i == 0) ? headerRow.getCell(0) : headerRow.addNewTableCell();
                cell.setColor("009500");
                XWPFParagraph p = cell.getParagraphs().get(0);
                p.setAlignment(ParagraphAlignment.CENTER);
                XWPFRun r = p.createRun();
                r.setText(headers[i]);
                r.setBold(true);
                r.setColor("FFFFFF");
            }

            for (DemandeSalle d : demandes) {
                XWPFTableRow row = table.createRow();
                String orgName = (d.getOrganization() != null) ? d.getOrganization().getName() : "";
                
                // FIX: Use getDateHeureReunion() instead of getDateReunion()
                String dateStr = (d.getDateHeureReunion() != null) ? d.getDateHeureReunion().toLocalDate().toString() : "";

                row.getCell(0).setText(orgName);
                row.getCell(1).setText(d.getActiviteOuSujet() != null ? d.getActiviteOuSujet() : "");
                row.getCell(2).setText(dateStr);
            }

            document.write(out);
            return out.toByteArray();
        }
    }

    public byte[] generateDemarcheDocument(DemarcheAdministrative demarche) {
        try {
            String templatePath = "/templates/fiche_demarche.docx"; 
            InputStream in = getClass().getResourceAsStream(templatePath);
            if (in == null) throw new RuntimeException("Template introuvable: " + templatePath);

            IXDocReport report = XDocReportRegistry.getRegistry().loadReport(in, TemplateEngineKind.Freemarker);
            IContext context = report.createContext();

            Organization org = demarche.getOrganization();
            context.put("ENTREPRISE_NOM", org != null ? org.getName() : "");
            context.put("ENTREPRISE_ICE", org != null ? org.getIce() : "");
            context.put("OBJET_VISITE", demarche.getObjetVisite() != null ? demarche.getObjetVisite() : "");
            context.put("MONTANT", demarche.getMontant() != null ? demarche.getMontant() : "0.00");
            
            // FIX: Use getDateHeureDelivrance() instead of getDateDelivrance()
            context.put("DATE_DELIVRANCE", demarche.getDateHeureDelivrance() != null ? demarche.getDateHeureDelivrance().toLocalDate().toString() : "");

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            report.process(context, out);
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de la génération de la Fiche Démarche.", e);
        }
    }

    public byte[] generateEspaceDocument(EspaceEntreprise espace) {
        try {
            String templatePath = "/templates/fiche_espace.docx"; 
            InputStream in = getClass().getResourceAsStream(templatePath);
            if (in == null) throw new RuntimeException("Template introuvable: " + templatePath);

            IXDocReport report = XDocReportRegistry.getRegistry().loadReport(in, TemplateEngineKind.Freemarker);
            IContext context = report.createContext();

            Organization org = espace.getOrganization();
            context.put("ENTREPRISE_NOM", org != null ? org.getName() : "");
            context.put("TAILLE", espace.getTailleEntreprise() != null ? espace.getTailleEntreprise() : "");
            context.put("OBJETS", espace.getObjetVisite() != null ? espace.getObjetVisite() : "");
            context.put("CONSEILLER", espace.getQualiteConseillerCCIS() != null ? espace.getQualiteConseillerCCIS() : "");
            context.put("RECOMMANDATION", espace.getRecommandation() != null ? espace.getRecommandation() : "");

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            report.process(context, out);
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de la génération de la Fiche Espace.", e);
        }
    }
}