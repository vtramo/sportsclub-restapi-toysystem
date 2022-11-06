package systems.fervento.sportsclub.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import systems.fervento.sportsclub.entity.ReservationEntity;
import systems.fervento.sportsclub.entity.ReservationStatus;
import systems.fervento.sportsclub.entity.SportsFacilityReservationReportProjection;
import systems.fervento.sportsclub.entity.SportsReservationReportProjection;

import java.time.ZonedDateTime;
import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<ReservationEntity, Long> {

    Page<ReservationEntity> findAll(
        Pageable pageable,
        ReservationStatus state,
        Float price,
        String sport,
        ZonedDateTime createdAt,
        ZonedDateTime startDate,
        ZonedDateTime endDate,
        Long sportsFieldId,
        Long sportsFacilityId
    );

    @Modifying
    @Query("update ReservationEntity r set r.reservationStatus = :state where r.id = :reservationId")
    ReservationEntity updateState(long reservationId, ReservationStatus state);

    List<SportsReservationReportProjection> generateSportsReservationsReportForSportsFacility(
        long sportsFacilityId,
        ZonedDateTime startDate,
        ZonedDateTime endDate
    );

    List<SportsReservationReportProjection> generateSportsFieldReservationsReportForSportsField(
        long sportsFieldId,
        ZonedDateTime startDate,
        ZonedDateTime endDate
    );

    List<SportsFacilityReservationReportProjection> generateSportsReservationsReportForAllSportsFacility(
        ZonedDateTime startDate,
        ZonedDateTime endDate
    );
}
