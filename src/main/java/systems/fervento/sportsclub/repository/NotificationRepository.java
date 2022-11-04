package systems.fervento.sportsclub.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import systems.fervento.sportsclub.entity.NotificationEntity;

import java.util.stream.Stream;

@Repository
public interface NotificationRepository extends JpaRepository<NotificationEntity, Long> {
    Stream<NotificationEntity> findAllByOwnerId(Long ownerId);
    Stream<NotificationEntity> findAllByOwnerIdAndHasBeenRead(Long ownerId, boolean hasBeenRead);
}
