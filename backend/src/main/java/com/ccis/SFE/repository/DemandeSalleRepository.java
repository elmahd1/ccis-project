package com.ccis.SFE.repository;

import com.ccis.SFE.entity.DemandeSalle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface DemandeSalleRepository extends JpaRepository<DemandeSalle, Long> {
    List<DemandeSalle> findByNomAssociation(String nomAssociation);
    List<DemandeSalle> findByDateReunionBetween(LocalDate startDate, LocalDate endDate);
}