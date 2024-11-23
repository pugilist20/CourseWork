package org.course.Hotel.Repositories;

import jakarta.transaction.Transactional;
import org.course.Hotel.Models.Provision;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ProvisionRepository extends JpaRepository<Provision, Long> {
    @Query("SELECT p from Provision p where p.hotel.hotelId=:hotelId")
    List<Provision> findByHotelId(@Param("hotelId") Long hotelId);

    @Modifying
    @Transactional
    @Query("UPDATE Provision p SET p.hotel.hotelId = :hotel, p.provisionName = :provisionName, p.price = :price WHERE p.provisionId = :provisionId")
    void updateProvision(@Param("provisionId") Long provisionId, @Param("hotel") Long hotel, @Param("provisionName") String provisionName, @Param("price") Double price);
}
