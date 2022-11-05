package systems.fervento.sportsclub.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import systems.fervento.sportsclub.entity.ReservationEntity;
import systems.fervento.sportsclub.entity.ReservationStatus;

import java.time.ZonedDateTime;

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
}
