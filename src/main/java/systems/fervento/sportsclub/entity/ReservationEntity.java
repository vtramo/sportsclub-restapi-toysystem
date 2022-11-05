package systems.fervento.sportsclub.entity;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.time.ZonedDateTime;
import java.util.Objects;

@Setter
@Getter
@NoArgsConstructor
@Entity
public class ReservationEntity {
    @Id
    @GeneratedValue(generator = "ID_GENERATOR")
    private Long id;

    @NotNull
    @Enumerated(EnumType.STRING)
    private ReservationStatus reservationStatus = ReservationStatus.PENDING;

    @NotNull
    @Embedded
    private DateTimeRange dateTimeRange;

    @OneToOne(
        mappedBy = "reservation",
        cascade  = CascadeType.PERSIST
    )
    private RatingEntity rating;

    private float price;

    @CreationTimestamp
    private ZonedDateTime createdAt;

    @NotNull
    @ManyToOne
    private UserEntity owner;

    @NotNull
    @ManyToOne
    private SportsFieldEntity sportsField;

    public ReservationEntity(final DateTimeRange dateTimeRange, final float price, final UserEntity owner) {
        setDateTimeRange(dateTimeRange);
        setPrice(price);
        setOwner(owner);
    }
    public void setDateTimeRange(final DateTimeRange dateTimeRange) {
        Objects.requireNonNull(dateTimeRange);
        this.dateTimeRange = dateTimeRange;
    }

    public void setPrice(final float price) {
        if (price < 0) {
            throw new IllegalArgumentException("The price must be greater than zero!");
        }
        this.price = price;
    }

    public void setOwner(final UserEntity owner) {
        Objects.requireNonNull(owner);
        this.owner = owner;
    }

    public void setRating(final RatingEntity rating) {
        Objects.requireNonNull(rating);
        if (rating.getReservation() != this) {
            throw new IllegalArgumentException("This RatingEntity must have a reference to this ReservationEntity!");
        }
        this.rating = rating;
    }

    public void setSportsField(final SportsFieldEntity sportsField) {
        Objects.requireNonNull(sportsField);
        this.sportsField = sportsField;
    }
}
