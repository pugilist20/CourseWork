package org.course.Hotel.Services;
import lombok.AllArgsConstructor;
import org.course.Hotel.DTO.ProvisionRequest;
import org.course.Hotel.Models.*;
import org.course.Hotel.Repositories.BookingProvisionRepository;
import org.course.Hotel.Repositories.HotelRepository;
import org.course.Hotel.Repositories.ProvisionRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class ProvisionService {

    private final HotelRepository hotelRepository;
    private ProvisionRepository provisionRepository;

    private BookingProvisionRepository bookingProvisionRepository;

    public List<org.course.Hotel.Models.Provision> findAllProvisions() {
        return provisionRepository.findAll();
    }

    public Optional<Provision> findProvisionById(Long id) {
        return provisionRepository.findById(id);
    }

    public List<Provision> findProvisionByHotelId(Long id) {
        return provisionRepository.findByHotelId(id);
    }

    public Provision saveProvision(ProvisionRequest provisionRequest) {
        Hotel hotel = hotelRepository.findById(provisionRequest.getHotelId())
                .orElseThrow(() -> new IllegalStateException("Отель с указанным ID не существует"));

        Provision provision = new Provision();
        provision.setHotel(hotel);
        provision.setProvisionName(provisionRequest.getProvisionName());
        provision.setPrice(provisionRequest.getPrice());

        return provisionRepository.save(provision);
    }

    public void updateProvision(ProvisionRequest provisionRequest) {
        Hotel hotel = hotelRepository.findById(provisionRequest.getHotelId())
                .orElseThrow(() -> new IllegalStateException("Отель с указанным ID не существует"));

        provisionRepository.findById(provisionRequest.getProvisionId())
                .orElseThrow(()->new IllegalStateException("Бронирование с указанным ID не существует"));

        Provision provision = new Provision();
        provision.setProvisionId(provisionRequest.getProvisionId());
        provision.setHotel(hotel);
        provision.setProvisionName(provisionRequest.getProvisionName().isEmpty()?provisionRepository.findById(provisionRequest.getProvisionId()).get().getProvisionName():provisionRequest.getProvisionName());
        provision.setPrice(provisionRequest.getPrice()==null?provisionRepository.findById(provisionRequest.getProvisionId()).get().getPrice():provisionRequest.getPrice());

        provisionRepository.updateProvision(provision.getProvisionId(), provision.getHotel().getHotelId(), provision.getProvisionName(), provision.getPrice());
    }

    public void deleteProvision(Long id) {
        if (!bookingProvisionRepository.findByProvisionId(id).isEmpty()) {
            throw new IllegalStateException("Невозможно удалить услугу, которая используется в бронированиях");
        }
        provisionRepository.deleteById(id);
    }

    public void deleteProvisionCascade(Long id) {
        List<BookingProvision> bookingProvisionList=bookingProvisionRepository.findByProvisionId(id);
        if(!bookingProvisionList.isEmpty()){
            for (BookingProvision bookingProvision : bookingProvisionList) {
                bookingProvisionRepository.deleteById(bookingProvision.getBookingProvisionId());
            }
        }
        provisionRepository.deleteById(id);
    }


}

