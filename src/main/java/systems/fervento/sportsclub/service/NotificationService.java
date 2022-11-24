package systems.fervento.sportsclub.service;

import org.springframework.stereotype.Service;
import systems.fervento.sportsclub.data.NotificationData;
import systems.fervento.sportsclub.entity.NotificationEntity;
import systems.fervento.sportsclub.exception.ResourceNotFoundException;
import systems.fervento.sportsclub.mapper.NotificationDataMapper;
import systems.fervento.sportsclub.repository.NotificationRepository;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    private final NotificationDataMapper notificationDataMapper;

    public NotificationService(NotificationRepository notificationRepository, NotificationDataMapper notificationDataMapper) {
        this.notificationRepository = notificationRepository;
        this.notificationDataMapper = notificationDataMapper;
    }

    public NotificationData getNotificationById(final long notificationId) {
        return notificationRepository
            .findById(notificationId)
            .map(notificationDataMapper::mapToNotificationData)
            .orElseThrow(() -> new ResourceNotFoundException("A notification with this ID doesn't exist!"));
    }

    public NotificationData updateNotification(final NotificationData notificationData) {
        final NotificationEntity notificationEntity = notificationRepository
            .findById(notificationData.getId())
            .orElseThrow(() -> new ResourceNotFoundException("A notification with this ID doesn't exist!"));

        notificationEntity.setDescription(notificationData.getDescription());
        notificationEntity.setHasBeenRead(notificationData.isHasBeenRead());

        return notificationDataMapper.mapToNotificationData(
            notificationRepository.save(notificationEntity)
        );
    }
}
