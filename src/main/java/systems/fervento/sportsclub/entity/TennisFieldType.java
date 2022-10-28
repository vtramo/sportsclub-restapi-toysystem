package systems.fervento.sportsclub.entity;

import lombok.Getter;

@Getter
public enum TennisFieldType {
    RED_CLAY(50.0f),
    GRASS(60.0f),
    CEMENT(70.0f);

    private final float basePricePerHour;
    TennisFieldType(final float basePricePerHour) {
        this.basePricePerHour = basePricePerHour;
    }
}
