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
import systems.fervento.sportsclub.openapi.model.SportsFieldsPage;
import systems.fervento.sportsclub.service.ReservationSummaryService;
import systems.fervento.sportsclub.service.SportsFieldService;

import java.time.ZonedDateTime;

@RestController
public class SportsFieldApiController implements SportsFieldsApi {

    private final SportsFieldService sportsFieldService;
    private final ReservationSummaryService reservationSummaryService;
    private final SportsFieldApiMapper sportsFieldApiMapper;
    private final SportsFieldReservationsSummaryApiMapper sportsFieldReservationsSummaryApiMapper;

    public SportsFieldApiController(
        SportsFieldService sportsFieldService,
        ReservationSummaryService reservationSummaryService,
        SportsFieldApiMapper sportsFieldApiMapper,
        SportsFieldReservationsSummaryApiMapper sportsFieldReservationsSummaryApiMapper
    ) {
        this.sportsFieldService = sportsFieldService;
        this.reservationSummaryService = reservationSummaryService;
        this.sportsFieldApiMapper = sportsFieldApiMapper;
        this.sportsFieldReservationsSummaryApiMapper = sportsFieldReservationsSummaryApiMapper;
    }

    @Override
    public ResponseEntity<SportsFieldsPage> getSportsFields(
        Integer pageNo,
        Integer pageSize,
        SportEnum filterBySport,
        String sortBy,
        Long filterByOwnerId
    ) {
        final String sport = (filterBySport == null) ? null : filterBySport.toString();
        return ResponseEntity.ok(
            sportsFieldApiMapper.mapToSportsFieldsPage(
                sportsFieldService.getSportsFields(pageNo, pageSize, sortBy, sport, filterByOwnerId)
            )
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
