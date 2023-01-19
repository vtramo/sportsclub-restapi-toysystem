package systems.fervento.sportsclub.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;
import systems.fervento.sportsclub.entity.ReservationRatingEntity;

@Transactional(readOnly = true)
public interface ReservationRatingRepository extends JpaRepository<ReservationRatingEntity, Long> {

}
