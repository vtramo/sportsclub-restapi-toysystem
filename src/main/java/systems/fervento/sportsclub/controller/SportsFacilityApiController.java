package systems.fervento.sportsclub.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.NativeWebRequest;
import systems.fervento.sportsclub.data.SportsFacilityData;
import systems.fervento.sportsclub.exception.PreconditionViolationException;
import systems.fervento.sportsclub.mapper.SportsFacilityApiMapper;
import systems.fervento.sportsclub.mapper.SportsFieldApiMapper;
import systems.fervento.sportsclub.openapi.api.SportsFacilitiesApi;
import systems.fervento.sportsclub.openapi.model.SportsFacility;
import systems.fervento.sportsclub.openapi.model.SportsFacilityWithSportsFields;
import systems.fervento.sportsclub.openapi.model.SportsField;
import systems.fervento.sportsclub.service.SportsFacilityService;

import java.util.List;
import java.util.Optional;

import static java.util.stream.Collectors.toList;

@RestController
public class SportsFacilityApiController implements SportsFacilitiesApi {
    private final SportsFacilityService sportsFacilityService;

    private final SportsFacilityApiMapper sportsFacilityApiMapper = SportsFacilityApiMapper.INSTANCE;
    private final SportsFieldApiMapper sportsFieldApiMapper = SportsFieldApiMapper.INSTANCE;

    public SportsFacilityApiController(SportsFacilityService sportsFacilityService) {
        this.sportsFacilityService = sportsFacilityService;
    }

    @Override
    public Optional<NativeWebRequest> getRequest() {
        return SportsFacilitiesApi.super.getRequest();
    }

    @Override
    public ResponseEntity<SportsField> createSportsField(Long sportsFacilityId, SportsField sportsField) {
        var sportsFieldData = sportsFieldApiMapper.mapToSportsFieldData(sportsField);
        var createdSportsFieldData = sportsFacilityService.createSportsField(sportsFacilityId, sportsFieldData);
        return new ResponseEntity<>(
            sportsFieldApiMapper.mapToSportsFieldApi(createdSportsFieldData),
            HttpStatus.CREATED
        );
    }

    @Override
    public ResponseEntity<List<SportsFacility>> getSportsFacilities(
        Long filterByOwnerId,
        Integer totalSportsFieldGt,
        Integer totalSportsFieldLt
    ) {
        final Optional<Long> filterByOwnerIdQueryParam = Optional.ofNullable(filterByOwnerId);
        final int maxTotalSportsFields = (totalSportsFieldLt == null) ? Integer.MAX_VALUE : totalSportsFieldLt;
        final int minTotalSportsFields = (totalSportsFieldGt == null) ? -1 : totalSportsFieldGt;

        if (minTotalSportsFields > maxTotalSportsFields) {
            throw new PreconditionViolationException("totalSportsFieldLt must be greater than or equal to totalSportsFieldGt!");
        }

        final List<SportsFacilityData> sportsFacilities = (filterByOwnerIdQueryParam.isPresent())
            ? sportsFacilityService.getAllByOwnerIdAndTotalNumberSportsFieldBetween(
                minTotalSportsFields,
                maxTotalSportsFields,
                filterByOwnerIdQueryParam.get()
            )
            : sportsFacilityService.getAllByTotalNumberSportsFieldBetween(minTotalSportsFields, maxTotalSportsFields);

        return ResponseEntity.ok(sportsFacilities.stream()
            .map(sportsFacilityApiMapper::map)
            .collect(toList())
        );
    }

    @Override
    public ResponseEntity<SportsFacilityWithSportsFields> getSportsFacilityById(Long sportsFacilityId) {
        return ResponseEntity.ok(
            sportsFacilityApiMapper.mapToSportsFacilityWithSportsFields(
                sportsFacilityService.getById(sportsFacilityId)
            )
        );
    }
}
