package systems.fervento.sportsclub.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;
import systems.fervento.sportsclub.data.ReservationsSummaryData;
import systems.fervento.sportsclub.openapi.model.ReservationsSummary;

@Mapper(componentModel = "spring", uses = SportsReservationReportApiMapper.class)
public interface ReservationSummaryApiMapper {
    @Mapping(target = "startDate", source = "startDateTime")
    @Mapping(target = "endDate", source = "endDateTime")
    @Mapping(target = "sportsReservationReports", source = "reservationReportDataList")
    ReservationsSummary mapToReservationsSummaryApi(ReservationsSummaryData reservationsSummaryData);
}
