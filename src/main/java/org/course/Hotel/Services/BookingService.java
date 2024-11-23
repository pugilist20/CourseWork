package org.course.Hotel.Services;
import lombok.AllArgsConstructor;
import org.course.Hotel.DTO.BookingRequest;
import org.course.Hotel.Models.Booking;
import org.course.Hotel.Models.BookingProvision;
import org.course.Hotel.Models.Guest;
import org.course.Hotel.Models.Room;
import org.course.Hotel.Repositories.BookingProvisionRepository;
import org.course.Hotel.Repositories.BookingRepository;
import org.course.Hotel.Repositories.GuestRepository;
import org.course.Hotel.Repositories.RoomRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
@AllArgsConstructor
public class BookingService {

    private BookingRepository bookingRepository;

    private GuestRepository guestRepository;

    private RoomRepository roomRepository;

    private BookingProvisionRepository bookingProvisionRepository;

    public List<Booking> findAllBookings() {
        return bookingRepository.findAll();
    }

    public Optional<Booking> findBookingById(Long id) {
        return bookingRepository.findById(id);
    }

    public List<Booking> findBookingsByGuestId(Long guestId) {
        return bookingRepository.findByGuestId(guestId);
    }

    public List<Booking> findBookingByRoomId(Long roomId) {
        return bookingRepository.findByRoomId(roomId);
    }

    public List<Booking> findByCheckInDateBetween(LocalDate checkInDate, LocalDate checkOutDate) {
        return bookingRepository.findByCheckInDateBetween(checkInDate, checkOutDate);
    }

    public Booking saveBooking(BookingRequest bookingRequest) {
        Guest guest = guestRepository.findById(bookingRequest.getGuestId())
                .orElseThrow(() -> new IllegalStateException("Гость с указанным ID не существует"));
        Room room = roomRepository.findById(bookingRequest.getRoomId())
                .orElseThrow(() -> new IllegalStateException("Комната с указанным ID не существует"));
        if(!Objects.equals(guest.getHotel().getHotelId(), room.getHotel().getHotelId())) {
            throw new IllegalStateException("Отели не совпадают");
        }
        Booking booking = new Booking();
        booking.setGuest(guest);
        booking.setRoom(room);
        booking.setCheckInDate(bookingRequest.getCheckInDate());
        booking.setCheckOutDate(bookingRequest.getCheckOutDate());

        if (booking.getCheckInDate().isAfter(booking.getCheckOutDate())) {
            throw new IllegalArgumentException("Дата заезда не может быть позже даты выезда");
        }

        return bookingRepository.save(booking);
    }

    public void updateBooking(BookingRequest bookingRequest){
        Guest guest = guestRepository.findById(bookingRequest.getGuestId())
                .orElseThrow(() -> new IllegalStateException("Гость с указанным ID не существует"));
        Room room = roomRepository.findById(bookingRequest.getRoomId())
                .orElseThrow(() -> new IllegalStateException("Комната с указанным ID не существует"));
        bookingRepository.findById(bookingRequest.getBookingId())
                .orElseThrow(()->new IllegalStateException("Бронирование с указанным ID не существует"));
        if(!Objects.equals(guest.getHotel().getHotelId(), room.getHotel().getHotelId())) {
            throw new IllegalStateException("Отели не совпадают");
        }
        Booking booking = new Booking();
        booking.setBookingId(bookingRequest.getBookingId());
        booking.setGuest(guest);
        booking.setRoom(room);
        booking.setCheckInDate(bookingRequest.getCheckInDate()==null?bookingRepository.findById(bookingRequest.getBookingId()).get().getCheckInDate() : bookingRequest.getCheckInDate());
        booking.setCheckOutDate(bookingRequest.getCheckInDate()==null?bookingRepository.findById(bookingRequest.getBookingId()).get().getCheckOutDate() : bookingRequest.getCheckOutDate());

        if (booking.getCheckInDate().isAfter(booking.getCheckOutDate())) {
            throw new IllegalArgumentException("Дата заезда не может быть позже даты выезда");
        }
        bookingRepository.updateBooking(booking.getBookingId(), booking.getGuest().getGuestId(), booking.getRoom().getRoomId(), booking.getCheckInDate(), booking.getCheckOutDate());
    }

    public void deleteBooking(Long id) {
        if (!bookingProvisionRepository.findByBookingId(id).isEmpty()) {
            throw new IllegalStateException();
        }
        bookingRepository.deleteById(id);
    }

    public void deleteBookingCascade(Long id){
        List<BookingProvision> list=bookingProvisionRepository.findByBookingId(id);
        if(!list.isEmpty()) {
            for (BookingProvision bp : list) {
                bookingProvisionRepository.deleteById(bp.getBookingProvisionId());
            }
        }
        bookingRepository.deleteById(id);
    }
}
