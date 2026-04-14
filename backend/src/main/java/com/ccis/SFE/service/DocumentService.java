package com.ccis.SFE.service;

import com.ccis.SFE.entity.DemandeSalle;
import fr.opensagres.xdocreport.document.IXDocReport;
import fr.opensagres.xdocreport.document.registry.XDocReportRegistry;
import fr.opensagres.xdocreport.template.IContext;
import fr.opensagres.xdocreport.template.TemplateEngineKind;
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

            String nomAssocSafe = demande.getNomAssociation() != null ? demande.getNomAssociation().replaceAll("[\\\\/:*?\"<>|]", "_") : "Association";
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
            return baos.toByteArray(); // Retourne le fichier complet prêt à télécharger

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
        
        context.put("NA", demande.getNomAssociation());
        context.put("V", demande.getVille());
        context.put("HR", convertTimeToArabicWords(demande.getHeureReunion()));
        LocalDate dateReunion = demande.getDateReunion();
        if(dateReunion != null) {
            String moisReunionArabe = getMoisArabe(dateReunion.getMonthValue());
            context.put("DR", String.format("%02d", dateReunion.getDayOfMonth()) + " " + moisReunionArabe + " " + dateReunion.getYear());
        }
        context .put("AS", demande.getActiviteOuSujet() != null ? demande.getActiviteOuSujet() : "");
        LocalDate dateDemande = demande.getDateDemande();
        if(dateDemande != null) {
            context.put("DD", String.valueOf(dateDemande.getYear())+"/"+String.format("%02d", dateDemande.getMonthValue())+"/"+String.format("%02d", dateDemande.getDayOfMonth()));
        }

        if (demande.isAssociationCreee()) {
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

// 
}