package systems.fervento.sportsclub.data;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SportsFieldPriceListData {
    private Long id;
    private SportsFieldData sportsField;
    private float pricePerHour;
    private float priceIndoor;
}
