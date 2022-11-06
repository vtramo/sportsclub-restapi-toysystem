package systems.fervento.sportsclub.data;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SportsReservationReportData {
    private long totalReservations;
    private String sport;
    private double totalRevenue;
    private long rejectedReservations;
    private long acceptedReservations;
    private long pendingReservations;
}
