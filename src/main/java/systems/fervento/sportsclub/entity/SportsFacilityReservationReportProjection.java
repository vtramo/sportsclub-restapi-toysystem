package systems.fervento.sportsclub.entity;

public interface SportsFacilityReservationReportProjection {
    long getTotalReservations();
    String getSport();
    double getTotalRevenue();
    long getAcceptedReservations();
    long getRejectedReservations();
    long getPendingReservations();
    long getSportsFacilityId();
}
