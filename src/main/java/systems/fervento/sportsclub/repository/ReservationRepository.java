package systems.fervento.sportsclub.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import systems.fervento.sportsclub.entity.ReservationEntity;
import systems.fervento.sportsclub.entity.ReservationStatus;

import java.time.ZonedDateTime;

@Repository
public interface ReservationRepository extends JpaRepository<ReservationEntity, Long> {

    @Query(
        "select r from ReservationEntity r " +
        "where " +
        "(:state            is null or :state               = r.reservationStatus)               and " +
        "(:sport            is null or :sport               = r.sportsField.sport)               and " +
        "(:createdAt        is null or :createdAt           = r.createdAt)                       and " +
        "(:startDate        is null or :startDate           <= r.dateTimeRange.startDateTime)    and " +
        "(:endDate          is null or :endDate             >= r.dateTimeRange.endDateTime)      and " +
        "(:price            is null or :price               = r.price)                           and " +
        "(:sportsFieldId    is null or :sportsFieldId       = r.sportsField.id)                  and " +
        "(:sportsFacilityId is null or :sportsFacilityId    = r.sportsField.sportsFacility.id)"
    )
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
}
