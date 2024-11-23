    package org.course.Hotel.Models;

    import jakarta.persistence.*;

    import lombok.*;

    @Entity (name="Room")
    @Table(name = "Rooms")
    @Getter
    @Setter
    @NoArgsConstructor
    @EqualsAndHashCode
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

        @Override
        public String toString() {
            return roomId+" Номер. " +
                    "Отель: " + hotel.getName() +
                    ", тип номера: " + roomType +
                    ", цена: " + price;
        }
    }
