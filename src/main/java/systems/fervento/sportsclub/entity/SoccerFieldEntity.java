package systems.fervento.sportsclub.entity;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;

@Getter
@Setter
@NoArgsConstructor
@Entity
@DiscriminatorValue("soccer")
public class SoccerFieldEntity extends SportsFieldEntity {
    @Enumerated(EnumType.STRING)
    private SoccerFieldType soccerFieldType;

    public SoccerFieldEntity(final String name, final SoccerFieldType soccerFieldType, final boolean isIndoor) {
        super(name, isIndoor);
        this.soccerFieldType = soccerFieldType;
    }
}
