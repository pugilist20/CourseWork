package org.course.Hotel.DTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProvisionRequest {
    private Long provisionId;
    private Long hotelId;
    private String provisionName;
    private Double price;
}
