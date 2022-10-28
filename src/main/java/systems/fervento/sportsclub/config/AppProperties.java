package systems.fervento.sportsclub.config;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.boot.context.properties.ConfigurationProperties;

import org.springframework.validation.annotation.Validated;

import javax.validation.constraints.NotNull;

@ConfigurationProperties(prefix = "app.config")
@Validated // Necessario per validazione!app.config
@NoArgsConstructor
@Data
public class AppProperties {
    @NotNull
    private String name;
}