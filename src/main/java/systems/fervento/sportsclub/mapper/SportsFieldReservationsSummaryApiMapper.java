package systems.fervento.sportsclub.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;
import systems.fervento.sportsclub.data.SportsFieldReservationsSummaryData;
import systems.fervento.sportsclub.openapi.model.SportsFieldReservationsSummary;

@Mapper(uses = SportsReservationReportApiMapper.class)
public interface SportsFieldReservationsSummaryApiMapper {
    SportsFieldReservationsSummaryApiMapper INSTANCE = Mappers.getMapper(SportsFieldReservationsSummaryApiMapper.class);

    @Mapping(target = "sportsReservationReports", source = "reservationReportDataList")
    SportsFieldReservationsSummary mapToSportsFieldReservationsSummary(
        SportsFieldReservationsSummaryData sportsFieldReservationsSummaryData
    );
}
