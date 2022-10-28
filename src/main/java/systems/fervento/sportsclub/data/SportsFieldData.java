package systems.fervento.sportsclub.data;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public abstract class SportsFieldData {
    private Long id;
    private String name;
    private boolean isIndoor;
    private SportsFieldPriceListData priceList;
    private SportsFacilityData sportsFacility;
}
