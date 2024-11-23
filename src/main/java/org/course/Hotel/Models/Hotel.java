package org.course.Hotel.Models;

import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@Entity(name = "Hotel")
@Table(name = "Hotels")
@Data
@Getter
@Setter
@NoArgsConstructor
@EqualsAndHashCode
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

    @Override
    public String toString() {
        return hotelId + "Отель. " +
                "Название: '" + name + '\'' +
                ", город: '" + location + '\'' +
                ", рейтинг: " + rating;
    }
}

