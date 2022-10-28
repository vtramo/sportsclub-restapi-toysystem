package systems.fervento.sportsclub.entity;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import java.time.ZonedDateTime;
import java.util.Objects;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@org.hibernate.annotations.Immutable
@Embeddable
public class DateTimeRange {
    @Column(nullable = false)
    private ZonedDateTime startDateTime;

    @Column(nullable = false)
    private ZonedDateTime endDateTime;

    public DateTimeRange(final ZonedDateTime startDateTime, final ZonedDateTime endDateTime) {
        Objects.requireNonNull(startDateTime);
        Objects.requireNonNull(endDateTime);
        if (startDateTime.compareTo(endDateTime) >= 0) {
            throw new IllegalArgumentException("The starting date must be less than the ending date!");
        }
        this.startDateTime = startDateTime;
        this.endDateTime = endDateTime;
    }
}
