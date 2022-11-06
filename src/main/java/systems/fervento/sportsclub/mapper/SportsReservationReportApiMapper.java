package systems.fervento.sportsclub.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;
import systems.fervento.sportsclub.data.SportsReservationReportData;
import systems.fervento.sportsclub.openapi.model.SportsReservationReport;

@Mapper
public interface SportsReservationReportApiMapper {
    SportsReservationReportApiMapper INSTANCE = Mappers.getMapper(SportsReservationReportApiMapper.class);

    SportsReservationReport mapToSportsReservationReport(SportsReservationReportData sportsReservationReportData);
}
