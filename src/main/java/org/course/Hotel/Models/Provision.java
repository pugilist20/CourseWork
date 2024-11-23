package org.course.Hotel.Models;

import jakarta.persistence.*;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity(name="Provision")
@Table(name = "Provisions")
@Getter
@Setter
@NoArgsConstructor
@EqualsAndHashCode
public class Provision {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long provisionId;

    @ManyToOne
    @JoinColumn(name = "hotel_id")
    private Hotel hotel;

    @Column(name="provisionName")
    private String provisionName;

    @Column(name="price")
    private Double price;

    // Getters and Setters
}
