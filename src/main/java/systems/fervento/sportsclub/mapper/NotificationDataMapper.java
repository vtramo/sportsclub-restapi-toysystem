package systems.fervento.sportsclub.mapper;

import org.mapstruct.Context;
import org.mapstruct.Mapper;
import systems.fervento.sportsclub.data.NotificationData;
import systems.fervento.sportsclub.entity.NotificationEntity;

@Mapper(componentModel = "spring", uses = {BillingDetailsDataMapper.class, SportsFieldDataMapper.class, AddressDataMapper.class})
public interface NotificationDataMapper {
    @DoIgnore
    default NotificationData mapToNotificationData(NotificationEntity notificationEntity) {
        return mapToNotificationData(notificationEntity, new CycleAvoidingMappingContext());
    }

    NotificationData mapToNotificationData(
        NotificationEntity notificationEntity,
        @Context CycleAvoidingMappingContext cycleAvoidingMappingContext
    );
}
