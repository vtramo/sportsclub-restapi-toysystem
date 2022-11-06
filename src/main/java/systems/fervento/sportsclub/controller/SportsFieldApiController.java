package systems.fervento.sportsclub.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import systems.fervento.sportsclub.mapper.SportsFieldApiMapper;
import systems.fervento.sportsclub.mapper.SportsFieldReservationsSummaryApiMapper;
import systems.fervento.sportsclub.openapi.api.SportsFieldsApi;
import systems.fervento.sportsclub.openapi.model.SportEnum;
import systems.fervento.sportsclub.openapi.model.SportsField;
import systems.fervento.sportsclub.openapi.model.SportsFieldReservationsSummary;
import systems.fervento.sportsclub.service.ReservationSummaryService;
import systems.fervento.sportsclub.service.SportsFieldService;

import java.time.ZonedDateTime;
import java.util.List;

import static java.util.stream.Collectors.toList;

@RestController
public class SportsFieldApiController implements SportsFieldsApi {

    private final SportsFieldService sportsFieldService;
    private final ReservationSummaryService reservationSummaryService;
    private final SportsFieldApiMapper sportsFieldApiMapper = SportsFieldApiMapper.INSTANCE;
    private final SportsFieldReservationsSummaryApiMapper sportsFieldReservationsSummaryApiMapper =
        SportsFieldReservationsSummaryApiMapper.INSTANCE;

    public SportsFieldApiController(
        SportsFieldService sportsFieldService,
        ReservationSummaryService reservationSummaryService
    ) {
        this.sportsFieldService = sportsFieldService;
        this.reservationSummaryService = reservationSummaryService;
    }

    @Override
    public ResponseEntity<List<SportsField>> getSportsFields(
        SportEnum filterBySport,
        String sortBy,
        Long filterByOwnerId
    ) {
        final String sport = (filterBySport == null) ? null : filterBySport.toString();
        return ResponseEntity.ok(
            sportsFieldService
                .getSportsFields(sortBy, sport, filterByOwnerId)
                .stream()
                .map(sportsFieldApiMapper::mapToSportsFieldApi)
                .collect(toList())
        );
    }

    @Override
    public ResponseEntity<SportsField> getSportsFieldsById(Long sportsFieldId) {
        return ResponseEntity.ok(
            sportsFieldApiMapper.mapToSportsFieldApi(
                sportsFieldService.getSportsFieldById(sportsFieldId)
            )
        );
    }

    @Override
    public ResponseEntity<SportsFieldReservationsSummary> generateSportsFieldReservationsSummary(
        Long sportsFieldId,
        ZonedDateTime startDate,
        ZonedDateTime endDate,
        String sortBy
    ) {
        final var generatedSportsFieldReservationsSummary = reservationSummaryService
            .generateReservationsSummaryForSportsField(
                sortBy,
                startDate,
                endDate,
                sportsFieldId
            );

        return new ResponseEntity<>(
            sportsFieldReservationsSummaryApiMapper.mapToSportsFieldReservationsSummary(generatedSportsFieldReservationsSummary),
            HttpStatus.CREATED
        );
    }
}
