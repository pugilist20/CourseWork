package org.course.Hotel.Controllers;

import lombok.AllArgsConstructor;
import org.course.Hotel.DTO.BookingRequest;
import org.course.Hotel.Models.Booking;
import org.course.Hotel.Services.BookingService;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/univer/bookings")
@AllArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @GetMapping
    public List<Booking> findAllBookings(){
        return bookingService.findAllBookings();
    }

    @GetMapping("id/{id}")
    public Booking findBookingById(@PathVariable Long id) {
        return bookingService.findBookingById(id).orElse(null);
    }

    @GetMapping("guestId/{guestId}")
    public List<Booking> findBookingsByGuestId(@PathVariable Long guestId){
        return bookingService.findBookingsByGuestId(guestId);
    }

    @GetMapping("roomId/{roomId}")
    public List<Booking> findBookingsByRoomId(@PathVariable Long roomId){
        return bookingService.findBookingByRoomId(roomId);
    }

    @GetMapping("date/{checkInDate}/{checkOutDate}")
    public List<Booking> findByCheckInDateBetween(@PathVariable LocalDate checkInDate, @PathVariable LocalDate checkOutDate) {
        return bookingService.findByCheckInDateBetween(checkInDate, checkOutDate);
    }

    @PostMapping("saveBooking")
    public void saveBooking(@RequestBody BookingRequest bookingRequest) {
        bookingService.saveBooking(bookingRequest);
    }

    @PostMapping("updateBooking")
    public void updateBooking(@RequestBody BookingRequest bookingRequest){
        bookingService.updateBooking(bookingRequest);
    }

    @DeleteMapping("deleteBooking/{id}")
    public void deleteBooking(@PathVariable Long id) {
        bookingService.deleteBooking(id);
    }

    @DeleteMapping("deleteBookingCascade/{id}")
    public void deleteBookingCascade(@PathVariable Long id) {
        bookingService.deleteBookingCascade(id);
    }
}
