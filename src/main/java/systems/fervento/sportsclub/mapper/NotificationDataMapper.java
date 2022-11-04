package systems.fervento.sportsclub.mapper;

import org.mapstruct.Context;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;
import systems.fervento.sportsclub.data.NotificationData;
import systems.fervento.sportsclub.entity.NotificationEntity;

@Mapper(uses = {BillingDetailsDataMapper.class, SportsFieldDataMapper.class, AddressDataMapper.class})
public interface NotificationDataMapper {
    NotificationDataMapper INSTANCE = Mappers.getMapper(NotificationDataMapper.class);

    @DoIgnore
    default NotificationData mapToNotificationData(NotificationEntity notificationEntity) {
        return mapToNotificationData(notificationEntity, new CycleAvoidingMappingContext());
    }

    NotificationData mapToNotificationData(
        NotificationEntity notificationEntity,
        @Context CycleAvoidingMappingContext cycleAvoidingMappingContext
    );
}
