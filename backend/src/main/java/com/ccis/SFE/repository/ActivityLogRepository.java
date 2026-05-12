package com.ccis.SFE.repository;

import com.ccis.SFE.entity.ActivityLog;
import com.ccis.SFE.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ActivityLogRepository extends JpaRepository<ActivityLog, Long> {
    
    Page<ActivityLog> findAllByOrderByTimestampDesc(Pageable pageable);
    
    Page<ActivityLog> findByUserIdOrderByTimestampDesc(Long userId, Pageable pageable);
    
    Page<ActivityLog> findByActionContainingIgnoreCaseOrDescriptionContainingIgnoreCase(
        String action, String description, Pageable pageable);
    
    @Query("SELECT a FROM ActivityLog a WHERE a.timestamp BETWEEN :start AND :end ORDER BY a.timestamp DESC")
    Page<ActivityLog> findByDateRange(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end, Pageable pageable);
    
    List<ActivityLog> findTop100ByOrderByTimestampDesc();
    
    @Query("SELECT a.action, COUNT(a) FROM ActivityLog a GROUP BY a.action ORDER BY COUNT(a) DESC")
    List<Object[]> getActionStatistics();
}