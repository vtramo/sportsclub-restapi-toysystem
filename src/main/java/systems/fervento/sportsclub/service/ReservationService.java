package systems.fervento.sportsclub.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import systems.fervento.sportsclub.data.ReservationData;
import systems.fervento.sportsclub.entity.ReservationStatus;
import systems.fervento.sportsclub.mapper.ReservationDataMapper;
import systems.fervento.sportsclub.repository.ReservationRepository;

import java.time.ZonedDateTime;
import java.util.Objects;
import java.util.Optional;

@Service
public class ReservationService {
    private final ReservationRepository reservationRepository;
    private final ReservationDataMapper reservationDataMapper = ReservationDataMapper.INSTANCE;

    public ReservationService(ReservationRepository reservationRepository) {
        this.reservationRepository = reservationRepository;
    }

    public Page<ReservationData> getAllReservations(
        int pageNo,
        int pageSize,
        Optional<String> optionalSortBy,
        String state,
        String sport,
        Float price,
        ZonedDateTime createdAt,
        ZonedDateTime startDateTime,
        ZonedDateTime endDateTime,
        Long sportsFieldId,
        Long sportsFacilityId
    ) {
        Sort sort = Sort.by(Sort.Direction.DESC, "createdAt");

        if (optionalSortBy.isPresent()) {
            var sortingInfo = optionalSortBy.get().split("\\."); // example value: createdAt.asc
            var sortingProperty = sortingInfo[0];
            var sortDirection = Objects.equals(sortingInfo[1], "asc")
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
}
