package org.course.Hotel.Models;

import jakarta.persistence.*;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity(name="BookingProvision")
@Table(name = "BookingProvisions")
@Getter
@Setter
@NoArgsConstructor
@EqualsAndHashCode
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
