package systems.fervento.sportsclub.data;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserData {
    private Long id;
    private String username;
    private String password;
    private String firstName;
    private String lastName;
    private String email;
    private String fiscalCode;
    private AddressData homeAddress;
/*    private Set<BillingDetailsData> allBillingDetails;*/
    private Set<SportsFacilityData> sportsFacilities;
    private LocalDateTime registeredOn;
}
