package systems.fervento.sportsclub.entity;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.Objects;

@Getter
@Setter
@NoArgsConstructor
@Entity
public class RatingEntity {
    @Id
    @GeneratedValue(generator = "reservationKeyGenerator")
    @org.hibernate.annotations.GenericGenerator(
        name = "reservationKeyGenerator",
        strategy = "foreign",
        parameters =
            @org.hibernate.annotations.Parameter(
                name = "property", value = "reservation"
            )
    )
    private Long id;

    @OneToOne(optional = false)
    @PrimaryKeyJoinColumn
    private ReservationEntity reservation;

    @NotNull
    private Stars stars;

    @NotNull
    private String description;

    public RatingEntity(final ReservationEntity reservation, final Stars stars, final String description) {
        setReservation(reservation);
        setStars(stars);
        setDescription(description);
    }

    public void setReservation(final ReservationEntity reservation) {
        Objects.requireNonNull(reservation);
        if (reservation.getRating() != null) {
            throw new IllegalArgumentException("This reservation already has a rating assigned!");
        }
        this.reservation = reservation;
    }

    public void setStars(final Stars stars) {
        Objects.requireNonNull(stars);
        this.stars = stars;
    }

    public void setDescription(final String description) {
        Objects.requireNonNull(description);
        this.description = description;
    }
}
