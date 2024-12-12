package org.course.Hotel.Models;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity(name="Booking")
@Table(name = "Bookings")
@Data
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long bookingId;

    @ManyToOne
    @JoinColumn(name = "guest_id")
    private Guest guest;

    @ManyToOne
    @JoinColumn(name = "room_id")
    private Room room;

    @Column(name="checkInDate")
    private LocalDate checkInDate;

    @Column(name="checkOutDate")
    private LocalDate checkOutDate;
}

