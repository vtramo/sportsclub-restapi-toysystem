package systems.fervento.sportsclub;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(
    scanBasePackages = "systems.fervento.sportsclub"
)
public class SportsClubApp {
    public static void main(String[] args) {
        SpringApplication.run(SportsClubApp.class, args);
    }
}
