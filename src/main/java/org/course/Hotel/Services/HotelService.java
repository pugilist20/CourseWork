package org.course.Hotel.Services;

import lombok.AllArgsConstructor;
import org.course.Hotel.Models.*;
import org.course.Hotel.Repositories.*;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class HotelService {

    private final BookingProvisionRepository bookingProvisionRepository;
    private final BookingRepository bookingRepository;
    private final GuestRepository guestRepository;
    private HotelRepository hotelRepository;

    private RoomRepository roomRepository;

    private ProvisionRepository provisionRepository;

    public List<Hotel> findAllHotels() {
        return hotelRepository.findAll();
    }

    public Optional<Hotel> findHotelById(Long id) {
        return hotelRepository.findById(id);
    }

    public List<Hotel> findHotelByLocation(String location) {
        return hotelRepository.findByLocation(location);
    }

    public List<Hotel> findHotelByRatingGreaterThanEqual(Double rating) {
        return hotelRepository.findByRatingGreaterThanEqual(rating);
    }

    public List<Hotel> findHotelByDistance(Double distance) {
        return hotelRepository.findByDistance(distance);
    }

    public Hotel saveHotel(Hotel hotel) {
        return hotelRepository.save(hotel);
    }

    public void updateHotel(Hotel hotel){
        hotelRepository.findById(hotel.getHotelId())
                .orElseThrow(()->new IllegalStateException("Отель с указанным ID не существует"));
        hotelRepository.updateHotel(hotel.getHotelId(), (hotel.getName().isEmpty() ?hotelRepository.findById(hotel.getHotelId()).get().getName():hotel.getName()), (hotel.getLocation().isEmpty() ?hotelRepository.findById(hotel.getHotelId()).get().getLocation():hotel.getLocation()), (hotel.getRating()==null ?hotelRepository.findById(hotel.getHotelId()).get().getRating():hotel.getRating()));
    }

    public void deleteHotel(Long id) {
        if(hotelRepository.findById(id).isEmpty()){
            throw new IllegalStateException("Такого отеля не существует");
        }
        if (!roomRepository.findByHotelId(id).isEmpty()) {
            throw new IllegalStateException("Невозможно удалить отель с активными комнатами");
        }
        if (!provisionRepository.findByHotelId(id).isEmpty()) {
            throw new IllegalStateException("Невозможно удалить отель с активными услугами");
        }
        hotelRepository.deleteById(id);
    }

    public void deleteHotelCascade(Long id) {
        if(hotelRepository.findById(id).isEmpty()){
            throw new IllegalStateException("Такого отеля не существует");
        }
        if (!provisionRepository.findByHotelId(id).isEmpty()) {
            List<Provision> list=provisionRepository.findByHotelId(id);
            for (Provision provision : list) {
                List<BookingProvision> bookingProvisionList=bookingProvisionRepository.findByProvisionId(provision.getProvisionId());
                if(!bookingProvisionList.isEmpty()){
                    for (BookingProvision bookingProvision : bookingProvisionList) {
                        bookingProvisionRepository.deleteById(bookingProvision.getBookingProvisionId());
                    }
                }
                provisionRepository.deleteById(provision.getProvisionId());
            }
        }
        if (!roomRepository.findByHotelId(id).isEmpty()) {
            List<Room> list=roomRepository.findByHotelId(id);
            for (Room room: list) {
                List<Booking> bookingList=bookingRepository.findByRoomId(room.getRoomId());
                if(!bookingList.isEmpty()){
                    for (Booking booking : bookingList) {
                        bookingRepository.deleteById(booking.getBookingId());
                    }
                }
                roomRepository.deleteById(room.getRoomId());
            }
        }if (!guestRepository.findByHotelId(id).isEmpty()) {
            List<Guest> list=guestRepository.findByHotelId(id);
            for (Guest guest: list) {
                List<Booking> bookingList=bookingRepository.findByGuestId(guest.getGuestId());
                if(!bookingList.isEmpty()){
                    for (Booking booking : bookingList) {
                        bookingRepository.deleteById(booking.getBookingId());
                    }
                }
                guestRepository.deleteById(guest.getGuestId());
            }
        }
        hotelRepository.deleteById(id);
    }
}

