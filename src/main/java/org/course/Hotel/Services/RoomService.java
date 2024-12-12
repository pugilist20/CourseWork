package org.course.Hotel.Services;

import lombok.AllArgsConstructor;
import org.course.Hotel.DTO.RoomRequest;
import org.course.Hotel.Enums.Type;
import org.course.Hotel.Models.Booking;
import org.course.Hotel.Models.BookingProvision;
import org.course.Hotel.Models.Hotel;
import org.course.Hotel.Models.Room;
import org.course.Hotel.Repositories.BookingProvisionRepository;
import org.course.Hotel.Repositories.BookingRepository;
import org.course.Hotel.Repositories.HotelRepository;
import org.course.Hotel.Repositories.RoomRepository;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class RoomService {

    private RoomRepository roomRepository;

    private BookingRepository bookingRepository;

    private HotelRepository hotelRepository;

    BookingProvisionRepository bookingProvisionRepository;

    public List<Room> findAllRooms() {
        return roomRepository.findAll();
    }

    public Optional<Room> findRoomById(Long id) {
        return roomRepository.findById(id);
    }

    public List<Room> findRoomsByRoomType(String roomType) {
        return roomRepository.findByRoomType(roomType);
    }

    public List<Room> findRoomsByHotelId(Long hotelId) {
        return roomRepository.findByHotelId(hotelId);
    }

    public List<Room> findRoomsBySize(Double size){
        return roomRepository.findBySize(size);
    }

    public void saveRoom(RoomRequest roomRequest) {
        Hotel hotel = hotelRepository.findById(roomRequest.getHotelId())
                .orElseThrow(() -> new IllegalStateException("Отель с указанным ID не существует"));
        String roomType = roomRequest.getRoomType();
        boolean isValidType = Arrays.stream(Type.values())
                .anyMatch(type -> type.name().equals(roomType));

        if (!isValidType) {
            return;
        }

        roomRequest.setRoomType(Type.valueOf(roomType).name());

        Room room = new Room();
        room.setHotel(hotel);
        room.setRoomType(roomRequest.getRoomType());
        room.setPrice(roomRequest.getPrice());
        room.setSize(roomRequest.getSize());
        roomRepository.save(room);
    }

    public void updateRoom(RoomRequest roomRequest) {
        Hotel hotel = hotelRepository.findById(roomRequest.getHotelId())
                .orElseThrow(() -> new IllegalStateException("Отель с указанным ID не существует"));
        roomRepository.findById(roomRequest.getRoomId()).orElseThrow(() -> new IllegalStateException("Номер с указанным ID не существует"));

        String roomType = roomRequest.getRoomType();
        boolean isValidType = Arrays.stream(Type.values())
                .anyMatch(type -> type.name().equals(roomType));

        if (!isValidType) {
            return;
        }

        roomRequest.setRoomType(Type.valueOf(roomType).name());

        Room room = new Room();
        room.setRoomId(roomRequest.getRoomId());
        room.setHotel(hotel);
        room.setRoomType(roomRequest.getRoomType());
        room.setPrice(roomRequest.getPrice());
        room.setSize(roomRequest.getSize());
        roomRepository.updateRoom(room.getRoomId(), room.getHotel().getHotelId(), room.getRoomType().isEmpty()?roomRepository.findById(room.getRoomId()).get().getRoomType():room.getRoomType(), room.getPrice()==null?roomRepository.findById(room.getRoomId()).get().getPrice():room.getPrice(),room.getSize()==null?roomRepository.findById(room.getRoomId()).get().getSize():room.getSize());
    }

    public void deleteRoom(Long id) {
        if(roomRepository.findById(id).isEmpty()){
            throw new IllegalStateException("Такого номера не существует");
        }
        if (!bookingRepository.findByRoomId(id).isEmpty()) {
            throw new IllegalStateException("Невозможно удалить комнату, которая используется в бронированиях");
        }
        roomRepository.deleteById(id);
    }

    public void deleteRoomCascade(Long id) {
        if(roomRepository.findById(id).isEmpty()){
            throw new IllegalStateException("Такого номера не существует");
        }
        List<Booking> bookingList = bookingRepository.findByRoomId(id);
        if (!bookingList.isEmpty()) {
            for (Booking booking : bookingList) {
                List<BookingProvision> bookingProvisionList = bookingProvisionRepository.findByBookingId(booking.getBookingId());
                if (!bookingProvisionList.isEmpty()) {
                    for (BookingProvision bookingProvision : bookingProvisionList) {
                        bookingProvisionRepository.deleteById(bookingProvision.getBookingProvisionId());
                    }
                }
                bookingRepository.deleteById(booking.getBookingId());
            }
        }
        roomRepository.deleteById(id);
    }
}

