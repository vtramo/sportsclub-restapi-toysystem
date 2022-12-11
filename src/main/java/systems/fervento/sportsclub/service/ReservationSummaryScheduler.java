package systems.fervento.sportsclub.service;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.ZonedDateTime;

@Component
public class ReservationSummaryScheduler {
    private final ReservationSummaryService reservationSummaryService;

    public ReservationSummaryScheduler(ReservationSummaryService reservationSummaryService) {
        this.reservationSummaryService = reservationSummaryService;
    }

    @Scheduled(cron = "0 * * * * *")
    public void scheduleFixedDelayTask() {
        reservationSummaryService.generateAndSaveReservationsSummaryForAllSportsFacilities(
            ZonedDateTime.now().minusWeeks(1),
            ZonedDateTime.now()
        );
    }
}
