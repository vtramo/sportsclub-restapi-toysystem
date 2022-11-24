package systems.fervento.sportsclub.entity;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.Hibernate;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Setter
@Getter
@NoArgsConstructor
@Entity
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
    @org.hibernate.annotations.OnDelete(
        action = org.hibernate.annotations.OnDeleteAction.CASCADE
    )
    private Set<SportsFieldEntity> sportsFields = new HashSet<>();

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
        sportsFieldEntity.setSportsFacility(this);
    }
}
