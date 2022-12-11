package systems.fervento.sportsclub.service;

import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import systems.fervento.sportsclub.data.ReservationData;
import systems.fervento.sportsclub.data.ReservationRatingData;
import systems.fervento.sportsclub.entity.*;
import systems.fervento.sportsclub.exception.ResourceNotFoundException;
import systems.fervento.sportsclub.mapper.ReservationDataMapper;
import systems.fervento.sportsclub.mapper.ReservationRatingDataMapper;
import systems.fervento.sportsclub.repository.ReservationRatingRepository;
import systems.fervento.sportsclub.repository.ReservationRepository;
import systems.fervento.sportsclub.repository.SportsFieldRepository;
import systems.fervento.sportsclub.repository.UserRepository;

import java.time.ZonedDateTime;
import java.util.Objects;
import java.util.Optional;

@Service
public class ReservationService {
    private final ReservationRepository reservationRepository;
    private final ReservationRatingRepository reservationRatingRepository;
    private final UserRepository userRepository;
    private final SportsFieldRepository sportsFieldRepository;
    private final ReservationDataMapper reservationDataMapper;
    private final ReservationRatingDataMapper reservationRatingDataMapper;
    private final ReservationPriceCalculatorService reservationPriceCalculatorService;

    public ReservationService(
        ReservationRepository reservationRepository,
        ReservationRatingRepository reservationRatingRepository,
        UserRepository userService,
        SportsFieldRepository sportsFieldService,
        ReservationDataMapper reservationDataMapper,
        ReservationRatingDataMapper reservationRatingDataMapper,
        ReservationPriceCalculatorService reservationPriceCalculatorService
    ) {
        this.reservationRepository = reservationRepository;
        this.reservationRatingRepository = reservationRatingRepository;
        this.userRepository = userService;
        this.sportsFieldRepository = sportsFieldService;
        this.reservationDataMapper = reservationDataMapper;
        this.reservationRatingDataMapper = reservationRatingDataMapper;
        this.reservationPriceCalculatorService = reservationPriceCalculatorService;
    }

    public Page<ReservationData> getAllReservations(
        final int pageNo,
        final int pageSize,
        final Optional<String> optionalSortBy,
        final String state,
        final String sport,
        final Float price,
        final ZonedDateTime createdAt,
        final ZonedDateTime startDateTime,
        final ZonedDateTime endDateTime,
        final Long sportsFieldId,
        final Long sportsFacilityId
    ) {
        Sort sort = Sort.by(Sort.Direction.DESC, "createdAt");

        if (optionalSortBy.isPresent()) {
            final var sortingInfo = optionalSortBy.get().split("\\."); // example value: createdAt.asc
            final var sortingProperty = sortingInfo[0];
            final var sortDirection = Objects.equals(sortingInfo[1], "asc")
                ? Sort.Direction.DESC
                : Sort.Direction.ASC;
            sort = Sort.by(sortDirection, sortingProperty);
        }

        final var pageRequest = PageRequest.of(pageNo, pageSize, sort);

        return reservationRepository.findAll(
            pageRequest,
            state == null ? null : ReservationStatus.valueOf(state),
            price,
            sport,
            createdAt,
            startDateTime,
            endDateTime,
            sportsFieldId,
            sportsFacilityId
        ).map(reservationDataMapper::mapToReservationData);
    }

    public ReservationData requestReservation(final ReservationData reservationData) {
        Objects.requireNonNull(reservationData);

        final Long sportsFieldId = reservationData.getSportsFieldId();
        final Long ownerId = reservationData.getOwnerId();
        final ZonedDateTime startDateTime = reservationData.getStartDateTime();
        final ZonedDateTime endDateTime   = reservationData.getEndDateTime();

        final SportsFieldEntity sportsFieldEntity = sportsFieldRepository
            .findById(sportsFieldId)
            .orElseThrow(() -> new ResourceNotFoundException("There are no sports field with this ID!"));
        final UserEntity userEntity = userRepository
            .findById(ownerId)
            .orElseThrow(() -> new ResourceNotFoundException("There are no user with this ID!"));

        final var priceReservation = reservationPriceCalculatorService
            .calculatePrice(startDateTime, endDateTime, sportsFieldEntity);

        final var reservationEntity = new ReservationEntity();
        reservationEntity.setPrice(priceReservation);
        reservationEntity.setDateTimeRange(new DateTimeRange(startDateTime, endDateTime));
        reservationEntity.setSportsField(sportsFieldEntity);
        reservationEntity.setOwner(userEntity);
        reservationRepository.save(reservationEntity);

        return reservationDataMapper.mapToReservationData(reservationEntity);
    }

    public ReservationData getReservationById(final long reservationId) {
        return reservationRepository
            .findById(reservationId)
            .map(reservationDataMapper::mapToReservationData)
            .orElseThrow(() -> new ResourceNotFoundException("A reservation with this ID doesn't exist!"));
    }

    @Transactional
    public ReservationData updateReservationStatus(final long reservationId, final String status) {
        Objects.requireNonNull(status);
        if (!reservationRepository.existsById(reservationId)) {
            throw new ResourceNotFoundException("A reservation with this id doesn't exists");
        }

        reservationRepository.updateState(
            reservationId,
            ReservationStatus.valueOf(status.toUpperCase())
        );

        return reservationDataMapper.mapToReservationData(
          reservationRepository.findById(reservationId).orElseThrow()
        );
    }

    public ReservationRatingData getReservationRatingByReservationId(final long reservationId) {
        if (!reservationRepository.existsById(reservationId)) {
            throw new ResourceNotFoundException("A reservation with this ID doesn't exist!");
        }

        return reservationRatingRepository
            .findById(reservationId)
            .map(reservationRatingDataMapper::mapToReservationRatingData)
            .orElseThrow(() -> new ResourceNotFoundException("No evaluation has been made for this reservation."));
    }

    public ReservationRatingData evaluateReservation(
        final long reservationId,
        final ReservationRatingData reservationRatingData
    ) {
        final ReservationEntity reservationEntity = reservationRepository
            .findById(reservationId)
            .orElseThrow(() -> new ResourceNotFoundException("A reservation with this ID doesn't exist!"));

        final ReservationRatingEntity reservationRatingEntity = new ReservationRatingEntity();
        reservationRatingEntity.setScore(reservationRatingData.getScore());
        reservationRatingEntity.setDescription(reservationRatingData.getDescription());

        reservationEntity.setRating(reservationRatingEntity);
        reservationRepository.save(reservationEntity);

        return reservationRatingDataMapper.mapToReservationRatingData(reservationRatingEntity);
    }
}
