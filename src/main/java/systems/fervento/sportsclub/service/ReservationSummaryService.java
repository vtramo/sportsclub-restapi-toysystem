package systems.fervento.sportsclub.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import systems.fervento.sportsclub.data.ReservationsSummaryData;
import systems.fervento.sportsclub.data.SportsFieldReservationsSummaryData;
import systems.fervento.sportsclub.data.SportsReservationReportData;
import systems.fervento.sportsclub.entity.*;
import systems.fervento.sportsclub.exception.PreconditionViolationException;
import systems.fervento.sportsclub.exception.ResourceNotFoundException;
import systems.fervento.sportsclub.mapper.ReservationSummaryDataMapper;
import systems.fervento.sportsclub.mapper.SportsReservationReportDataMapper;
import systems.fervento.sportsclub.mapper.SportsReservationReportEntityMapper;
import systems.fervento.sportsclub.repository.ReservationRepository;
import systems.fervento.sportsclub.repository.ReservationsSummaryEntityRepository;
import systems.fervento.sportsclub.repository.SportsFacilityRepository;
import systems.fervento.sportsclub.repository.SportsFieldRepository;

import java.time.ZonedDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import static java.util.stream.Collectors.groupingBy;
import static java.util.stream.Collectors.toList;

@Service
public class ReservationSummaryService {
    private final SportsFacilityRepository sportsFacilityRepository;
    private final SportsFieldRepository sportsFieldRepository;
    private final SportsReservationReportDataMapper sportsReservationReportDataMapper;
    private final SportsReservationReportEntityMapper sportsReservationReportEntityMapper;

    private final ReservationSummaryDataMapper reservationSummaryDataMapper;

    private final ReservationRepository reservationRepository;
    private final ReservationsSummaryEntityRepository reservationsSummaryEntityRepository;

    public ReservationSummaryService(
        SportsFacilityRepository sportsFacilityRepository,
        SportsFieldRepository sportsFieldRepository,
        SportsReservationReportDataMapper sportsReservationReportDataMapper,
        SportsReservationReportEntityMapper sportsReservationReportEntityMapper,
        ReservationSummaryDataMapper reservationSummaryDataMapper,
        ReservationRepository reservationRepository,
        ReservationsSummaryEntityRepository reservationsSummaryEntityRepository
    ) {
        this.sportsFacilityRepository = sportsFacilityRepository;
        this.sportsFieldRepository = sportsFieldRepository;
        this.sportsReservationReportDataMapper = sportsReservationReportDataMapper;
        this.sportsReservationReportEntityMapper = sportsReservationReportEntityMapper;
        this.reservationSummaryDataMapper = reservationSummaryDataMapper;
        this.reservationRepository = reservationRepository;
        this.reservationsSummaryEntityRepository = reservationsSummaryEntityRepository;
    }

    public ReservationsSummaryData generateReservationsSummaryForSportsFacility(
        final String sortBy,
        final ZonedDateTime startDateTime,
        final ZonedDateTime endDateTime,
        final long sportsFacilityId
    ) {
        Objects.requireNonNull(sortBy);
        checkRangeDateTime(startDateTime, endDateTime);

        final SportsFacilityEntity sportsFacilityEntity = sportsFacilityRepository
            .findById(sportsFacilityId)
            .orElseThrow(() -> new ResourceNotFoundException("There are no sports facility with this ID!"));

        final var sortingInfo = sortBy.split("\\.");
        final var sortProperty = sortingInfo[0];
        final var sortDirection = sortingInfo[1];

        final List<SportsReservationReportProjection> reservationReportsBySport =
            reservationRepository.generateSportsReservationsReportForSportsFacility(
                sportsFacilityId,
                startDateTime,
                endDateTime
            );

        var byProperty =
            SportsReservationReportProjection.Comparators.propertyToComparator.getOrDefault(sortProperty,
                Comparator.comparingDouble(SportsReservationReportProjection::getTotalRevenue)
            );
        byProperty = (sortDirection.equals("desc")) ? byProperty.reversed() : byProperty;

        final List<SportsReservationReportData> reservationReportsDataBySport =
            reservationReportsBySport
                .stream()
                .sorted(byProperty)
                .map(sportsReservationReportDataMapper::mapToSportsReservationReportData)
                .collect(toList());

        final ReservationsSummaryData reservationsSummaryData = new ReservationsSummaryData();
        reservationsSummaryData.setReservationReportDataList(reservationReportsDataBySport);
        reservationsSummaryData.setCreatedAt(ZonedDateTime.now());
        reservationsSummaryData.setDescription("Reservations summary of the " + sportsFacilityEntity.getName() + " sports facility.");
        reservationsSummaryData.setSportsFacilityName(sportsFacilityEntity.getName());
        reservationsSummaryData.setSportsFacilityId(sportsFacilityId);
        return reservationsSummaryData;
    }

