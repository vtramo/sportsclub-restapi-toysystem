package systems.fervento.sportsclub.entity;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Objects;

@Setter
@Getter
@NoArgsConstructor
@Entity
public class ReservationsSummaryEntity {
    @Id
    @GeneratedValue(generator = "ID_GENERATOR")
    private Long id;

    @CreationTimestamp
    private LocalDateTime createdAt;

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
        sportsReservationReports.add(sportsReservationReport);
    }
}
