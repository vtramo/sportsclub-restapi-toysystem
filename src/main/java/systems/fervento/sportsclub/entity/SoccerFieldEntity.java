package systems.fervento.sportsclub.entity;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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
