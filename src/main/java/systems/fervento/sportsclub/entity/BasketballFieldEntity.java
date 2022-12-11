package systems.fervento.sportsclub.entity;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Entity
@DiscriminatorValue(value = "basket")
public class BasketballFieldEntity extends SportsFieldEntity {

    public BasketballFieldEntity(final String name, final boolean isIndoor) {
        super(name, isIndoor);
    }

}
