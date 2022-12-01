package systems.fervento.sportsclub.config;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.boot.context.properties.ConfigurationProperties;

import org.springframework.context.annotation.Configuration;
import org.springframework.validation.annotation.Validated;

import javax.validation.constraints.NotNull;

@Configuration
@ConfigurationProperties(prefix = "app.config")
@Validated // Necessario per validazione!app.config
@NoArgsConstructor
@Data
public class AppProperties {
    @NotNull
    private String name;
}