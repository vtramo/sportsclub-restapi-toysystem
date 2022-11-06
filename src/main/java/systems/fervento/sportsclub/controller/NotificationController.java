package systems.fervento.sportsclub.controller;

import org.springframework.http.ResponseEntity;
import systems.fervento.sportsclub.mapper.NotificationApiMapper;
import systems.fervento.sportsclub.openapi.api.NotificationsApi;
import systems.fervento.sportsclub.openapi.model.Notification;
import systems.fervento.sportsclub.service.NotificationService;

public class NotificationController implements NotificationsApi {
    private final NotificationService notificationService;
    private final NotificationApiMapper notificationApiMapper = NotificationApiMapper.INSTANCE;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @Override
    public ResponseEntity<Notification> getNotificationById(Long notificationId) {
        return ResponseEntity.ok(
            notificationApiMapper.mapToNotificationApi(
                notificationService.getNotificationById(notificationId)
            )
        );
    }

    @Override
    public ResponseEntity<Notification> updateNotification(Notification notification) {
        final var notificationData = notificationApiMapper.mapToNotificationData(notification);
        final var createdNotificationData = notificationService.updateNotification(notificationData);
        return ResponseEntity.ok(notificationApiMapper.mapToNotificationApi(createdNotificationData));
    }
}
