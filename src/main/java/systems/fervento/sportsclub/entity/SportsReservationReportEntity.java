package systems.fervento.sportsclub.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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
