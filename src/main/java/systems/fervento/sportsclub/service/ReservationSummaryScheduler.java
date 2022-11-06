package systems.fervento.sportsclub.service;

import lombok.extern.log4j.Log4j2;
import org.apache.logging.log4j.Level;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import systems.fervento.sportsclub.entity.ReservationsSummaryEntity;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Component
@Log4j2
public class ReservationSummaryScheduler {
    private final ReservationSummaryService reservationSummaryService;

    public ReservationSummaryScheduler(ReservationSummaryService reservationSummaryService) {
        this.reservationSummaryService = reservationSummaryService;
    }

    @Scheduled(cron = "0 * * * * *")
    public void scheduleFixedDelayTask() {
        var reservationSummaries = reservationSummaryService.generateAndSaveReservationsSummaryForAllSportsFacilities(
            ZonedDateTime.now().minusWeeks(1),
            ZonedDateTime.now()
        );

        final List<Long> sportsFacilitiesIdentifiers = reservationSummaries.stream()
            .map(r -> r.getSportsFacility().getId())
            .collect(Collectors.toList());

        final List<Long> generatedSummariesIdentifiers = reservationSummaries.stream()
            .map(ReservationsSummaryEntity::getId)
            .collect(Collectors.toList());

        log.log(
            Level.INFO, "Reservations Summaries generated for the sports facilities with id " + sportsFacilitiesIdentifiers +
                            ". The identifiers of the generated summaries are " + generatedSummariesIdentifiers + "."
        );
    }
}
