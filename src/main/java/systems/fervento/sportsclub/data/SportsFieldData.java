package systems.fervento.sportsclub.data;

import lombok.*;

@EqualsAndHashCode(exclude = "sportsFacility")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public abstract class SportsFieldData {
    private Long id;
    private Long sportsFacilityId;
    private String name;
    private boolean isIndoor;
    private SportsFieldPriceListData priceList;
    private SportsFacilityData sportsFacility;
}
