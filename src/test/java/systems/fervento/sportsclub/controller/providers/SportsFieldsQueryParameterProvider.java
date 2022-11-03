package systems.fervento.sportsclub.controller.providers;

import org.junit.jupiter.params.provider.Arguments;

import java.util.stream.Stream;

import static org.junit.jupiter.params.provider.Arguments.arguments;

public abstract class SportsFieldsQueryParameterProvider {

    static Stream<Arguments> testGetSportsFieldsFilteredBySportProvider() {
        return Stream.of(
            arguments("SOCCER", 1),
            arguments("TENNIS", 1),
            arguments("BASKET", 1),
            arguments("VOLLEYBALL", 0)
        );
    }
}
