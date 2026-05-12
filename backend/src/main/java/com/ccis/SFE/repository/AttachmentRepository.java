package com.ccis.SFE.repository;

import com.ccis.SFE.entity.Attachment;
import com.ccis.SFE.entity.BaseDemande;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AttachmentRepository extends JpaRepository<Attachment, Long> {
    List<Attachment> findByDemande(BaseDemande demande);
    List<Attachment> findByDemandeId(Long demandeId);
}