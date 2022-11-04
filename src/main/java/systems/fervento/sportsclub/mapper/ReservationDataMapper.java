package systems.fervento.sportsclub.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;
import systems.fervento.sportsclub.data.ReservationData;
import systems.fervento.sportsclub.entity.ReservationEntity;

@Mapper
public interface ReservationDataMapper {
    ReservationDataMapper INSTANCE = Mappers.getMapper(ReservationDataMapper.class);

    @Mapping(target = "state", expression = "java(reservationEntity.getReservationStatus().toString())")
    @Mapping(target = "sportsFieldId", source = "sportsField.id")
    @Mapping(target = "ownerId", source = "owner.id")
    @Mapping(target = "endDateTime", source = "dateTimeRange.endDateTime")
    @Mapping(target = "startDateTime", source = "dateTimeRange.startDateTime")
    ReservationData mapToReservationData(ReservationEntity reservationEntity);
}
