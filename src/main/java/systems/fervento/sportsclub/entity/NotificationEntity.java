package systems.fervento.sportsclub.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import javax.validation.constraints.NotNull;
import java.time.ZonedDateTime;
import java.util.Objects;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class NotificationEntity {
    @Id
    @GeneratedValue(generator = "ID_GENERATOR")
    private Long id;

    @CreationTimestamp
    private ZonedDateTime createdAt;

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
