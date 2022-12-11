package systems.fervento.sportsclub.service;

import org.springframework.stereotype.Service;
import systems.fervento.sportsclub.data.SportsFacilityData;
import systems.fervento.sportsclub.data.SportsFieldData;
import systems.fervento.sportsclub.entity.SportsFacilityEntity;
import systems.fervento.sportsclub.exception.ResourceNotFoundException;
import systems.fervento.sportsclub.mapper.SportsFacilityDataMapper;
import systems.fervento.sportsclub.mapper.SportsFieldDataMapper;
import systems.fervento.sportsclub.mapper.SportsFieldEntityMapper;
import systems.fervento.sportsclub.repository.SportsFacilityRepository;
import systems.fervento.sportsclub.repository.SportsFieldRepository;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class SportsFacilityService {
    private final SportsFacilityRepository sportsFacilityRepository;
    private final SportsFieldRepository sportsFieldRepository;

    private final SportsFacilityDataMapper sportsFacilityDataMapper;
    private final SportsFieldEntityMapper sportsFieldEntityMapper;
    private final SportsFieldDataMapper sportsFieldDataMapper;

    public SportsFacilityService(
        SportsFacilityRepository sportsFacilityRepository,
        SportsFieldRepository sportsFieldRepository,
        SportsFacilityDataMapper sportsFacilityDataMapper,
        SportsFieldEntityMapper sportsFieldEntityMapper,
        SportsFieldDataMapper sportsFieldDataMapper
    ) {
        this.sportsFacilityRepository = sportsFacilityRepository;
        this.sportsFieldRepository = sportsFieldRepository;
        this.sportsFacilityDataMapper = sportsFacilityDataMapper;
        this.sportsFieldEntityMapper = sportsFieldEntityMapper;
        this.sportsFieldDataMapper = sportsFieldDataMapper;
    }

    public List<SportsFacilityData> getAllByTotalNumberSportsFieldBetween(
        final int minTotalSportsFields,
        final int maxTotalSportsFields
    ) {
        return sportsFacilityRepository
            .findAllByTotalNumberSportsFieldsBetween(minTotalSportsFields, maxTotalSportsFields)
            .stream()
            .map(sportsFacilityDataMapper::mapToSportsFacilityData).toList();
    }

    public List<SportsFacilityData> getAllByOwnerIdAndTotalNumberSportsFieldBetween(
        final int minTotalSportsFields,
        final int maxTotalSportsFields,
        final Long ownerId
    ) {
        return sportsFacilityRepository
            .findAllByOwnerIdAndTotalNumberSportsFieldsBetween(ownerId, minTotalSportsFields, maxTotalSportsFields)
            .stream()
            .map(sportsFacilityDataMapper::mapToSportsFacilityData).toList();
    }

    public SportsFacilityData getById(Long sportsFacilityId) {
        final Optional<SportsFacilityEntity> sportsFacilityEntity = sportsFacilityRepository.findById(sportsFacilityId);
        return sportsFacilityEntity
            .map(sportsFacilityDataMapper::mapToSportsFacilityData)
            .orElseThrow(() -> new ResourceNotFoundException("There is no sports facility with this id!"));
    }

    public SportsFieldData createSportsField(Long sportsFacilityId, SportsFieldData sportsFieldData) {
        Objects.requireNonNull(sportsFieldData);
        final var sportsFacilityEntity = sportsFacilityRepository
            .findById(sportsFacilityId)
            .orElseThrow(() -> new ResourceNotFoundException("There is no sports facility with this id!"));

        sportsFieldData.setSportsFacilityId(sportsFacilityId);
        final var sportsFacilityData = sportsFacilityDataMapper
            .mapToSportsFacilityData(sportsFacilityEntity);
        sportsFieldData.setSportsFacility(sportsFacilityData);

        final var sportsFieldEntity = sportsFieldEntityMapper.map(sportsFieldData);
        sportsFieldRepository.save(sportsFieldEntity);

        sportsFacilityEntity.addSportsField(sportsFieldEntity);
        sportsFacilityRepository.save(sportsFacilityEntity);

        return sportsFieldDataMapper.mapToSportsFieldData(sportsFieldEntity);
    }
}
