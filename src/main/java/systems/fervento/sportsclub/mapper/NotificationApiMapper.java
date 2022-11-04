package systems.fervento.sportsclub.mapper;

import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;
import org.springframework.data.domain.Page;
import systems.fervento.sportsclub.data.NotificationData;
import systems.fervento.sportsclub.openapi.model.Notification;
import systems.fervento.sportsclub.openapi.model.NotificationPage;

import static java.util.stream.Collectors.toList;

@Mapper
public interface NotificationApiMapper {
    NotificationApiMapper INSTANCE = Mappers.getMapper(NotificationApiMapper.class);

    default NotificationPage mapToNotificationPage(Page<NotificationData> notificationDataPage) {
        return mapToNotificationPage(1, notificationDataPage);
    }

    @Mapping(target = "ownerId", source = "owner.id")
    @Mapping(target = "createdAt", expression = "java(notificationData.getCreatedOn().toString())")
    Notification mapToNotificationApi(NotificationData notificationData);

    @Mapping(target = "pageNo", expression = "java(notificationDataPage.getNumber())")
    @Mapping(target = "pageSize", expression = "java(notificationDataPage.getSize())")
    @Mapping(target = "totalPages", expression = "java(notificationDataPage.getTotalPages())")
    @Mapping(target = "totalElements", expression = "java(notificationDataPage.getTotalElements())")
    @Mapping(target = "last", expression = "java(notificationDataPage.isLast())")
    @Mapping(target = "notifications", ignore = true)
    @DoIgnore
    NotificationPage mapToNotificationPage(Integer dummy, Page<NotificationData> notificationDataPage);

    @AfterMapping
    default void setPageContentToNotificationPage(
        @MappingTarget NotificationPage notificationPage,
        Page<NotificationData> notificationDataPage
    ) {
        notificationPage.setNotifications(notificationDataPage
            .stream()
            .map(this::mapToNotificationApi)
            .collect(toList())
        );
    }
}