    public SportsFieldReservationsSummaryData generateReservationsSummaryForSportsField(
        final String sortBy,
        final ZonedDateTime startDateTime,
        final ZonedDateTime endDateTime,
        final long sportsFieldId
    ) {
        Objects.requireNonNull(sortBy);
        checkRangeDateTime(startDateTime, endDateTime);

        final SportsFieldEntity sportsFieldEntity = sportsFieldRepository
            .findById(sportsFieldId)
            .orElseThrow(() -> new ResourceNotFoundException("There are no sports facility with this ID!"));
        final SportsFacilityEntity sportsFacilityEntity = sportsFieldEntity.getSportsFacility();

        final var sortingInfo = sortBy.split("\\.");
        final var sortProperty = sortingInfo[0];
        final var sortDirection = sortingInfo[1];

        final List<SportsReservationReportProjection> sportsFieldReservationReportsBySport =
            reservationRepository.generateSportsFieldReservationsReportForSportsField(
                sportsFieldId,
                startDateTime,
                endDateTime
            );

        var byProperty =
                SportsReservationReportProjection.Comparators.propertyToComparator.get(sortProperty);
        byProperty = (sortDirection.equals("desc")) ? byProperty.reversed() : byProperty;

        final List<SportsReservationReportData> reservationReportsDataBySport =
            sportsFieldReservationReportsBySport
                .stream()
                .sorted(byProperty)
                .map(sportsReservationReportDataMapper::mapToSportsReservationReportData)
                .collect(toList());

        final SportsFieldReservationsSummaryData sportsFieldReservationsSummaryData = new SportsFieldReservationsSummaryData();
        sportsFieldReservationsSummaryData.setReservationReportDataList(reservationReportsDataBySport);
        sportsFieldReservationsSummaryData.setCreatedAt(ZonedDateTime.now());
        sportsFieldReservationsSummaryData.setDescription("Reservations summary of the " + sportsFieldEntity.getName() + " sports field.");
        sportsFieldReservationsSummaryData.setSportsFacilityName(sportsFacilityEntity.getName());
        sportsFieldReservationsSummaryData.setSportsFacilityId(sportsFacilityEntity.getId());
        sportsFieldReservationsSummaryData.setSportsFieldId(sportsFieldId);
        sportsFieldReservationsSummaryData.setSportsFieldName(sportsFieldEntity.getName());
        return sportsFieldReservationsSummaryData;
    }

