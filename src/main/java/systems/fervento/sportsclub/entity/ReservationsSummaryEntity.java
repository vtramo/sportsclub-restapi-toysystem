package systems.fervento.sportsclub.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import javax.validation.constraints.NotNull;
import java.time.Year;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Objects;

@Setter
@Getter
@NoArgsConstructor
@Entity
@NamedQueries({
    @NamedQuery(
        name = "ReservationsSummaryEntity.getReservationsSummaries",
        query = "select r from ReservationsSummaryEntity r " +
                "where (:month is null or :month = r.month) and" +
                "      (:year is null or :year = r.year)    and" +
                "      (:sportsFacilityId is null or :sportsFacilityId = r.sportsFacility.id)"
    )
})
public class ReservationsSummaryEntity {
    @Id
    @GeneratedValue(generator = "ID_GENERATOR")
    private Long id;

    @CreationTimestamp
    private ZonedDateTime createdAt;

    private Integer month = ZonedDateTime.now().getMonth().getValue();
    private String year = Year.now().toString();

    @NotNull
    private String description;

    @ManyToOne
    @NotNull
    private SportsFacilityEntity sportsFacility;

    @NotNull
    private DateTimeRange dateTimeRange;

    @OneToMany(
        cascade = CascadeType.PERSIST
    )
    private Collection<SportsReservationReportEntity> sportsReservationReports = new ArrayList<>();

    private long totalReservations;
    private long acceptedReservations;
    private long rejectedReservations;
    private long pendingReservations;
    private double totalRevenue;

    public void addAllSportsReservationReport(final Iterable<SportsReservationReportEntity> sportsReservationReportEntities) {
        Objects.requireNonNull(sportsReservationReportEntities);
        sportsReservationReportEntities.forEach(this::addSportsReservationReport);
    }

    public void addSportsReservationReport(final SportsReservationReportEntity sportsReservationReport) {
        Objects.requireNonNull(sportsReservationReport);
        if (sportsReservationReport.getReservationsSummaryEntity() != null) {
            throw new IllegalArgumentException("This sportsReservationReports already has a ReservationsSummaryEntity!");
        }
        sportsReservationReport.setReservationsSummaryEntity(this);
        updateTotalReservationsSummary(sportsReservationReport);
        sportsReservationReports.add(sportsReservationReport);
    }

    private void updateTotalReservationsSummary(SportsReservationReportEntity sportsReservationReport) {
        totalReservations += sportsReservationReport.getTotalReservations();
        acceptedReservations += sportsReservationReport.getAcceptedReservations();
        rejectedReservations += sportsReservationReport.getRejectedReservations();
        pendingReservations += sportsReservationReport.getPendingReservations();
        totalRevenue += sportsReservationReport.getTotalRevenue();
    }
}
