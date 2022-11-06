package systems.fervento.sportsclub.data;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.ZonedDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReservationsSummaryData {
    private ZonedDateTime createdAt;
    private String description;
    private long sportsFacilityId;
    private String sportsFacilityName;
    private List<SportsReservationReportData> reservationReportDataList;
}
