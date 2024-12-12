package org.course.Hotel.Models;

import jakarta.persistence.*;
import lombok.*;

@Entity(name="Guest")
@Table(name="Guests")
@Data
public class Guest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long guestId;

    @Column(name="firstName")
    private String firstName;

    @Column(name="lastName")
    private String lastName;

    @Column(name="phoneNumber", unique = true)
    private String phoneNumber;

    @Column(name="email", unique = true)
    private String email;

    @ManyToOne
    @JoinColumn(name = "hotel_id")
    private Hotel hotel;
}
