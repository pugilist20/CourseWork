package org.course.Hotel.DTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GuestRequest {
    private Long guestId;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String email;
    private Long hotelId;
}
