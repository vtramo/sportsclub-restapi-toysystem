package systems.fervento.sportsclub.repository;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import systems.fervento.sportsclub.entity.SportsFieldEntity;

import java.util.List;

@Repository
public interface SportsFieldRepository extends JpaRepository<SportsFieldEntity, Long> {
    @Query(
        "select s " +
        "from SportsFieldEntity s " +
        "where (:sport is null or :sport = s.sport) and (:ownerId is null or :ownerId = s.sportsFacility.id)"
    )
    List<SportsFieldEntity> getSportsFields(
        Sort sort,
        String sport,
        Long ownerId
    );

    @Query("select coalesce(avg(r.rating.score), 0) from ReservationEntity r where r.sportsField.id = :sportsFieldId and r.rating is not null")
    float getSportsFieldAverageRating(Long sportsFieldId);
}
