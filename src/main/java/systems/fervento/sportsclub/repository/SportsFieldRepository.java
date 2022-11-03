package systems.fervento.sportsclub.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import systems.fervento.sportsclub.entity.SportsFieldEntity;

import java.util.List;

@Repository
public interface SportsFieldRepository extends JpaRepository<SportsFieldEntity, Long> {
    @Query("select s from SportsFieldEntity s where s.sport = ?1")
    List<SportsFieldEntity> getSportsFieldEntitiesBySport(String sport);

    @Query("select avg(r.rating.stars) from ReservationEntity r where r.sportsField.id = ?1 and r.rating.stars <> 0")
    float getSportsFieldAverageRating(Long sportsFieldId);
}
