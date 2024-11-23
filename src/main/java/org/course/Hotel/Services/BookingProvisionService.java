package org.course.Hotel.Services;

import lombok.AllArgsConstructor;
import org.course.Hotel.DTO.BookingProvisionRequest;
import org.course.Hotel.Models.*;
import org.course.Hotel.Repositories.BookingProvisionRepository;
import org.course.Hotel.Repositories.BookingRepository;
import org.course.Hotel.Repositories.ProvisionRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
@AllArgsConstructor
public class BookingProvisionService {

    private BookingProvisionRepository bookingProvisionRepository;

    private BookingRepository bookingRepository;

    private ProvisionRepository provisionRepository;

    public List<BookingProvision> findAllBookingProvisions() {
        return bookingProvisionRepository.findAll();
    }

    public Optional<BookingProvision> findBookingProvisionById(Long id) {
        return bookingProvisionRepository.findById(id);
    }

    public List<BookingProvision> findBookingProvisionsByBookingId(Long bookingId) {
        return bookingProvisionRepository.findByBookingId(bookingId);
    }

    public List<BookingProvision> findbookingProvisionsByProvisionId(Long provisionId) {
        return bookingProvisionRepository.findByProvisionId(provisionId);
    }

    public void saveBookingProvision(BookingProvisionRequest bookingProvisionRequest) {
        Booking booking = bookingRepository.findById(bookingProvisionRequest.getBookingId())
                .orElseThrow(() -> new IllegalStateException("Бронирование с указанным ID не существует"));
        Provision provision = provisionRepository.findById(bookingProvisionRequest.getProvisionId())
                .orElseThrow(() -> new IllegalStateException("Услуга с указанным ID не существует"));
        if(!Objects.equals(booking.getRoom().getHotel().getHotelId(), provision.getHotel().getHotelId())){
            throw new IllegalStateException("Отели не совпадают");
        }
        BookingProvision bookingProvision = new BookingProvision();
        bookingProvision.setBooking(booking);
        bookingProvision.setProvision(provision);

        bookingProvisionRepository.save(bookingProvision);
    }

    public void updateBooking(BookingProvisionRequest bookingProvisionRequest) {
        Booking booking = bookingRepository.findById(bookingProvisionRequest.getBookingId())
                .orElseThrow(() -> new IllegalStateException("Бронирование с указанным ID не существует"));
        Provision provision = provisionRepository.findById(bookingProvisionRequest.getProvisionId())
                .orElseThrow(() -> new IllegalStateException("Услуга с указанным ID не существует"));
        if(!Objects.equals(booking.getRoom().getHotel().getHotelId(), provision.getHotel().getHotelId())){
            throw new IllegalStateException("Отели не совпадают");
        }
        bookingProvisionRepository.findById(bookingProvisionRequest.getBookingProvisionId())
                .orElseThrow(() -> new IllegalStateException("Связи бронирование-услуга с указанным ID не существует"));

        BookingProvision bookingProvision=new BookingProvision();
        bookingProvision.setBookingProvisionId(bookingProvisionRequest.getBookingProvisionId());
        bookingProvision.setBooking(booking);
        bookingProvision.setProvision(provision);

        bookingProvisionRepository.updateBookingProvision(bookingProvision.getBookingProvisionId(), bookingProvision.getBooking().getBookingId(), bookingProvision.getProvision().getProvisionId());
    }

    public void deleteBookingProvision(Long id) {
        bookingProvisionRepository.deleteById(id);
    }
}