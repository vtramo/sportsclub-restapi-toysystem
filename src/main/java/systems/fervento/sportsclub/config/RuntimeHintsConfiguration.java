package systems.fervento.sportsclub.config;

import org.springframework.aot.hint.MemberCategory;
import org.springframework.aot.hint.RuntimeHints;
import org.springframework.aot.hint.RuntimeHintsRegistrar;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.ImportRuntimeHints;

import java.util.List;

@Configuration
@ImportRuntimeHints(RuntimeHintsConfiguration.RunTimeHintsRegistrarImpl.class)
public class RuntimeHintsConfiguration {
    static class RunTimeHintsRegistrarImpl implements RuntimeHintsRegistrar {

        @Override
        public void registerHints(RuntimeHints hints, ClassLoader classLoader) {
            List.of(
                systems.fervento.sportsclub.utils.RFC3339DateFormat.class,
                systems.fervento.sportsclub.openapi.model.TennisField.class,
                systems.fervento.sportsclub.openapi.model.TennisFieldAllOf.class,
                systems.fervento.sportsclub.openapi.model.SoccerField.class,
                systems.fervento.sportsclub.openapi.model.SoccerFieldAllOf.class,
                systems.fervento.sportsclub.openapi.model.BasketballField.class,
                systems.fervento.sportsclub.openapi.model.VolleyballField.class,
                systems.fervento.sportsclub.openapi.model.SportsFieldPriceList.class,
                com.zaxxer.hikari.HikariConfig.class
            ).forEach(type -> hints.reflection().registerType(type, MemberCategory.values()));
        }
    }
}
