package org.course.Hotel.Models;

import jakarta.persistence.*;
import lombok.*;

@Entity(name="BookingProvision")
@Table(name = "BookingProvisions")
@Data
public class BookingProvision {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long bookingProvisionId;

    @ManyToOne
    @JoinColumn(name = "booking_id")
    private Booking booking;

    @ManyToOne
    @JoinColumn(name = "provision_id")
    private Provision provision;

}
