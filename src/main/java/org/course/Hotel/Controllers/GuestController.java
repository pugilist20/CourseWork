package org.course.Hotel.Controllers;

import lombok.AllArgsConstructor;
import org.course.Hotel.DTO.GuestRequest;
import org.course.Hotel.Models.Guest;
import org.course.Hotel.Services.GuestService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/univer/guests")
@AllArgsConstructor
public class GuestController {
    private final GuestService guestService;

    @GetMapping
    public List<Guest> findAllGuests() {
        return guestService.findAllGuests();
    }

    @GetMapping("id/{id}")
    public Guest findGuestById(@PathVariable Long id) {
        return guestService.findGuestById(id).orElse(null);
    }

    @GetMapping("email/{email}")
    public Guest findGuestByEmail(@PathVariable String email) {
        return guestService.findGuestByEmail(email).orElse(null);
    }

    @GetMapping("phoneNumber/{phoneNumber}")
    public Guest findGuestByPhoneNumber(@PathVariable String phoneNumber) {
        return guestService.findGuestByPhoneNumber(phoneNumber).orElse(null);
    }

    @GetMapping("hotelId/{hotelId}")
    public List<Guest> findGuestByHotelId(@PathVariable Long hotelId) {
        return guestService.findGuestByHotelId(hotelId);
    }

    @PostMapping("saveGuest")
    public void saveGuest(@RequestBody GuestRequest guestRequest) {
        guestService.saveGuest(guestRequest);
    }

    @PostMapping("updateGuest")
    public void updateGuest(@RequestBody GuestRequest guestRequest) {
        guestService.updateGuest(guestRequest);
    }

    @DeleteMapping("deleteGuest/{id}")
    public void deleteGuest(@PathVariable Long id) {
        guestService.deleteGuest(id);
    }

    @DeleteMapping("deleteGuestCascde/{id}")
    public void deleteGuestCascade(@PathVariable Long id) {
        guestService.deleteGuestCascade(id);
    }
}
