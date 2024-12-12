    package org.course.Hotel.Models;

    import jakarta.persistence.*;

    import lombok.*;

    @Entity (name="Room")
    @Table(name = "Rooms")
    @Data
    public class Room {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long roomId;

        @ManyToOne
        @JoinColumn(name = "hotel_id")
        private Hotel hotel;

        @Column(name="roomType")
        private String roomType;

        @Column(name="price")
        private Double price;

        @Column(name="size")
        private Double size;
}
