package systems.fervento.sportsclub.service;

import org.springframework.stereotype.Service;
import systems.fervento.sportsclub.entity.SportsFieldEntity;
import systems.fervento.sportsclub.exception.PreconditionViolationException;

import java.time.ZonedDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Objects;

@Service
class ReservationPriceCalculatorService {

    protected float calculatePrice(
        final ZonedDateTime startDateTime,
        final ZonedDateTime endDateTime,
        final SportsFieldEntity sportsFieldEntity
    ) {
        Objects.requireNonNull(startDateTime);
        Objects.requireNonNull(endDateTime);
        if (startDateTime.isAfter(endDateTime) || startDateTime.isEqual(endDateTime)) {
            throw new PreconditionViolationException("The starting date must be less than the ending date!");
        }

        final var priceListSportsField = sportsFieldEntity.getPriceList();
        final var pricePerHour = priceListSportsField.getPricePerHour();
        final var priceIndoor = priceListSportsField.getPriceIndoor();

        final var totalHoursReservation = ChronoUnit.HOURS.between(startDateTime, endDateTime);

        return (totalHoursReservation * pricePerHour) + (sportsFieldEntity.isIndoor() ? priceIndoor : 0f);
    }
}
