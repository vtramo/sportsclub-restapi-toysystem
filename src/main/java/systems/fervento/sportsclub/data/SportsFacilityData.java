package systems.fervento.sportsclub.data;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SportsFacilityData {
    private Long id;
    private String name;
    private String phone;
    private UserData owner;
    private AddressData address;
    private int totalSportsField;
    private Set<SportsFieldData> sportsFields;
}
