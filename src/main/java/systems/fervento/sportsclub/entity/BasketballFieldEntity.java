package systems.fervento.sportsclub.entity;

import lombok.NoArgsConstructor;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;

@NoArgsConstructor
@Entity
@DiscriminatorValue(value = "basketball")
public class BasketballFieldEntity extends SportsFieldEntity {

    public BasketballFieldEntity(final String name, final boolean isIndoor) {
        super(name, isIndoor);
    }

}
