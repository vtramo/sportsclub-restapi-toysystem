package systems.fervento.sportsclub.mapper;

import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;
import systems.fervento.sportsclub.data.ReservationData;
import systems.fervento.sportsclub.openapi.model.DateRange;
import systems.fervento.sportsclub.openapi.model.Reservation;

@Mapper
public interface ReservationApiMapper {
    ReservationApiMapper INSTANCE = Mappers.getMapper(ReservationApiMapper.class);

    @AfterMapping
    default void mapDateRange(@MappingTarget Reservation reservation, ReservationData reservationData) {
        final var dateRange = new DateRange();
        dateRange.setStartDate(reservationData.getStartDateTime());
        dateRange.setEndDate(reservationData.getEndDateTime());
    }

    @Mapping(target = "dateRange", ignore = true)
    Reservation mapToReservationApi(ReservationData reservationData);
}
