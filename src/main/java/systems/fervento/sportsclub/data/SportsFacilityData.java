package systems.fervento.sportsclub.data;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SportsFacilityData {
    private Long id;
    private String name;
    private String phone;
    private UserData owner;
    private AddressData address;
}
