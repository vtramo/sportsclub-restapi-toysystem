package systems.fervento.sportsclub.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import systems.fervento.sportsclub.entity.ReservationsSummaryEntity;

@Repository
public interface ReservationsSummaryEntityRepository extends JpaRepository<ReservationsSummaryEntity, Long> {

    Page<ReservationsSummaryEntity> getReservationsSummaries(
        Pageable pageable,
        Long sportsFacilityId,
        Integer month,
        String year
    );
}