    public List<ReservationsSummaryEntity> generateAndSaveReservationsSummaryForAllSportsFacilities(
        final ZonedDateTime startDateTime,
        final ZonedDateTime endDateTime
    ) {
        checkRangeDateTime(startDateTime, endDateTime);

        final List<SportsFacilityReservationReportProjection> sportsFacilityReservationReportsBySport =
            reservationRepository.generateSportsReservationsReportForAllSportsFacility(
                startDateTime,
                endDateTime
            );

        final Map<Long, List<SportsFacilityReservationReportProjection>> reportsGroupedBySportsFacilityId =
            sportsFacilityReservationReportsBySport.stream()
                .collect(groupingBy(SportsFacilityReservationReportProjection::getSportsFacilityId));

        final List<ReservationsSummaryEntity> reservationsSummaryEntities =
            reportsGroupedBySportsFacilityId.entrySet()
                .stream()
                .map(entry -> convertToReservationsSummaryEntity(entry.getKey(), entry.getValue(), startDateTime, endDateTime))
                .collect(toList());

        return reservationsSummaryEntityRepository.saveAll(reservationsSummaryEntities);
    }

    private ReservationsSummaryEntity convertToReservationsSummaryEntity(
        final long sportsFacilityId,
        final List<SportsFacilityReservationReportProjection> sportsFacilityReservationReportProjections,
        final ZonedDateTime startDateTime,
        final ZonedDateTime endDateTime
    ) {
        Objects.requireNonNull(sportsFacilityReservationReportProjections);
        checkRangeDateTime(startDateTime, endDateTime);

        final List<SportsReservationReportEntity> sportsReservationReportEntities =
            sportsFacilityReservationReportProjections.stream()
                .map(sportsReservationReportEntityMapper::mapToSportsReservationEntityMapper)
                .collect(toList());

        final SportsFacilityEntity sportsFacilityEntity = sportsFacilityRepository
            .findById(sportsFacilityId)
            .orElseThrow(() -> new ResourceNotFoundException("There are no sports facility with this ID!"));

        final ReservationsSummaryEntity reservationsSummaryEntity = new ReservationsSummaryEntity();
        reservationsSummaryEntity.addAllSportsReservationReport(sportsReservationReportEntities);
        reservationsSummaryEntity.setSportsFacility(sportsFacilityEntity);
        reservationsSummaryEntity.setDateTimeRange(new DateTimeRange(startDateTime, endDateTime));
        reservationsSummaryEntity.setDescription("Reservations summary of the " + sportsFacilityEntity.getName() + " sports facility.");

        return reservationsSummaryEntity;
    }

    public Page<ReservationsSummaryData> getMonthlyReservationsSummaries(
        final int pageNo,
        final int pageSize,
        final Long sportsFacilityId,
        final Integer month,
        final String year,
        final String sortBy
    ) {
        final var sortingInfo = sortBy.split("\\.");
        final var sortProperty = sortingInfo[0];
        final var sortDirection = sortingInfo[1].equals("desc")
            ? Sort.Direction.DESC
            : Sort.Direction.ASC;

        final Sort sort = sortProperty.equals("year_month")
            ? Sort.by(sortDirection,"year", "month")
            : Sort.by(sortDirection, sortProperty);

        final Pageable pageable = PageRequest.of(pageNo, pageSize, sort);

        return reservationsSummaryEntityRepository
            .getReservationsSummaries(
                pageable,
                sportsFacilityId,
                month,
                year
            ).map(reservationSummaryDataMapper::mapToReservationsSummaryData);
    }

    public ReservationsSummaryData getMonthlyReservationsSummariesById(
        final long monthlyReservationSummaryId
    ) {
        return reservationsSummaryEntityRepository
            .findById(monthlyReservationSummaryId)
            .map(reservationSummaryDataMapper::mapToReservationsSummaryData)
            .orElseThrow(() -> new ResourceNotFoundException("There are no reservations summary with this ID!"));
    }

    private void checkRangeDateTime(
        final ZonedDateTime startDateTime,
        final ZonedDateTime endDateTime
    ) {
        Objects.requireNonNull(startDateTime);
        Objects.requireNonNull(endDateTime);
        if (startDateTime.isAfter(endDateTime) || startDateTime.isEqual(endDateTime)) {
            throw new PreconditionViolationException("The starting date must be less than the ending date!");
        }
    }
}
