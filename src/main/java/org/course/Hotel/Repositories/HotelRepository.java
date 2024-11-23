package org.course.Hotel.Repositories;

import jakarta.transaction.Transactional;
import org.course.Hotel.Models.Hotel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HotelRepository extends JpaRepository<Hotel, Long> {
    @Query("SELECT h from Hotel h where h.location = :location")
    List<Hotel> findByLocation(@Param("location") String location);

    @Query("SELECT h from Hotel h where h.rating > :rating")
    List<Hotel> findByRatingGreaterThanEqual(@Param("rating") Double rating);

    @Query("SELECT h from Hotel h where h.distance < :distance")
    List<Hotel> findByDistance(@Param("distance") Double distance);

    @Modifying
    @Transactional
    @Query("UPDATE Hotel h SET h.name = :name, h.location = :location, h.rating=:rating WHERE h.hotelId = :hotelId")
    void updateHotel(@Param("hotelId") Long hotelId, @Param("name") String name, @Param("location") String location, @Param("rating") Double rating);
}
