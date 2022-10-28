package systems.fervento.sportsclub.entity;

import lombok.NoArgsConstructor;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;

@NoArgsConstructor
@Entity
@DiscriminatorValue("volleyball")
public class VolleyballFieldEntity extends SportsFieldEntity {

    public VolleyballFieldEntity(final String name, final boolean isIndoor) {
        super(name, isIndoor);
    }

}
