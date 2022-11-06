package systems.fervento.sportsclub.entity;


import java.util.Comparator;
import java.util.HashMap;
import java.util.Map;

import static java.util.Comparator.*;

public interface SportsReservationReportProjection {
    long getTotalReservations();

    String getSport();
    double getTotalRevenue();
    long getAcceptedReservations();
    long getRejectedReservations();
    long getPendingReservations();

    class Comparators {
        public static Map<String, Comparator<SportsReservationReportProjection>> propertyToComparator = new HashMap<>() {
            {
                put("total_reservations", comparingDouble(SportsReservationReportProjection::getTotalReservations));
                put("sport", comparing(SportsReservationReportProjection::getSport));
                put("total_revenue", comparingDouble(SportsReservationReportProjection::getTotalRevenue));
                put("accepted_reservations", comparingLong(SportsReservationReportProjection::getAcceptedReservations));
                put("rejected_reservations", comparingLong(SportsReservationReportProjection::getRejectedReservations));
                put("pending_reservations", comparingLong(SportsReservationReportProjection::getPendingReservations));
            }
        };
    }
}
