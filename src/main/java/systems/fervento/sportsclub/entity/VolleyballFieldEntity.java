package systems.fervento.sportsclub.entity;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.NoArgsConstructor;


@NoArgsConstructor
@Entity
@DiscriminatorValue("volleyball")
public class VolleyballFieldEntity extends SportsFieldEntity {

    public VolleyballFieldEntity(final String name, final boolean isIndoor) {
        super(name, isIndoor);
    }

}
