package systems.fervento.sportsclub.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;
import systems.fervento.sportsclub.data.ReservationData;
import systems.fervento.sportsclub.openapi.model.ReservationStatus;

@Mapper
public interface ReservationStatusApiMapper {
    ReservationStatusApiMapper INSTANCE = Mappers.getMapper(ReservationStatusApiMapper.class);

    @Mapping(target = "reservationId", source = "id")
    @Mapping(target = "state", expression = "java(ReservationStateEnum.valueOf(reservationData.getState()))")
    ReservationStatus mapToReservationStatus(ReservationData reservationData);
}
