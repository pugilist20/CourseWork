package org.course.Hotel.Models;

import jakarta.persistence.*;
import lombok.*;

@Entity(name="Guest")
@Table(name="Guests")
@Getter
@Setter
@NoArgsConstructor
@EqualsAndHashCode
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

    @Override
    public String toString() {
        return guestId+ " Постоялец. " +
                "Имя: " + firstName +
                ", фамилия: " + lastName +
                ", номер телефона" + phoneNumber +
                ", почта: " + email;
    }
}
