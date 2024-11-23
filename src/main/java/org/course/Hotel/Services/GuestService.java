package org.course.Hotel.Services;

import lombok.AllArgsConstructor;
import org.course.Hotel.DTO.GuestRequest;
import org.course.Hotel.Enum.Type;
import org.course.Hotel.Models.*;
import org.course.Hotel.Repositories.BookingProvisionRepository;
import org.course.Hotel.Repositories.BookingRepository;
import org.course.Hotel.Repositories.GuestRepository;
import org.course.Hotel.Repositories.HotelRepository;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class GuestService {

    private GuestRepository guestRepository;

    private BookingRepository bookingRepository;

    private BookingProvisionRepository bookingProvisionRepository;

    private HotelRepository hotelRepository;

    public List<Guest> findAllGuests() {
        return guestRepository.findAll();
    }

    public Optional<Guest> findGuestById(Long id) {
        return guestRepository.findById(id);
    }

    public Optional<Guest> findGuestByEmail(String email) {
        return guestRepository.findByEmail(email);
    }

    public Optional<Guest> findGuestByPhoneNumber(String phoneNumber) {
        return guestRepository.findByPhoneNumber(phoneNumber);
    }

    public List<Guest> findGuestByHotelId(Long hotelId) {
        return guestRepository.findByHotelId(hotelId);
    }

    public Guest saveGuest(GuestRequest guestRequest) {
        Hotel hotel = hotelRepository.findById(guestRequest.getHotelId())
                .orElseThrow(() -> new IllegalStateException("Отель с указанным ID не существует"));


        Guest guest = new Guest();
        guest.setFirstName(guestRequest.getFirstName());
        guest.setLastName(guestRequest.getLastName());
        guest.setPhoneNumber(guestRequest.getPhoneNumber());
        guest.setEmail(guestRequest.getEmail());
        guest.setHotel(hotel);
        return guestRepository.save(guest);
    }

    public void updateGuest(GuestRequest guestRequest) {
        Hotel hotel = hotelRepository.findById(guestRequest.getHotelId())
                .orElseThrow(() -> new IllegalStateException("Отель с указанным ID не существует"));
        guestRepository.findById(guestRequest.getGuestId()).orElseThrow(() -> new IllegalStateException("Постоялец с указанным ID не существует"));

        Guest guest=new Guest();
        guest.setGuestId(guestRequest.getGuestId());
        guest.setFirstName(guestRequest.getFirstName());
        guest.setLastName(guestRequest.getLastName());
        guest.setPhoneNumber(guestRequest.getPhoneNumber());
        guest.setEmail(guestRequest.getEmail());
        guest.setHotel(hotel);
        guestRepository.updateGuest(guest.getGuestId(), (guest.getEmail().isEmpty()?guestRepository.findById(guest.getGuestId()).get().getEmail():guest.getEmail()), (guest.getFirstName().isEmpty()?guestRepository.findById(guest.getGuestId()).get().getFirstName():guest.getFirstName()), (guest.getLastName().isEmpty()?guestRepository.findById(guest.getGuestId()).get().getLastName():guest.getLastName()), (guest.getPhoneNumber().isEmpty()?guestRepository.findById(guest.getGuestId()).get().getPhoneNumber():guest.getPhoneNumber()), hotel.getHotelId());
    }

    public void deleteGuest(Long id) {
        if (!bookingRepository.findByGuestId(id).isEmpty()) {
            throw new IllegalStateException("Невозможно удалить гостя с активными бронированиями");
        }
        guestRepository.deleteById(id);
    }

    public void deleteGuestCascade(Long id){
        List<Booking> bookingList=bookingRepository.findByGuestId(id);
        if(!bookingList.isEmpty()){
            for (Booking booking : bookingList) {
                List<BookingProvision> bookingProvisionList=bookingProvisionRepository.findByBookingId(booking.getBookingId());
                if(!bookingProvisionList.isEmpty()){
                    for (BookingProvision bookingProvision : bookingProvisionList) {
                        bookingProvisionRepository.deleteById(bookingProvision.getBookingProvisionId());
                    }
                }
                bookingRepository.deleteById(booking.getBookingId());
            }
        }
        guestRepository.deleteById(id);
    }

}

