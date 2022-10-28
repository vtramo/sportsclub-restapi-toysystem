package systems.fervento.sportsclub.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.validation.constraints.Size;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@DiscriminatorValue(value = "credit_card")
public class CreditCardEntity extends BillingDetailsEntity{

    @Size(min = 16, max = 16)
    @Column(length = 16, unique = true)
    private String cardNumber;

    @Size(min = 5, max = 5)
    @Column(length = 5)
    private String expMonth;

    @Size(min = 4, max = 4)
    @Column(length = 4)
    private String expYear;
}
