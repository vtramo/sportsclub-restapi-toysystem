package systems.fervento.sportsclub.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;
import systems.fervento.sportsclub.data.ReservationsSummaryData;
import systems.fervento.sportsclub.entity.ReservationsSummaryEntity;

@Mapper(uses = SportsReservationReportDataMapper.class)
public interface ReservationSummaryDataMapper {
    ReservationSummaryDataMapper INSTANCE = Mappers.getMapper(ReservationSummaryDataMapper.class);

    @Mapping(target = "sportsFacilityName", source = "sportsFacility.name")
    @Mapping(target = "sportsFacilityId", source = "sportsFacility.id")
    @Mapping(target = "reservationReportDataList", source = "sportsReservationReports")
    @Mapping(target = "startDateTime", source = "dateTimeRange.startDateTime")
    @Mapping(target = "endDateTime", source = "dateTimeRange.endDateTime")
    ReservationsSummaryData mapToReservationsSummaryData(ReservationsSummaryEntity reservationsSummaryEntity);
}
