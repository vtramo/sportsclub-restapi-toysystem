package systems.fervento.sportsclub.entity;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotNull;

@Setter
@Getter
@NoArgsConstructor
@Entity
@org.hibernate.annotations.Immutable
public class SportsReservationReportEntity {
    @Id
    @GeneratedValue(generator = "ID_GENERATOR")
    private Long id;

    @NotNull
    @ManyToOne
    @org.hibernate.annotations.OnDelete(
        action = org.hibernate.annotations.OnDeleteAction.CASCADE
    )
    private ReservationsSummaryEntity reservationsSummaryEntity;

    @NotNull
    private long totalReservations;

    @NotNull
    private String sport;

    @NotNull
    private double totalRevenue;

    @NotNull
    private long rejectedReservations;

    @NotNull
    private long acceptedReservations;

    @NotNull
    private long pendingReservations;
}
