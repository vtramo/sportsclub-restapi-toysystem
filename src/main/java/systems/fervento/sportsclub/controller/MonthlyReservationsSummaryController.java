package systems.fervento.sportsclub.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import systems.fervento.sportsclub.mapper.MonthlyReservationsSummaryApiMapper;
import systems.fervento.sportsclub.openapi.api.MonthlyReservationsSummariesApi;
import systems.fervento.sportsclub.openapi.model.MonthlyReservationsSummariesPage;
import systems.fervento.sportsclub.openapi.model.MonthlyReservationsSummary;
import systems.fervento.sportsclub.service.ReservationSummaryService;

@RestController
public class MonthlyReservationsSummaryController implements MonthlyReservationsSummariesApi {

    private final ReservationSummaryService reservationSummaryService;

    private final MonthlyReservationsSummaryApiMapper monthlyReservationsSummaryApiMapper;

    public MonthlyReservationsSummaryController(ReservationSummaryService reservationSummaryService, MonthlyReservationsSummaryApiMapper monthlyReservationsSummaryApiMapper) {
        this.reservationSummaryService = reservationSummaryService;
        this.monthlyReservationsSummaryApiMapper = monthlyReservationsSummaryApiMapper;
    }

    @Override
    public ResponseEntity<MonthlyReservationsSummary> getReservationsSummaryById(Long monthlyReservationsSummaryId) {
        return ResponseEntity.ok(monthlyReservationsSummaryApiMapper.mapToMonthlyReservationSummary(
            reservationSummaryService.getMonthlyReservationsSummariesById(monthlyReservationsSummaryId)
        ));
    }

    @Override
    public ResponseEntity<MonthlyReservationsSummariesPage> getMonthlyReservationsSummaries(
        Integer pageNo,
        Integer pageSize,
        Long sportsFacilityId,
        Integer month,
        String year,
        String sortBy
    ) {
        final var reservationsSummaryDataPage = reservationSummaryService
            .getMonthlyReservationsSummaries(
                pageNo,
                pageSize,
                sportsFacilityId,
                month,
                year,
                sortBy
            );
        return ResponseEntity.ok(monthlyReservationsSummaryApiMapper.mapToMonthlyReservationsSummary(
            reservationsSummaryDataPage
        ));
    }
}
