package systems.fervento.sportsclub.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;
import systems.fervento.sportsclub.entity.SportsFacilityReservationReportProjection;
import systems.fervento.sportsclub.entity.SportsReservationReportEntity;

@Mapper
public interface SportsReservationReportEntityMapper {
    SportsReservationReportEntityMapper INSTANCE = Mappers.getMapper(SportsReservationReportEntityMapper.class);

    @Mapping(target = "reservationsSummaryEntity", ignore = true)
    @Mapping(target = "id", ignore = true)
    SportsReservationReportEntity mapToSportsReservationEntityMapper(
        SportsFacilityReservationReportProjection sportsFacilityReservationReportProjection
    );
}
