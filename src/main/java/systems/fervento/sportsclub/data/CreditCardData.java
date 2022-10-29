package systems.fervento.sportsclub.data;

import lombok.*;

@Setter
@Getter
@EqualsAndHashCode(callSuper = true)
@AllArgsConstructor
@NoArgsConstructor
public class CreditCardData extends BillingDetailsData {
    private String cardNumber;
    private String expMonth;
    private String expYear;
}
