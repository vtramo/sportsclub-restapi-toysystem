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
    private Long id;
    private ZonedDateTime createdAt;
    private String description;
    private ZonedDateTime startDateTime;
    private ZonedDateTime endDateTime;
    private long sportsFacilityId;
    private String sportsFacilityName;
    private List<SportsReservationReportData> reservationReportDataList;
}
