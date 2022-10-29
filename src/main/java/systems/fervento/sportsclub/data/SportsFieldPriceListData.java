package systems.fervento.sportsclub.data;

import lombok.*;

@Setter
@Getter
@EqualsAndHashCode(exclude = "sportsField")
@NoArgsConstructor
@AllArgsConstructor
public class SportsFieldPriceListData {
    private Long id;
    private SportsFieldData sportsField;
    private float pricePerHour;
    private float priceIndoor;
}
