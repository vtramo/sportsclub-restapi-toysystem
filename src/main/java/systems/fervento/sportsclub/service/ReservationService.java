package systems.fervento.sportsclub.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import systems.fervento.sportsclub.data.ReservationData;
import systems.fervento.sportsclub.entity.*;
import systems.fervento.sportsclub.exception.ResourceNotFoundException;
import systems.fervento.sportsclub.mapper.ReservationDataMapper;
import systems.fervento.sportsclub.repository.ReservationRepository;
import systems.fervento.sportsclub.repository.SportsFieldRepository;
import systems.fervento.sportsclub.repository.UserRepository;

import java.time.ZonedDateTime;
import java.util.Objects;
import java.util.Optional;

@Service
public class ReservationService {
    private final ReservationRepository reservationRepository;
    private final UserRepository userRepository;
    private final SportsFieldRepository sportsFieldRepository;
    private final ReservationDataMapper reservationDataMapper = ReservationDataMapper.INSTANCE;
    private final ReservationPriceCalculatorService reservationPriceCalculatorService;

    public ReservationService(
        ReservationRepository reservationRepository,
        UserRepository userService,
        SportsFieldRepository sportsFieldService,
        ReservationPriceCalculatorService reservationPriceCalculatorService
    ) {
        this.reservationRepository = reservationRepository;
        this.userRepository = userService;
        this.sportsFieldRepository = sportsFieldService;
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

    public ReservationData updateReservationStatus(final long reservationId, final String status) {
        Objects.requireNonNull(status);
        if (!reservationRepository.existsById(reservationId)) {
            throw new ResourceNotFoundException("A reservation with this id doesn't exists");
        }

        return reservationDataMapper.mapToReservationData(
            reservationRepository.updateState(
                reservationId,
                ReservationStatus.valueOf(status)
            )
        );
    }
}
