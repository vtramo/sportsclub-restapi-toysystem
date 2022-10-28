package systems.fervento.sportsclub.entity;

import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.Objects;

@Setter
@Getter
@Entity
public class NotificationEntity {
    @Id
    @GeneratedValue(generator = "ID_GENERATOR")
    private Long id;

    @CreationTimestamp
    private LocalDate createdOn;

    private boolean hasBeenRead;

    @NotNull
    private String description;

    @NotNull
    @ManyToOne
    private UserEntity owner;

    public void setOwner(UserEntity owner) {
        Objects.requireNonNull(owner);
        this.owner = owner;
    }
}
