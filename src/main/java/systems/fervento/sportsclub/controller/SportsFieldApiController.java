package systems.fervento.sportsclub.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import systems.fervento.sportsclub.data.SportsFieldData;
import systems.fervento.sportsclub.mapper.SportsFieldApiMapper;
import systems.fervento.sportsclub.openapi.api.SportsFieldsApi;
import systems.fervento.sportsclub.openapi.model.SportEnum;
import systems.fervento.sportsclub.openapi.model.SportsField;
import systems.fervento.sportsclub.service.SportsFieldService;

import java.util.List;
import java.util.Optional;
import java.util.function.Supplier;

import static java.util.stream.Collectors.toList;

@RestController
public class SportsFieldApiController implements SportsFieldsApi {

    private final SportsFieldService sportsFieldService;

    private final SportsFieldApiMapper sportsFieldApiMapper = SportsFieldApiMapper.INSTANCE;

    public SportsFieldApiController(SportsFieldService sportsFieldService) {
        this.sportsFieldService = sportsFieldService;
    }

    @Override
    public ResponseEntity<List<SportsField>> getSportsFields(SportEnum filterBySport, String sortByRating) {
        final Optional<SportEnum> filterBySportQueryParam = Optional.ofNullable(filterBySport);
        final Optional<String> filterByRatingQueryParam = Optional.ofNullable(sortByRating);

        Supplier<List<SportsFieldData>> getSportsFieldData = sportsFieldService::getSportsFields;
        if (filterBySportQueryParam.isPresent() && filterByRatingQueryParam.isPresent()) {
            var sport = filterBySport.toString();
            var isInAscendingOrder = "asc".equals(sortByRating);
            getSportsFieldData = () -> sportsFieldService.
                getSportsFieldsFilteredBySportAndSortedByRating(sport, isInAscendingOrder);
        } else if (filterBySportQueryParam.isPresent()) {
            var sport = filterBySport.toString();
            getSportsFieldData = () -> sportsFieldService.getSportsFieldsFilteredBySport(sport);
        } else if (filterByRatingQueryParam.isPresent()) {
            var isInAscendingOrder = "asc".equals(sortByRating);
            getSportsFieldData = () -> sportsFieldService.getSportsFieldsSortedByRating(isInAscendingOrder);
        }

        return ResponseEntity.ok(
            getSportsFieldData.get()
                .stream()
                .map(sportsFieldApiMapper::mapToSportsFieldApi)
                .collect(toList())
        );
    }

    @Override
    public ResponseEntity<SportsField> getSportsFieldsById(Long sportsFieldId) {
        return SportsFieldsApi.super.getSportsFieldsById(sportsFieldId);
    }
}
