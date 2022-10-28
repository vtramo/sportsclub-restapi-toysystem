package systems.fervento.sportsclub.service;

import org.springframework.stereotype.Service;
import systems.fervento.sportsclub.repository.SportsFacilityRepository;

@Service
public class SportsFacilityService {
    private final SportsFacilityRepository sportsFacilityRepository;

    public SportsFacilityService(SportsFacilityRepository sportsFacilityRepository) {
        this.sportsFacilityRepository = sportsFacilityRepository;
    }

    public Iterable<?> getAll() {
        return sportsFacilityRepository.findAll();
    }
}
