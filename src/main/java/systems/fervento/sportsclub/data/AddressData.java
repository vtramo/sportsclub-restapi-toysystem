package systems.fervento.sportsclub.data;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AddressData {
    private String streetName;
    private String streetNumber;
    private String city;
    private String country;
    private String postalCode;
}
