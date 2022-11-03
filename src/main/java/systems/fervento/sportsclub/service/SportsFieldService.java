package systems.fervento.sportsclub.service;

import org.springframework.stereotype.Service;
import systems.fervento.sportsclub.data.SportsFieldData;
import systems.fervento.sportsclub.entity.SportsFieldEntity;
import systems.fervento.sportsclub.mapper.SportsFieldDataMapper;
import systems.fervento.sportsclub.repository.SportsFieldRepository;

import java.util.Comparator;
import java.util.List;
import java.util.Objects;

import static java.util.stream.Collectors.toList;

@Service
public class SportsFieldService {

    private final SportsFieldRepository sportsFieldRepository;

    private final SportsFieldDataMapper sportsFieldDataMapper = SportsFieldDataMapper.INSTANCE;

    private final Comparator<SportsFieldEntity> byRating;

    public SportsFieldService(SportsFieldRepository sportsFieldRepository) {
        this.sportsFieldRepository = sportsFieldRepository;
        byRating = (sportsFieldEntity1, sportsFieldEntity2) ->
            Float.compare(
                sportsFieldRepository.getSportsFieldAverageRating(sportsFieldEntity1.getId()),
                sportsFieldRepository.getSportsFieldAverageRating(sportsFieldEntity2.getId())
            );
    }

    public List<SportsFieldData> getSportsFields() {
        return sportsFieldRepository
            .findAll()
            .parallelStream()
            .parallel()
            .map(sportsFieldDataMapper::mapToSportsFieldData)
            .collect(toList());
    }

    public List<SportsFieldData> getSportsFieldsFilteredBySport(final String sport) {
        Objects.requireNonNull(sport);
        return sportsFieldRepository
            .getSportsFieldEntitiesBySport(sport)
            .parallelStream()
            .map(sportsFieldDataMapper::mapToSportsFieldData)
            .collect(toList());
    }

    public List<SportsFieldData> getSportsFieldsSortedByRating(final boolean inAscendingOrder) {
        return sportsFieldRepository
            .findAll()
            .parallelStream()
            .sorted((inAscendingOrder) ? byRating : byRating.reversed())
            .map(sportsFieldDataMapper::mapToSportsFieldData)
            .collect(toList());
    }

    public List<SportsFieldData> getSportsFieldsFilteredBySportAndSortedByRating(
        final String sport,
        final boolean inAscendingOrder
    ) {
        return sportsFieldRepository
            .getSportsFieldEntitiesBySport(sport)
            .parallelStream()
            .sorted((inAscendingOrder) ? byRating : byRating.reversed())
            .map(sportsFieldDataMapper::mapToSportsFieldData)
            .collect(toList());
    }
}
