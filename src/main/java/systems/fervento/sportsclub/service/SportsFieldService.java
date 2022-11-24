package systems.fervento.sportsclub.service;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import systems.fervento.sportsclub.data.SportsFieldData;
import systems.fervento.sportsclub.entity.SportsFieldEntity;
import systems.fervento.sportsclub.exception.ResourceNotFoundException;
import systems.fervento.sportsclub.mapper.SportsFieldDataMapper;
import systems.fervento.sportsclub.repository.SportsFieldRepository;

import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.stream.Stream;

import static java.util.stream.Collectors.toList;

@Service
public class SportsFieldService {
    private final SportsFieldRepository sportsFieldRepository;
    private final SportsFieldDataMapper sportsFieldDataMapper;

    public SportsFieldService(
        SportsFieldRepository sportsFieldRepository,
        SportsFieldDataMapper sportsFieldDataMapper
    ) {
        this.sportsFieldRepository = sportsFieldRepository;
        this.sportsFieldDataMapper = sportsFieldDataMapper;
    }

    public SportsFieldData getSportsFieldById(final long sportsFieldId) {
        return sportsFieldRepository
            .findById(sportsFieldId)
            .map(sportsFieldDataMapper::mapToSportsFieldData)
            .orElseThrow(() -> new ResourceNotFoundException("There is no sports field with this id!"));
    }

    public List<SportsFieldData> getSportsFields(
        String sortBy,
        final String sport,
        final Long ownerId
    ) {
        Objects.requireNonNull(sortBy);
        final var sortingInfo = sortBy.split("\\."); // example: rating.asc
        final var sortOrder    = sortingInfo[1];
        final var sortProperty = sortingInfo[0];

        final Sort.Direction sortDirection = "desc".equals(sortOrder)
            ? Sort.Direction.DESC
            : Sort.Direction.ASC;

        final Sort sort = (Objects.equals(sortProperty, "rating"))
            ? Sort.unsorted()
            : Sort.by(sortDirection, sortProperty);

        Stream<SportsFieldEntity> sportsFieldEntitiesStream = sportsFieldRepository
            .getSportsFields(sort, sport, ownerId)
            .stream();

        if ((Objects.equals(sortProperty, "rating"))) {
            Comparator<SportsFieldEntity> byRating = (sportsFieldEntity1, sportsFieldEntity2) ->
                Float.compare(
                    sportsFieldRepository.getSportsFieldAverageRating(sportsFieldEntity1.getId()),
                    sportsFieldRepository.getSportsFieldAverageRating(sportsFieldEntity2.getId())
                );

            byRating = Sort.Direction.DESC.equals(sortDirection)
                ? byRating.reversed()
                : byRating;

            sportsFieldEntitiesStream = sportsFieldEntitiesStream.parallel().sorted(byRating);
        }

        final List<SportsFieldData> sportsFieldsData = sportsFieldEntitiesStream
            .map(sportsFieldDataMapper::mapToSportsFieldData)
            .collect(toList());

        sportsFieldEntitiesStream.close();

        return sportsFieldsData;
    }
}
