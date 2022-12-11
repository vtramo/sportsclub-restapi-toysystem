package systems.fervento.sportsclub.controller;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.hasSize;
import static org.junit.jupiter.api.Assertions.assertAll;

@SpringBootTest
public class SportsFacilityRepositoryTest extends SpringDataJpaTest {
    @Test
    void testFindAllByTotalNumberSportsFieldsBetweenQuery() {
        var sportsFacilities1 = sportsFacilityRepository.findAllByTotalNumberSportsFieldsBetween(-1, 3);
        var sportsFacilities2 = sportsFacilityRepository.findAllByTotalNumberSportsFieldsBetween(1, 3);
        var sportsFacilities3 = sportsFacilityRepository.findAllByTotalNumberSportsFieldsBetween(0, 0);
        assertAll(
            () -> assertThat(sportsFacilities1, hasSize(2)),
            () -> assertThat(sportsFacilities2, hasSize(1)),
            () -> assertThat(sportsFacilities3, hasSize(0))
        );
    }

    @Test
    void testFindAllByOwnerIdAndTotalNumberSportsFieldsBetweenQuery() {
        var sportsFacilities =
            sportsFacilityRepository.findAllByOwnerIdAndTotalNumberSportsFieldsBetween(
                userEntity.getId(), 0, 2
            );
        assertThat(sportsFacilities, hasSize(1));
    }
}
