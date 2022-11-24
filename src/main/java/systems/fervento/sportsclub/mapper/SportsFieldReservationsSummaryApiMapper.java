package systems.fervento.sportsclub.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import systems.fervento.sportsclub.data.SportsFieldReservationsSummaryData;
import systems.fervento.sportsclub.openapi.model.SportsFieldReservationsSummary;

@Mapper(componentModel = "spring", uses = SportsReservationReportApiMapper.class)
public interface SportsFieldReservationsSummaryApiMapper {
    @Mapping(target = "startDate", source = "startDateTime")
    @Mapping(target = "endDate", source = "endDateTime")
    @Mapping(target = "sportsReservationReports", source = "reservationReportDataList")
    SportsFieldReservationsSummary mapToSportsFieldReservationsSummary(
        SportsFieldReservationsSummaryData sportsFieldReservationsSummaryData
    );
}
