package systems.fervento.sportsclub.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
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

    public Page<SportsFieldData> getSportsFields(
        final int pageNo,
        final int pageSize,
        String sortBy,
        final String sport,
        final Long ownerId
    ) {
        Objects.requireNonNull(sortBy);
        final var sortingInfo = sortBy.split("\\."); // example: name.asc
        final var sortOrder    = sortingInfo[1];
        final var sortProperty = sortingInfo[0];

        final Sort.Direction sortDirection = "desc".equals(sortOrder)
            ? Sort.Direction.DESC
            : Sort.Direction.ASC;

        final Sort sort = Sort.by(sortDirection, sortProperty);

        final var pageRequest = PageRequest.of(pageNo, pageSize, sort);

        return sportsFieldRepository
            .getSportsFields(pageRequest, sport, ownerId)
            .map(sportsFieldDataMapper::mapToSportsFieldData);
    }
}
