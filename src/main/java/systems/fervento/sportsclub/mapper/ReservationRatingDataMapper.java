package systems.fervento.sportsclub.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;
import systems.fervento.sportsclub.data.ReservationRatingData;
import systems.fervento.sportsclub.entity.ReservationRatingEntity;

@Mapper
public interface ReservationRatingDataMapper {
    ReservationRatingDataMapper INSTANCE = Mappers.getMapper(ReservationRatingDataMapper.class);

    @Mapping(target = "reservationId", source = "reservation.id")
    ReservationRatingData mapToReservationRatingData(ReservationRatingEntity reservationRatingEntity);
}
