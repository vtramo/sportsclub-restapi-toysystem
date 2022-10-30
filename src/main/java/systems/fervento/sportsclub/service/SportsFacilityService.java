package systems.fervento.sportsclub.service;

import org.springframework.stereotype.Service;
import systems.fervento.sportsclub.data.SportsFacilityData;
import systems.fervento.sportsclub.entity.SportsFacilityEntity;
import systems.fervento.sportsclub.exception.ResourceNotFoundException;
import systems.fervento.sportsclub.mapper.SportsFacilityDataMapper;
import systems.fervento.sportsclub.repository.SportsFacilityRepository;

import java.util.List;
import java.util.Optional;

import static java.util.stream.Collectors.toUnmodifiableList;

@Service
public class SportsFacilityService {
    private final SportsFacilityRepository sportsFacilityRepository;

    private final SportsFacilityDataMapper sportsFacilityDataMapper = SportsFacilityDataMapper.INSTANCE;

    public SportsFacilityService(SportsFacilityRepository sportsFacilityRepository) {
        this.sportsFacilityRepository = sportsFacilityRepository;
    }

    public List<SportsFacilityData> getAllByTotalNumberSportsFieldBetween(
        final int minTotalSportsFields,
        final int maxTotalSportsFields
    ) {
        return sportsFacilityRepository
                .findAllByTotalNumberSportsFieldsBetween(minTotalSportsFields, maxTotalSportsFields)
                .stream()
                .map(sportsFacilityDataMapper::map)
                .collect(toUnmodifiableList());
    }

    public List<SportsFacilityData> getAllByOwnerIdAndTotalNumberSportsFieldBetween(
        final int minTotalSportsFields,
        final int maxTotalSportsFields,
        final Long ownerId
    ) {
        return sportsFacilityRepository
            .findAllByOwnerIdAndTotalNumberSportsFieldsBetween(ownerId, minTotalSportsFields, maxTotalSportsFields)
            .stream()
            .map(sportsFacilityDataMapper::map)
            .collect(toUnmodifiableList());
    }

    public SportsFacilityData getById(Long sportsFacilityId) {
        final Optional<SportsFacilityEntity> sportsFacilityEntity = sportsFacilityRepository.findById(sportsFacilityId);
        return sportsFacilityEntity
            .map(sportsFacilityDataMapper::map)
            .orElseThrow(() -> new ResourceNotFoundException("There is no sports facility with this id!"));
    }
}
