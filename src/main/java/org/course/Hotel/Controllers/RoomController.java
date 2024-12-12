package org.course.Hotel.Controllers;

import lombok.AllArgsConstructor;
import org.course.Hotel.DTO.RoomRequest;
import org.course.Hotel.Models.Room;
import org.course.Hotel.Services.RoomService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/univer/rooms")
@AllArgsConstructor
public class RoomController {
    private RoomService roomService;

    @GetMapping
    public List<Room> findAllRooms() {
        return roomService.findAllRooms();
    }

    @GetMapping("id/{id}")
    public Room findRoomById(@PathVariable Long id) {
        return roomService.findRoomById(id).orElse(null);
    }

    @GetMapping("roomType/{roomType}")
    public List<Room> findRoomsByRoomType(@PathVariable String roomType) {
        return roomService.findRoomsByRoomType(roomType);
    }

    @GetMapping("hotelId/{hotelId}")
    public List<Room> findRoomsByHotelId(@PathVariable Long hotelId) {
        return roomService.findRoomsByHotelId(hotelId);
    }

    @GetMapping("size/{size}")
    public List<Room> findRoomsBySize(@PathVariable Double size) {
        return roomService.findRoomsBySize(size);
    }

    @PostMapping("saveRoom")
    public void saveRoom(@RequestBody RoomRequest roomRequest) {
        roomService.saveRoom(roomRequest);
    }

    @PostMapping("updateRoom")
    public void updateRoom(@RequestBody RoomRequest roomRequest) {
        roomService.updateRoom(roomRequest);
    }

    @DeleteMapping("deleteRoom/{id}")
    public void deleteRoom(@PathVariable Long id) {
        roomService.deleteRoom(id);
    }

    @DeleteMapping("deleteRoomCascade/{id}")
    public void deleteRoomCascade(@PathVariable Long id) {
        roomService.deleteRoomCascade(id);
    }
}
