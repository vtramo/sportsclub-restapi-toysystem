package systems.fervento.sportsclub.entity;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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
