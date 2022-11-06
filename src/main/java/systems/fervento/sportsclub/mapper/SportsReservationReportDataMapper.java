package systems.fervento.sportsclub.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;
import systems.fervento.sportsclub.data.SportsReservationReportData;
import systems.fervento.sportsclub.entity.SportsReservationReportProjection;

@Mapper
public interface SportsReservationReportDataMapper {
    SportsReservationReportDataMapper INSTANCE = Mappers.getMapper(SportsReservationReportDataMapper.class);

    SportsReservationReportData mapToSportsReservationReportData(
        SportsReservationReportProjection sportsReservationReportProjection
    );
}
