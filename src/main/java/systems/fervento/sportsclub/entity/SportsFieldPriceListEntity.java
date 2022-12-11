package systems.fervento.sportsclub.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;

@NoArgsConstructor
@Getter
@Setter
@Entity
public class SportsFieldPriceListEntity {
    @Id
    @GeneratedValue(generator = "sportsFieldKeyGenerator")
    @org.hibernate.annotations.GenericGenerator(
        name = "sportsFieldKeyGenerator",
        strategy = "foreign",
        parameters =
            @org.hibernate.annotations.Parameter(
                name = "property", value = "sportsField"
            )
    )
    private Long id;

    @NotNull
    @OneToOne
    @PrimaryKeyJoinColumn
    @org.hibernate.annotations.OnDelete(
        action = org.hibernate.annotations.OnDeleteAction.CASCADE
    )
    private SportsFieldEntity sportsField;

    @Min(value = 0)
    private float pricePerHour;

    @Min(value = 0)
    private float priceIndoor;

    public SportsFieldPriceListEntity(final float pricePerHour) {
        if (pricePerHour < 0) throw new IllegalArgumentException();
        this.pricePerHour = pricePerHour;
    }

    public SportsFieldPriceListEntity(final float pricePerHour, final float priceIndoor) {
        this(pricePerHour);
        if (priceIndoor < 0) throw new IllegalArgumentException();
        this.priceIndoor = priceIndoor;
    }
}
