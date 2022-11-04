package systems.fervento.sportsclub.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;
import systems.fervento.sportsclub.data.NotificationData;
import systems.fervento.sportsclub.openapi.model.Notification;

@Mapper
public interface NotificationApiMapper {
    NotificationApiMapper INSTANCE = Mappers.getMapper(NotificationApiMapper.class);

    @Mapping(target = "ownerId", source = "owner.id")
    @Mapping(target = "createdAt", expression = "java(notificationData.getCreatedOn().toString())")
    Notification mapToNotificationApi(NotificationData notificationData);
}
