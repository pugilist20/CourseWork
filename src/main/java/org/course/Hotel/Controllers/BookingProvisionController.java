package org.course.Hotel.Controllers;

import lombok.AllArgsConstructor;
import org.course.Hotel.DTO.BookingProvisionRequest;
import org.course.Hotel.Models.BookingProvision;
import org.course.Hotel.Services.BookingProvisionService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/univer/bookingProvisions")
@AllArgsConstructor
public class BookingProvisionController {

    private final BookingProvisionService bookingProvisionService;

    @GetMapping
    public List<BookingProvision> findAllBookingProvisions(){
        return bookingProvisionService.findAllBookingProvisions();
    }

    @GetMapping("id/{id}")
    public BookingProvision findBookingProvisionById(@PathVariable Long id) {
        return bookingProvisionService.findBookingProvisionById(id).orElse(null);
    }

    @GetMapping("bookingId/{bookingId}")
    public List<BookingProvision> findBookinProvisionsByBookingId(@PathVariable Long bookingId) {
        return bookingProvisionService.findBookingProvisionsByBookingId(bookingId);
    }

    @GetMapping("provisionId/{provisionId}")
    public List<BookingProvision> findBookinProvisionsByProvisionId(@PathVariable Long provisionId) {
        return bookingProvisionService.findbookingProvisionsByProvisionId(provisionId);
    }

    @PostMapping("saveBookingProvision")
    public void saveBookingProvision(@RequestBody BookingProvisionRequest bookingProvisionRequest) {
        bookingProvisionService.saveBookingProvision(bookingProvisionRequest);
    }

    @PostMapping("updateBookingProvision")
    public void updateBookingProvision(@RequestBody BookingProvisionRequest bookingProvisionRequest){
        bookingProvisionService.updateBooking(bookingProvisionRequest);
    }

    @DeleteMapping("deleteBookingProvision/{id}")
    public void deleteBookingProvision(@PathVariable Long id) {
        bookingProvisionService.deleteBookingProvision(id);
    }
}
