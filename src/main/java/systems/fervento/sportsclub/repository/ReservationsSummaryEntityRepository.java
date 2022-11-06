package systems.fervento.sportsclub.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import systems.fervento.sportsclub.entity.ReservationsSummaryEntity;

@Repository
public interface ReservationsSummaryEntityRepository extends JpaRepository<ReservationsSummaryEntity, Long> {
}
