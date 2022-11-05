package systems.fervento.sportsclub.controller;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import systems.fervento.sportsclub.data.ReservationData;
import systems.fervento.sportsclub.mapper.ReservationApiMapper;
import systems.fervento.sportsclub.openapi.api.ReservationsApi;
import systems.fervento.sportsclub.openapi.model.ReservationPage;
import systems.fervento.sportsclub.openapi.model.ReservationStateEnum;
import systems.fervento.sportsclub.openapi.model.SportEnum;
import systems.fervento.sportsclub.service.ReservationService;

import java.time.ZonedDateTime;
import java.util.Optional;

@RestController
public class ReservationController implements ReservationsApi {
    private final ReservationService reservationService;
    private final ReservationApiMapper reservationApiMapper = ReservationApiMapper.INSTANCE;

    public ReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    @Override
    public ResponseEntity<ReservationPage> getReservations(
        Integer pageNo,
        Integer pageSize,
        ReservationStateEnum filterByState,
        SportEnum filterBySport,
        String sortBy,
        Float filterByPrice,
        ZonedDateTime filterByDate,
        ZonedDateTime filterByStartDate,
        ZonedDateTime filterByEndDate,
        Long filterBySportsFieldId,
        Long filterBySportsFacilityId
    ) {
        final Page<ReservationData> reservationDataPage =
            reservationService.getAllReservations(
                pageNo,
                pageSize,
                Optional.ofNullable(sortBy),
                filterByState.toString(),
                filterBySport.toString(),
                filterByPrice,
                filterByDate,
                filterByStartDate,
                filterByEndDate,
                filterBySportsFieldId,
                filterBySportsFacilityId
            );

        return ResponseEntity.ok(
            reservationApiMapper
                .mapToReservationPage(reservationDataPage)
        );
    }
}