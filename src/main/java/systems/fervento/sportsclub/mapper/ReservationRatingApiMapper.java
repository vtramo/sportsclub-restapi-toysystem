package systems.fervento.sportsclub.mapper;

import org.mapstruct.InheritInverseConfiguration;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;
import systems.fervento.sportsclub.data.ReservationRatingData;
import systems.fervento.sportsclub.openapi.model.ReservationRating;

@Mapper
public interface ReservationRatingApiMapper {
    ReservationRatingApiMapper INSTANCE = Mappers.getMapper(ReservationRatingApiMapper.class);

    @Mapping(target = "rating", source = "score")
    ReservationRating mapToReservationRatingApi(ReservationRatingData reservationRatingData);

    @InheritInverseConfiguration
    ReservationRatingData mapToReservationRatingData(ReservationRating reservationRating);
}
