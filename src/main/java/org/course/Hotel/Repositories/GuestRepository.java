package org.course.Hotel.Repositories;

import jakarta.transaction.Transactional;
import org.course.Hotel.Models.Guest;
import org.course.Hotel.Models.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GuestRepository extends JpaRepository<Guest, Long> {
    @Query("SELECT g from Guest g where g.email=:email")
    Optional<Guest> findByEmail(@Param("email") String email);

    @Query("SELECT g from Guest g where g.phoneNumber=:phoneNumber")
    Optional<Guest> findByPhoneNumber(@Param("phoneNumber") String phoneNumber);

    @Query("select g from Guest g where g.hotel.id = :hotelId")
    List<Guest> findByHotelId(@Param("hotelId") Long hotelId);

    @Modifying
    @Transactional
    @Query("UPDATE Guest g SET g.hotel.hotelId = :hotelId, g.email = :email, g.firstName = :firstName, g.lastName = :lastName, g.phoneNumber = :phoneNumber where g.guestId = :guestId")
    void updateGuest(@Param("guestId") Long guestId, @Param("email") String email, @Param("firstName") String firstName, @Param("lastName") String lastName, @Param("phoneNumber") String phoneNumber, @Param("hotelId") Long hotelId);
}
