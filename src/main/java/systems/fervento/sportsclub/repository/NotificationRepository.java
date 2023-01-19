package systems.fervento.sportsclub.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import systems.fervento.sportsclub.entity.NotificationEntity;

@Repository
@Transactional(readOnly = true)
public interface NotificationRepository extends JpaRepository<NotificationEntity, Long> {
    Page<NotificationEntity> findAllByOwnerId(Pageable pageable, Long ownerId);
    Page<NotificationEntity> findAllByOwnerIdAndHasBeenRead(Pageable pageable, Long ownerId, boolean hasBeenRead);
}
