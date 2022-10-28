package systems.fervento.sportsclub.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import systems.fervento.sportsclub.entity.SportsFacilityEntity;

@Repository
public interface SportsFacilityRepository extends JpaRepository<SportsFacilityEntity, Long> {

}
