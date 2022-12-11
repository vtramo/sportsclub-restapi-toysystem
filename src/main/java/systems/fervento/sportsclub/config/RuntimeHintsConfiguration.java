package systems.fervento.sportsclub.config;

import org.springframework.aot.hint.MemberCategory;
import org.springframework.aot.hint.RuntimeHints;
import org.springframework.aot.hint.RuntimeHintsRegistrar;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.ImportRuntimeHints;

@Configuration
@ImportRuntimeHints(RuntimeHintsConfiguration.RunTimeHintsRegistrarImpl.class)
public class RuntimeHintsConfiguration {
    static class RunTimeHintsRegistrarImpl implements RuntimeHintsRegistrar {

        @Override
        public void registerHints(RuntimeHints hints, ClassLoader classLoader) {
            hints.reflection().registerType(systems.fervento.sportsclub.utils.RFC3339DateFormat.class, MemberCategory.values());
            hints.reflection().registerType(systems.fervento.sportsclub.openapi.model.TennisField.class, MemberCategory.values());
            hints.reflection().registerType(systems.fervento.sportsclub.openapi.model.TennisFieldAllOf.class, MemberCategory.values());
            hints.reflection().registerType(systems.fervento.sportsclub.openapi.model.SoccerField.class, MemberCategory.values());
            hints.reflection().registerType(systems.fervento.sportsclub.openapi.model.SoccerFieldAllOf.class, MemberCategory.values());
            hints.reflection().registerType(systems.fervento.sportsclub.openapi.model.BasketballField.class, MemberCategory.values());
            hints.reflection().registerType(systems.fervento.sportsclub.openapi.model.VolleyballField.class, MemberCategory.values());
            hints.reflection().registerType(systems.fervento.sportsclub.openapi.model.SportsFieldPriceList.class, MemberCategory.values());
        }
    }
}
