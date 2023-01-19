package systems.fervento.sportsclub.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import systems.fervento.sportsclub.entity.SportsFieldEntity;

@Repository
@Transactional(readOnly = true)
public interface SportsFieldRepository extends JpaRepository<SportsFieldEntity, Long> {
    @Query(
        "select s " +
        "from SportsFieldEntity s " +
        "where (:sport is null or :sport = s.sport) and (:ownerId is null or :ownerId = s.sportsFacility.id)"
    )
    Page<SportsFieldEntity> getSportsFields(
        Pageable pageable,
        String sport,
        Long ownerId
    );

    @Query("select coalesce(avg(r.rating.score), 0) from ReservationEntity r where r.sportsField.id = :sportsFieldId and r.rating is not null")
    float getSportsFieldAverageRating(Long sportsFieldId);

    SportsFieldEntity getFirstByOrderById();
}
