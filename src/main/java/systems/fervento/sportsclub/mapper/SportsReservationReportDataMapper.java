package systems.fervento.sportsclub.mapper;

import org.mapstruct.Mapper;
import systems.fervento.sportsclub.data.SportsReservationReportData;
import systems.fervento.sportsclub.entity.SportsReservationReportProjection;

@Mapper(componentModel = "spring")
public interface SportsReservationReportDataMapper {
    SportsReservationReportData mapToSportsReservationReportData(
        SportsReservationReportProjection sportsReservationReportProjection
    );
}
