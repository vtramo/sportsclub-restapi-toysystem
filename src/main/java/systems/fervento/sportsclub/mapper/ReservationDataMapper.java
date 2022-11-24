package systems.fervento.sportsclub.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import systems.fervento.sportsclub.data.ReservationData;
import systems.fervento.sportsclub.entity.ReservationEntity;

@Mapper(componentModel = "spring")
public interface ReservationDataMapper {
    @Mapping(target = "state", expression = "java(reservationEntity.getReservationStatus().toString())")
    @Mapping(target = "sportsFieldId", source = "sportsField.id")
    @Mapping(target = "ownerId", source = "owner.id")
    @Mapping(target = "endDateTime", source = "dateTimeRange.endDateTime")
    @Mapping(target = "startDateTime", source = "dateTimeRange.startDateTime")
    ReservationData mapToReservationData(ReservationEntity reservationEntity);
}
