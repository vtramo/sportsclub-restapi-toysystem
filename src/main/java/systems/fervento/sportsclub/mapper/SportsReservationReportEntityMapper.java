package systems.fervento.sportsclub.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import systems.fervento.sportsclub.entity.SportsFacilityReservationReportProjection;
import systems.fervento.sportsclub.entity.SportsReservationReportEntity;

@Mapper(componentModel = "spring")
public interface SportsReservationReportEntityMapper {
    @Mapping(target = "reservationsSummaryEntity", ignore = true)
    @Mapping(target = "id", ignore = true)
    SportsReservationReportEntity mapToSportsReservationEntityMapper(
        SportsFacilityReservationReportProjection sportsFacilityReservationReportProjection
    );
}
