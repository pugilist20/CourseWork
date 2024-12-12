package org.course.Hotel.Models;

import jakarta.persistence.*;
import lombok.*;


@Entity(name = "Hotel")
@Table(name = "Hotels")
@Data
public class Hotel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long hotelId;

    @Column(name = "name", unique = true)
    private String name;

    @Column(name = "location")
    private String location;

    @Column(name = "rating")
    private Double rating;

    @Column(name = "distance")
    private Double distance;
}

