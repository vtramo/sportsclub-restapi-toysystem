package systems.fervento.sportsclub.mapper;

import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;
import systems.fervento.sportsclub.data.ReservationData;
import systems.fervento.sportsclub.openapi.model.ReservationStateEnum;
import systems.fervento.sportsclub.openapi.model.ReservationStatus;

@Mapper
public interface ReservationStatusApiMapper {
    ReservationStatusApiMapper INSTANCE = Mappers.getMapper(ReservationStatusApiMapper.class);

    @AfterMapping
    default void setReservationState(@MappingTarget ReservationStatus reservationStatus, ReservationData reservationData) {
        reservationStatus.setState(ReservationStateEnum.valueOf(reservationData.getState()));
    }

    @Mapping(target = "reservationId", source = "id")
    @Mapping(target = "state", ignore = true)
    ReservationStatus mapToReservationStatus(ReservationData reservationData);
}
