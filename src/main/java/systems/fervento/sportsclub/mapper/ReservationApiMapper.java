package systems.fervento.sportsclub.mapper;

import org.mapstruct.*;
import org.springframework.data.domain.Page;
import systems.fervento.sportsclub.data.ReservationData;
import systems.fervento.sportsclub.openapi.model.DateRange;
import systems.fervento.sportsclub.openapi.model.Reservation;
import systems.fervento.sportsclub.openapi.model.ReservationPage;

import static java.util.stream.Collectors.toList;

@Mapper(componentModel = "spring")
public interface ReservationApiMapper {
    @AfterMapping
    default void mapDateRange(@MappingTarget Reservation reservation, ReservationData reservationData) {
        final var dateRange = new DateRange();
        dateRange.setStartDate(reservationData.getStartDateTime());
        dateRange.setEndDate(reservationData.getEndDateTime());
        reservation.setDateRange(dateRange);
    }

    @Mapping(target = "dateRange", ignore = true)
    Reservation mapToReservationApi(ReservationData reservationData);

    @AfterMapping
    default void mapDateRange(@MappingTarget ReservationData reservationData, Reservation reservation) {
        final var dateRange = reservation.getDateRange();
        reservationData.setStartDateTime(dateRange.getStartDate());
        reservationData.setEndDateTime(dateRange.getEndDate());
    }

    @InheritInverseConfiguration
    ReservationData mapToReservationData(Reservation reservation);

    default ReservationPage mapToReservationPage(Page<ReservationData> reservationDataPage) {
        return mapToReservationPage(1, reservationDataPage);
    }

    @Mapping(target = "pageNo", expression = "java(reservationDataPage.getNumber())")
    @Mapping(target = "pageSize", expression = "java(reservationDataPage.getSize())")
    @Mapping(target = "totalPages", expression = "java(reservationDataPage.getTotalPages())")
    @Mapping(target = "totalElements", expression = "java(reservationDataPage.getTotalElements())")
    @Mapping(target = "last", expression = "java(reservationDataPage.isLast())")
    @Mapping(target = "reservations", ignore = true)
    @DoIgnore
    ReservationPage mapToReservationPage(Integer dummy, Page<ReservationData> reservationDataPage);

    @AfterMapping
    default void setPageContentToNotificationPage(
        @MappingTarget ReservationPage reservationData,
        Page<ReservationData> reservationDataPage
    ) {
        reservationData.setReservations(reservationDataPage
            .stream()
            .map(this::mapToReservationApi)
            .collect(toList())
        );
    }
}
