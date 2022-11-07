package systems.fervento.sportsclub.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;
import systems.fervento.sportsclub.data.ReservationsSummaryData;
import systems.fervento.sportsclub.openapi.model.ReservationsSummary;

@Mapper(uses = SportsReservationReportApiMapper.class)
public interface ReservationSummaryApiMapper {
    ReservationSummaryApiMapper INSTANCE = Mappers.getMapper(ReservationSummaryApiMapper.class);

    @Mapping(target = "startDate", source = "startDateTime")
    @Mapping(target = "endDate", source = "endDateTime")
    @Mapping(target = "sportsReservationReports", source = "reservationReportDataList")
    ReservationsSummary mapToReservationsSummaryApi(ReservationsSummaryData reservationsSummaryData);
}
