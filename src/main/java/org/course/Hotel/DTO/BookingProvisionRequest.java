package org.course.Hotel.DTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BookingProvisionRequest {
    private Long bookingProvisionId;
    private Long bookingId;
    private Long provisionId;
}
