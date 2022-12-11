package systems.fervento.sportsclub.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import javax.validation.constraints.NotNull;
import java.time.ZonedDateTime;
import java.util.Objects;

@Setter
@Getter
@NoArgsConstructor
@Entity
@NamedQueries({
    @NamedQuery(
        name = "ReservationEntity.findAll",
        query = "select r from ReservationEntity r " +
                "where " +
                "(:state                          is null or :state               = r.reservationStatus)               and " +
                "(:sport                          is null or :sport               = r.sportsField.sport)               and " +
                "(cast(:createdAt as date)        is null or :createdAt           = r.createdAt)                       and " +
                "(cast(:startDate as date)        is null or :startDate           <= r.dateTimeRange.startDateTime)    and " +
                "(cast(:endDate as date)          is null or :endDate             >= r.dateTimeRange.endDateTime)      and " +
                "(:price                          is null or :price               = r.price)                           and " +
                "(:sportsFieldId                  is null or :sportsFieldId       = r.sportsField.id)                  and " +
                "(:sportsFacilityId               is null or :sportsFacilityId    = r.sportsField.sportsFacility.id)"
    ),
    @NamedQuery(
        name = "ReservationEntity.generateSportsReservationsReportForSportsFacility",
        query = "select r.sportsField.sport as sport, " +
                "coalesce(count(r.id), 0) as totalReservations, " +
                "coalesce(sum(case when (r.reservationStatus = 'ACCEPTED') then 1 else 0 end), 0)       as acceptedReservations, " +
                "coalesce(sum(case when (r.reservationStatus = 'REJECTED') then 1 else 0 end), 0)       as rejectedReservations, " +
                "coalesce(sum(case when (r.reservationStatus = 'PENDING')  then 1 else 0 end), 0)       as pendingReservations,  " +
                "coalesce(sum(case when (r.reservationStatus = 'ACCEPTED') then r.price else 0 end), 0) as totalRevenue          " +
                "from ReservationEntity r where r.sportsField.sportsFacility.id = :sportsFacilityId                     and      " +
                "(cast(:startDate as date)        is null or :startDate           <= r.dateTimeRange.startDateTime)     and      " +
                "(cast(:endDate as date)          is null or :endDate             >= r.dateTimeRange.endDateTime)                " +
                "group by sport"
    ),
    @NamedQuery(
        name = "ReservationEntity.generateSportsFieldReservationsReportForSportsField",
        query = "select r.sportsField.sport as sport, " +
                "coalesce(count(r.id), 0) as totalReservations, " +
                "coalesce(sum(case when (r.reservationStatus = 'ACCEPTED') then 1 else 0 end), 0)       as acceptedReservations, " +
                "coalesce(sum(case when (r.reservationStatus = 'REJECTED') then 1 else 0 end), 0)       as rejectedReservations, " +
                "coalesce(sum(case when (r.reservationStatus = 'PENDING')  then 1 else 0 end), 0)       as pendingReservations,  " +
                "coalesce(sum(case when (r.reservationStatus = 'ACCEPTED') then r.price else 0 end), 0) as totalRevenue          " +
                "from ReservationEntity r where r.sportsField.id = :sportsFieldId                                            and " +
                "(cast(:startDate as date)         is null or :startDate           <= r.dateTimeRange.startDateTime)         and " +
                "(cast(:endDate as date)           is null or :endDate             >= r.dateTimeRange.endDateTime)               " +
                "group by sport"
    ),
    @NamedQuery(
        name = "ReservationEntity.generateSportsReservationsReportForAllSportsFacility",
        query = "select r.sportsField.sportsFacility.id as sportsFacilityId, " +
                "r.sportsField.sport as sport, " +
                "coalesce(count(r.id), 0) as totalReservations, " +
                "coalesce(sum(case when (r.reservationStatus = 'ACCEPTED') then 1 else 0 end), 0)       as acceptedReservations, " +
                "coalesce(sum(case when (r.reservationStatus = 'REJECTED') then 1 else 0 end), 0)       as rejectedReservations, " +
                "coalesce(sum(case when (r.reservationStatus = 'PENDING')  then 1 else 0 end), 0)       as pendingReservations,  " +
                "coalesce(sum(case when (r.reservationStatus = 'ACCEPTED') then r.price else 0 end), 0) as totalRevenue          " +
                "from ReservationEntity r where " +
                "(cast(:startDate as date)        is null or :startDate           <= r.dateTimeRange.startDateTime)          and " +
                "(cast(:endDate as date)          is null or :endDate             >= r.dateTimeRange.endDateTime)                " +
                "group by sportsFacilityId, sport"
    )
})
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
    private ReservationRatingEntity rating;

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

    public void setRating(final ReservationRatingEntity rating) {
        Objects.requireNonNull(rating);
        if (rating.getReservation() != null) {
            throw new IllegalArgumentException("This RatingEntity already has a reservation assigned!");
        }
        rating.setReservation(this);
        this.rating = rating;
    }

    public void setSportsField(final SportsFieldEntity sportsField) {
        Objects.requireNonNull(sportsField);
        this.sportsField = sportsField;
    }
}
