package systems.fervento.sportsclub.controller;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import systems.fervento.sportsclub.data.ReservationData;
import systems.fervento.sportsclub.mapper.ReservationApiMapper;
import systems.fervento.sportsclub.mapper.ReservationRatingApiMapper;
import systems.fervento.sportsclub.mapper.ReservationStatusApiMapper;
import systems.fervento.sportsclub.openapi.api.ReservationsApi;
import systems.fervento.sportsclub.openapi.model.*;
import systems.fervento.sportsclub.service.ReservationService;

import java.time.ZonedDateTime;
import java.util.Optional;

@RestController
public class ReservationController implements ReservationsApi {
    private final ReservationService reservationService;
    private final ReservationApiMapper reservationApiMapper;
    private final ReservationStatusApiMapper reservationStatusApiMapper;
    private final ReservationRatingApiMapper reservationRatingApiMapper;

    public ReservationController(
        ReservationService reservationService,
        ReservationApiMapper reservationApiMapper,
        ReservationStatusApiMapper reservationStatusApiMapper,
        ReservationRatingApiMapper reservationRatingApiMapper
    ) {
        this.reservationService = reservationService;
        this.reservationApiMapper = reservationApiMapper;
        this.reservationStatusApiMapper = reservationStatusApiMapper;
        this.reservationRatingApiMapper = reservationRatingApiMapper;
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
    @Override
    public ResponseEntity<Reservation> requestReservation(Reservation reservation) {
        final var reservationData = reservationApiMapper.mapToReservationData(reservation);
        final var createdReservationData = reservationService.requestReservation(reservationData);
        return new ResponseEntity<>(
            reservationApiMapper.mapToReservationApi(createdReservationData),
            HttpStatus.CREATED
        );
    }
    @Override
    public ResponseEntity<Reservation> getReservationById(Long reservationId) {
        return ResponseEntity.ok(
            reservationApiMapper.mapToReservationApi(
                reservationService.getReservationById(reservationId)
            )
        );
    }
    @Override
    public ResponseEntity<ReservationStatus> updateReservationStatus(
        Long reservationId,
        ReservationStatus reservationStatus
    ) {
        return ResponseEntity.ok(
            reservationStatusApiMapper.mapToReservationStatus(
                reservationService.updateReservationStatus(
                    reservationId,
                    reservationStatus.toString()
                )
            )
        );
    }
    @Override
    public ResponseEntity<ReservationStatus> getReservationStatus(Long reservationId) {
        return ResponseEntity.ok(
            reservationStatusApiMapper.mapToReservationStatus(
                reservationService.getReservationById(reservationId)
            )
        );
    }

    @Override
    public ResponseEntity<ReservationRating> getReservationRating(Long reservationId) {
        final var reservationRatingData =
            reservationService.getReservationRatingByReservationId(reservationId);
        final var reservationRating =
            reservationRatingApiMapper.mapToReservationRatingApi(reservationRatingData);
        return ResponseEntity.ok(reservationRating);
    }

    @Override
    public ResponseEntity<ReservationRating> evaluateReservation(Long reservationId, ReservationRating reservationRating) {
        final var reservationRatingData =
            reservationRatingApiMapper.mapToReservationRatingData(reservationRating);
        final var createdReservationRatingData =
            reservationService.evaluateReservation(reservationId, reservationRatingData);
        return ResponseEntity.ok(
            reservationRatingApiMapper.mapToReservationRatingApi(createdReservationRatingData)
        );
    }
}