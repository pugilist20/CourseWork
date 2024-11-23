package org.course.Hotel.Controllers;

import lombok.AllArgsConstructor;
import org.course.Hotel.Models.Hotel;
import org.course.Hotel.Services.HotelService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/univer/hotels")
@AllArgsConstructor
public class HotelController {
    private final HotelService hotelService;
    @GetMapping()
    public List<Hotel> findAllHotels(){
        return hotelService.findAllHotels();
    }

    @GetMapping("id/{id}")
    public Hotel findHotelById(@PathVariable Long id) {
        return hotelService.findHotelById(id).orElse(null);
    }

    @GetMapping("location/{location}")
    public List<Hotel> findHotelByLocation(@PathVariable String location) {
        return hotelService.findHotelByLocation(location);
    }

    @GetMapping("rating/{rating}")
    public List<Hotel> findHotelByRatingGreaterThanEqual(@PathVariable Double rating) {
        return hotelService.findHotelByRatingGreaterThanEqual(rating);
    }

    @GetMapping("distance/{distance}")
    public List<Hotel> findHotelByDistance(@PathVariable Double distance) {
        return hotelService.findHotelByDistance(distance);
    }

    @PostMapping("saveHotel")
    public void saveHotel(@RequestBody Hotel hotel){
        hotelService.saveHotel(hotel);
    }

    @PostMapping("updateHotel")
    public void updateHotel(@RequestBody Hotel hotel){
        hotelService.updateHotel(hotel);
    }

    @DeleteMapping("deleteHotel/{id}")
    public void deleteHotel(@PathVariable Long id) {
        hotelService.deleteHotel(id);
    }

    @DeleteMapping("deleteHotelCascade/{id}")
    public void deleteHotelCascade(@PathVariable Long id) {
        hotelService.deleteHotelCascade(id);
    }
}
