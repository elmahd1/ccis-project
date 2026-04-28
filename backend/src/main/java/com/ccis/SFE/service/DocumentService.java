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
import java.time.LocalDate;
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

            // FIX: Get the organization name safely
            String nomAssoc = "Association";
            if (demande.getOrganization() != null && demande.getOrganization().getName() != null) {
                nomAssoc = demande.getOrganization().getName();
            }
            String nomAssocSafe = nomAssoc.replaceAll("[\\\\/:*?\"<>|]", "_");
            String dateDemande = demande.getDateDemande() != null ? demande.getDateDemande().toString() : "Date";

            // 1. Ajouter les pièces jointes au ZIP dans un sous-dossier interne
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

            // 2. Noms des fichiers dynamiques en Arabe
            String[] nomsFichiersArabes = {
                "طلب_قاعة_" + nomAssocSafe + "_" + dateDemande + ".docx",
                "إخبار_" + nomAssocSafe + "_" + dateDemande + ".docx",
                "موافقة_" + nomAssocSafe + "_" + dateDemande + ".docx"
            };

            // 3. Génération des 3 templates et ajout direct au ZIP
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
        
        // FIX: Extract Organization data
        Organization org = demande.getOrganization();
        String orgName = (org != null && org.getName() != null) ? org.getName() : "";
        boolean isCreee = (org != null && org.isOfficiallyCreated());

        context.put("NA", orgName);
        context.put("V", demande.getAdresse()); // Changed from getVille() to getAdresse()
        context.put("HR", convertTimeToArabicWords(demande.getHeureReunion()));
        
        LocalDate dateReunion = demande.getDateReunion();
        if(dateReunion != null) {
            String moisReunionArabe = getMoisArabe(dateReunion.getMonthValue());
            context.put("DR", String.format("%02d", dateReunion.getDayOfMonth()) + " " + moisReunionArabe + " " + dateReunion.getYear());
        }
        
        context.put("AS", demande.getActiviteOuSujet() != null ? demande.getActiviteOuSujet() : "");
        
        LocalDate dateDemande = demande.getDateDemande();
        if(dateDemande != null) {
            context.put("DD", String.valueOf(dateDemande.getYear())+"/"+String.format("%02d", dateDemande.getMonthValue())+"/"+String.format("%02d", dateDemande.getDayOfMonth()));
        }

        // FIX: Use the boolean from the Organization entity
        if (isCreee) {
            context.put("TR1", "الجمعية المهنية"); context.put("TR3", "رئيس جمعية");
            context.put("TR5","السيد رئيس الجمعية");
            context.put("NP1", demande.getMembre1() != null ? demande.getMembre1() : "");
            context.put("NP2", ""); context.put("NP3", "");
        } else {
            context.put("TR1", "اللجنة التحضيرية لجمعية");
            context.put("TR3", "اللجنة التحضيرية");
            context.put("TR5","السادة أعضاء اللجنة التحضيرية لجمعية");
            context.put("NP1", demande.getMembre1() != null ? demande.getMembre1() : "");
            context.put("NP2", demande.getMembre2() != null ? demande.getMembre2() : "");
            context.put("NP3", demande.getMembre3() != null ? demande.getMembre3() : "");
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
        
        String result = hoursArr[hour > 12 ? hour - 12 : hour];
        
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

            if (!document.getDocument().isSetBody()) document.getDocument().addNewBody();

            XWPFParagraph titlePara = document.createParagraph();
            titlePara.setAlignment(ParagraphAlignment.CENTER);
            titlePara.setSpacingAfter(400); 
            
            XWPFRun titleRun = titlePara.createRun();
            titleRun.setText("أنشطة الجمعيات المهنية وتنشيط المجموعات");
            titleRun.setBold(true);
            titleRun.setUnderline(UnderlinePatterns.SINGLE); 
            titleRun.setFontSize(20);
            titleRun.setFontFamily("Arial");

            XWPFTable table = document.createTable();
            table.setWidth("100%");
            table.getCTTbl().addNewTblPr().addNewBidiVisual(); 
            table.setCellMargins(120, 150, 120, 150);

            XWPFTableRow headerRow = table.getRow(0);
            headerRow.setHeight(700);

            String[] headers = {"اسم الجمعية أو الهيئة", "النشاط أو الموضوع", "التاريخ"};
            
            headerRow.getCell(0);
            headerRow.addNewTableCell();
            headerRow.addNewTableCell();

            for (int i = 0; i < 3; i++) {
                XWPFTableCell cell = headerRow.getCell(i);
                cell.setColor("009500");
                cell.setVerticalAlignment(XWPFTableCell.XWPFVertAlign.CENTER);
                
                XWPFParagraph p = cell.getParagraphs().get(0);
                p.setAlignment(ParagraphAlignment.CENTER);
                p.getCTP().addNewPPr().addNewBidi();

                XWPFRun r = p.createRun();
                r.setText(headers[i]);
                r.setBold(true);
                r.setColor("FFFFFF");
                r.setFontSize(13);
                r.setFontFamily("Arial");
            }

            for (DemandeSalle d : demandes) {
                XWPFTableRow row = table.createRow();
                row.setHeight(550);

                // FIX: Get organization name safely for the table
                String orgName = "";
                if (d.getOrganization() != null && d.getOrganization().getName() != null) {
                    orgName = d.getOrganization().getName();
                }

                String[] values = {
                    orgName,
                    (d.getActiviteOuSujet() != null) ? d.getActiviteOuSujet() : "",
                    (d.getDateReunion() != null) ? d.getDateReunion().toString() : ""
                };

                for (int i = 0; i < 3; i++) {
                    XWPFTableCell cell = row.getCell(i);
                    cell.setVerticalAlignment(XWPFTableCell.XWPFVertAlign.CENTER);
                    
                    XWPFParagraph p = cell.getParagraphs().get(0);
                    p.setAlignment(ParagraphAlignment.RIGHT);
                    p.getCTP().addNewPPr().addNewBidi();

                    XWPFRun r = p.createRun();
                    r.setText(values[i]);
                    r.setFontSize(11);
                    r.setFontFamily("Arial");
                }
            }

            document.write(out);
            return out.toByteArray();
        }
    }
    // --- 2. DEMARCHE ADMINISTRATIVE (NEW) ---
    public byte[] generateDemarcheDocument(DemarcheAdministrative demarche) {
        try {
            // TODO: Create a Word template for "fiche_demarche.docx" in your resources/templates folder
            String templatePath = "/templates/fiche_demarche.docx"; 
            InputStream in = getClass().getResourceAsStream(templatePath);
            if (in == null) throw new RuntimeException("Template introuvable: " + templatePath);

            // Using XDocReport just like you did for Salle
            fr.opensagres.xdocreport.document.IXDocReport report = fr.opensagres.xdocreport.document.registry.XDocReportRegistry.getRegistry().loadReport(in, fr.opensagres.xdocreport.template.TemplateEngineKind.Freemarker);
            fr.opensagres.xdocreport.template.IContext context = report.createContext();

            // Inject the new fields into the Word document
            Organization org = demarche.getOrganization();
            context.put("ENTREPRISE_NOM", org != null ? org.getName() : "");
            context.put("ENTREPRISE_ICE", org != null ? org.getIce() : "");
            context.put("OBJET_VISITE", demarche.getObjetVisite() != null ? demarche.getObjetVisite() : "");
            context.put("MONTANT", demarche.getMontant() != null ? demarche.getMontant() : "0.00");
            context.put("DATE_DELIVRANCE", demarche.getDateDelivrance() != null ? demarche.getDateDelivrance().toString() : "");

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            report.process(context, out);
            return out.toByteArray();

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Erreur lors de la génération de la Fiche Démarche.");
        }
    }

    // --- 3. ESPACE ENTREPRISE (NEW) ---
    public byte[] generateEspaceDocument(EspaceEntreprise espace) {
        try {
            // TODO: Create a Word template for "fiche_espace.docx"
            String templatePath = "/templates/fiche_espace.docx"; 
            InputStream in = getClass().getResourceAsStream(templatePath);
            if (in == null) throw new RuntimeException("Template introuvable: " + templatePath);

            fr.opensagres.xdocreport.document.IXDocReport report = fr.opensagres.xdocreport.document.registry.XDocReportRegistry.getRegistry().loadReport(in, fr.opensagres.xdocreport.template.TemplateEngineKind.Freemarker);
            fr.opensagres.xdocreport.template.IContext context = report.createContext();

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
            e.printStackTrace();
            throw new RuntimeException("Erreur lors de la génération de la Fiche Espace.");
        }
    }
}