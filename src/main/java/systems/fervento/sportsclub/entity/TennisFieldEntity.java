package systems.fervento.sportsclub.entity;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.validation.constraints.NotNull;

@Getter
@Setter
@NoArgsConstructor
@Entity
@DiscriminatorValue(value = "tennis")
public class TennisFieldEntity extends SportsFieldEntity {
    @Enumerated(EnumType.STRING)
    @NotNull
    private TennisFieldType tennisFieldType;

    public TennisFieldEntity(final String name, final TennisFieldType tennisFieldType, final boolean isIndoor) {
        super(name, isIndoor);
        this.tennisFieldType = tennisFieldType;
    }
}
