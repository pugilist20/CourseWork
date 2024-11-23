package org.course.Hotel.Repositories;

import jakarta.transaction.Transactional;
import org.course.Hotel.Models.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {
    @Query("select r from Room r where r.hotel.id = :hotelId")
    List<Room> findByHotelId(@Param("hotelId") Long hotelId);  // Поиск всех комнат по идентификатору отеля

    @Query("select r from Room r where r.roomType = :roomType")
    List<Room> findByRoomType(@Param("roomType") String roomType);

    @Query("select r from Room r where r.size = :size")
    List<Room> findBySize(@Param("size") Double size);

    @Modifying
    @Transactional
    @Query("UPDATE Room r SET r.hotel.hotelId = :hotelId, r.roomType = :roomType, r.price = :price, r.size = :size WHERE r.roomId = :roomId")
    void updateRoom(@Param("roomId") Long roomId, @Param("hotelId") Long hotelId, @Param("roomType") String roomType, @Param("price") Double price, @Param("size") Double size);

}

