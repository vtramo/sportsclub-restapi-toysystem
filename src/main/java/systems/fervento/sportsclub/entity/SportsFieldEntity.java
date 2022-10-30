package systems.fervento.sportsclub.entity;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.Objects;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "field_type")
public abstract class SportsFieldEntity {
    @Id
    @GeneratedValue(generator = "ID_GENERATOR")
    private Long id;

    @NotNull
    @NotBlank
    @Column(unique = true)
    private String name;

    private boolean isIndoor;

    @NotNull
    @OneToOne(
        mappedBy = "sportsField",
        cascade = {CascadeType.PERSIST}
    )
    private SportsFieldPriceListEntity priceList;

    @NotNull
    @ManyToOne
    private SportsFacilityEntity sportsFacility;

    protected SportsFieldEntity(final String name, final boolean isIndoor) {
        Objects.requireNonNull(name);
        this.name = name;
        this.isIndoor = isIndoor;
    }

    public void setPriceList(final SportsFieldPriceListEntity priceList) {
        Objects.requireNonNull(priceList);
        if (priceList.getSportsField() != null) {
            throw new IllegalStateException("This price list is already assigned to a SportsField!");
        }
        this.priceList = priceList;
        priceList.setSportsField(this);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || this.getClass() != o.getClass()) return false;
        SportsFieldEntity that = (SportsFieldEntity) o;
        return id != null && Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
