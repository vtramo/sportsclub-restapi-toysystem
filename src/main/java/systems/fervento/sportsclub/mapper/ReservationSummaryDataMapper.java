package systems.fervento.sportsclub.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import systems.fervento.sportsclub.data.ReservationsSummaryData;
import systems.fervento.sportsclub.entity.ReservationsSummaryEntity;

@Mapper(componentModel = "spring", uses = SportsReservationReportDataMapper.class)
public interface ReservationSummaryDataMapper {
    @Mapping(target = "sportsFacilityName", source = "sportsFacility.name")
    @Mapping(target = "sportsFacilityId", source = "sportsFacility.id")
    @Mapping(target = "reservationReportDataList", source = "sportsReservationReports")
    @Mapping(target = "startDateTime", source = "dateTimeRange.startDateTime")
    @Mapping(target = "endDateTime", source = "dateTimeRange.endDateTime")
    ReservationsSummaryData mapToReservationsSummaryData(ReservationsSummaryEntity reservationsSummaryEntity);
}
