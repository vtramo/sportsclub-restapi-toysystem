package systems.fervento.sportsclub.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Formula;


import java.util.Objects;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "sport")
public abstract class SportsFieldEntity {
    @Id
    @GeneratedValue(generator = "ID_GENERATOR")
    private Long id;

    @NotNull
    @NotBlank
    @Column(unique = true)
    private String name;

    @Formula(value = "sport")
    private String sport;

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
