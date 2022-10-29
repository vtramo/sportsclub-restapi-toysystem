package systems.fervento.sportsclub.data;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public abstract class BillingDetailsData {
    private Long id;
    private UserData owner;
}
