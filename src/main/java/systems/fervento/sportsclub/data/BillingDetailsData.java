package systems.fervento.sportsclub.data;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public abstract class BillingDetailsData {
    private Long id;
    private Long ownerId;
}
