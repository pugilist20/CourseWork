package org.course.Hotel.DTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RoomRequest {
    private Long roomId;
    private Long hotelId;
    private String roomType;
    private Double price;
    private Double size;
}
