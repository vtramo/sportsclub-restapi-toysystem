package systems.fervento.sportsclub.entity;

import jakarta.persistence.*;
import jakarta.persistence.CascadeType;
import jakarta.persistence.NamedQueries;
import jakarta.persistence.NamedQuery;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.Hibernate;
import org.hibernate.annotations.*;

import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Setter
@Getter
@NoArgsConstructor
@Entity
@NamedQueries({
    @NamedQuery(
        name = "SportsFacilityEntity.findAllByTotalNumberSportsFieldsBetween",
        query = "SELECT sf FROM SportsFacilityEntity sf WHERE sf.totalSportsField > :min AND sf.totalSportsField < :max"
    ),
    @NamedQuery(
        name = "SportsFacilityEntity.findAllByOwnerIdAndTotalNumberSportsFieldsBetween",
        query = "SELECT sf FROM SportsFacilityEntity sf WHERE sf.owner.id = :ownerId " +
                "AND sf.totalSportsField > :min AND sf.totalSportsField < :max"
    )
})
public class SportsFacilityEntity {
    @Id
    @GeneratedValue(generator = "ID_GENERATOR")
    private Long id;

    @NotNull
    private String name;

    @NotNull
    private String phone;

    @NotNull
    @Embedded
    private Address address;

    @NotNull
    @ManyToOne
    private UserEntity owner;

    @OneToMany(
        mappedBy = "sportsFacility",
        cascade = {CascadeType.PERSIST}
    )
    @OnDelete(
        action = OnDeleteAction.CASCADE
    )
    @LazyCollection(LazyCollectionOption.EXTRA)
    private Set<SportsFieldEntity> sportsFields = new HashSet<>();

    private int totalSportsField;

    public SportsFacilityEntity(final String name, final String phone) {
        Objects.requireNonNull(name);
        Objects.requireNonNull(phone);
        this.name = name;
        this.phone = phone;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        SportsFacilityEntity that = (SportsFacilityEntity) o;
        return id != null && Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    public void addSportsField(final SportsFieldEntity sportsFieldEntity) {
        Objects.requireNonNull(sportsFieldEntity);
        sportsFields.add(sportsFieldEntity);
        totalSportsField++;
        sportsFieldEntity.setSportsFacility(this);
    }
}
