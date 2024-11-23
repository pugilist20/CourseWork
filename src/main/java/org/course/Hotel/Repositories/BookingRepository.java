package org.course.Hotel.Repositories;

import jakarta.transaction.Transactional;
import org.course.Hotel.Models.Booking;
import org.course.Hotel.Models.Guest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    @Query("SELECT b from Booking b where b.guest.guestId = :guest")
    List<Booking> findByGuestId(@Param("guest") Long guest);        // Поиск бронирований по идентификатору гостя

    @Query("SELECT b from Booking b where b.room.roomId = :room")
    List<Booking> findByRoomId(@Param("room") Long room);          // Поиск бронирований по идентификатору комнаты

    @Query("SELECT b from Booking b where (b.checkInDate >= :startDate and b.checkInDate < :endDate) or (b.checkOutDate > :startDate and b.checkOutDate <= :endDate) ")
    List<Booking> findByCheckInDateBetween(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Modifying
    @Transactional
    @Query("UPDATE Booking b SET b.guest.guestId = :guest, b.room.roomId=:room, b.checkInDate=:checkInDate, b.checkOutDate=:checkOutDate WHERE b.bookingId = :bookingId")
    void updateBooking(@Param("bookingId") Long bookingId, @Param("guest") Long guest, @Param("room") Long room, @Param("checkInDate") LocalDate checkInDate, @Param("checkOutDate") LocalDate checkOutDate);
}
