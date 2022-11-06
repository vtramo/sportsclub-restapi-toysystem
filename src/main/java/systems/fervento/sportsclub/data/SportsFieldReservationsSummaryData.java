package systems.fervento.sportsclub.data;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SportsFieldReservationsSummaryData extends ReservationsSummaryData {
    private long sportsFieldId;
    private String sportsFieldName;
}
