package systems.fervento.sportsclub;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication(
    scanBasePackages = "systems.fervento.sportsclub"
)
@EnableScheduling
public class SportsClubApp {
    public static void main(String[] args) {
        SpringApplication.run(SportsClubApp.class, args);
    }
}
