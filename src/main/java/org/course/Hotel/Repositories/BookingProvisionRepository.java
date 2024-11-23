package org.course.Hotel.Repositories;

import jakarta.transaction.Transactional;
import org.course.Hotel.Models.BookingProvision;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BookingProvisionRepository extends JpaRepository<BookingProvision, Long> {
    @Query("select bp from BookingProvision bp where bp.provision.provisionId = :provisionId")
    List<BookingProvision> findByProvisionId(@Param("provisionId") Long provisionId);

    @Query("select bp from BookingProvision bp where bp.booking.bookingId = :bookingId")
    List<BookingProvision> findByBookingId(@Param("bookingId") Long bookingId);

    @Modifying
    @Transactional
    @Query("UPDATE BookingProvision bp SET bp.bookingProvisionId = :bookingProvisionId, bp.booking.bookingId = :bookingId, bp.provision.provisionId = :provisionId where bp.bookingProvisionId = :bookingProvisionId")
    void updateBookingProvision(@Param("bookingProvisionId") Long bookingProvisionId, @Param("bookingId") Long bookingId, @Param("provisionId") Long provisionId);
}
