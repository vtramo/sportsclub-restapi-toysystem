package systems.fervento.sportsclub.mapper;

import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;
import org.springframework.data.domain.Page;
import systems.fervento.sportsclub.data.ReservationsSummaryData;
import systems.fervento.sportsclub.openapi.model.MonthlyReservationsSummariesPage;
import systems.fervento.sportsclub.openapi.model.MonthlyReservationsSummary;

import static java.util.stream.Collectors.toList;

@Mapper(componentModel = "spring", uses = SportsReservationReportApiMapper.class)
public interface MonthlyReservationsSummaryApiMapper {
    default MonthlyReservationsSummariesPage mapToMonthlyReservationsSummary(
        Page<ReservationsSummaryData> reservationsSummaryDataPage
    ) {
        return mapToMonthlyReservationsSummariesPage(1 ,reservationsSummaryDataPage);
    }

    @Mapping(target = "totalPages", expression = "java(reservationsSummaryDataPage.getTotalPages())")
    @Mapping(target = "totalElements", expression = "java(reservationsSummaryDataPage.getTotalElements())")
    @Mapping(target = "pageSize", expression = "java(reservationsSummaryDataPage.getSize())")
    @Mapping(target = "pageNo", expression = "java(reservationsSummaryDataPage.getNumber())")
    @Mapping(target = "monthlyReservationsSummaries", ignore = true)
    @Mapping(target = "last", expression = "java(reservationsSummaryDataPage.isLast())")
    @DoIgnore
    MonthlyReservationsSummariesPage mapToMonthlyReservationsSummariesPage(
        Integer dummy, Page<ReservationsSummaryData> reservationsSummaryDataPage
    );

    @AfterMapping
    default void setPageContentToMonthlyReservationsSummaries(
        @MappingTarget MonthlyReservationsSummariesPage monthlyReservationsSummaries,
        Page<ReservationsSummaryData> reservationsSummaryDataPage
    ) {
        monthlyReservationsSummaries.setMonthlyReservationsSummaries(
            reservationsSummaryDataPage
                .stream()
                .map(this::mapToMonthlyReservationSummary)
                .collect(toList())
        );
    }
    @Mapping(target = "startDate", source = "startDateTime")
    @Mapping(target = "sportsReservationReports", source = "reservationReportDataList")
    @Mapping(target = "endDate", source = "endDateTime")
    MonthlyReservationsSummary mapToMonthlyReservationSummary(ReservationsSummaryData reservationsSummaryData);
}
