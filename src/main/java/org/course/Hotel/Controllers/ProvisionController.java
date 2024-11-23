package org.course.Hotel.Controllers;

import lombok.AllArgsConstructor;
import org.course.Hotel.DTO.ProvisionRequest;
import org.course.Hotel.Models.Provision;
import org.course.Hotel.Services.ProvisionService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/univer/provisions")
@AllArgsConstructor
public class ProvisionController {

    private ProvisionService provisionService;

    @GetMapping
    public List<Provision> findAllProvisions() {
        return provisionService.findAllProvisions();
    }

    @GetMapping("id/{id}")
    public Provision findProvisionById(@PathVariable Long id) {
        return provisionService.findProvisionById(id).orElse(null);
    }

    @GetMapping("hotelId/{id}")
    public List<Provision> findProvisionByHotelId(@PathVariable Long id) {
        return provisionService.findProvisionByHotelId(id);
    }

    @PostMapping("saveProvision")
    public void saveProvision(@RequestBody ProvisionRequest provisionRequest) {
        provisionService.saveProvision(provisionRequest);
    }

    @PostMapping("updateProvision")
    public void updateProvision(@RequestBody ProvisionRequest provisionRequest) {
        provisionService.updateProvision(provisionRequest);
    }

    @DeleteMapping("deleteProvision/{id}")
    public void deleteProvision(@PathVariable Long id) {
        provisionService.deleteProvision(id);
    }

    @DeleteMapping("deleteProvisionCascade/{id}")
    public void deleteProvisionCascade(@PathVariable Long id) {
        provisionService.deleteProvisionCascade(id);
    }
}
