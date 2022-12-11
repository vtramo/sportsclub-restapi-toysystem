package systems.fervento.sportsclub.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import systems.fervento.sportsclub.entity.SportsFacilityEntity;

import java.util.List;


@Repository
public interface SportsFacilityRepository extends JpaRepository<SportsFacilityEntity, Long> {

    List<SportsFacilityEntity> findAllByTotalNumberSportsFieldsBetween(@Param("min") int min, @Param("max") int max);

    List<SportsFacilityEntity> findAllByOwnerIdAndTotalNumberSportsFieldsBetween(
        @Param("ownerId") long ownerId,
        @Param("min") int min,
        @Param("max") int max
    );
}
