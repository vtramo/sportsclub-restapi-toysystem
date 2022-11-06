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
public class ReservationRatingEntity {
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
    private float score;

    @NotNull
    private String description;

    public ReservationRatingEntity(final ReservationEntity reservation, final float score, final String description) {
        setReservation(reservation);
        setScore(score);
        setDescription(description);
    }

    public void setReservation(final ReservationEntity reservation) {
        Objects.requireNonNull(reservation);
        if (reservation.getRating() != null) {
            throw new IllegalArgumentException("This reservation already has a rating assigned!");
        }
        this.reservation = reservation;
    }

    public void setDescription(final String description) {
        Objects.requireNonNull(description);
        this.description = description;
    }
}
