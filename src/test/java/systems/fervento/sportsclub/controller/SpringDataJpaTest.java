package systems.fervento.sportsclub.controller;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.TestInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import systems.fervento.sportsclub.entity.*;
import systems.fervento.sportsclub.repository.NotificationRepository;
import systems.fervento.sportsclub.repository.ReservationRepository;
import systems.fervento.sportsclub.repository.SportsFacilityRepository;
import systems.fervento.sportsclub.repository.UserRepository;

import java.time.ZonedDateTime;
import java.util.List;

@SpringBootTest
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
abstract class SpringDataJpaTest {
    @Autowired
    SportsFacilityRepository sportsFacilityRepository;
    @Autowired
    NotificationRepository notificationRepository;
    @Autowired
    ReservationRepository reservationRepository;

    @Autowired
    UserRepository userRepository;
    Address address;
    UserEntity userEntity;
    SportsFieldEntity sportsFieldEntity1, sportsFieldEntity2, sportsFieldEntity3;
    SportsFacilityEntity sportsFacilityEntity1, sportsFacilityEntity2;
    SportsFieldPriceListEntity sportsFieldPriceListEntity;
    CreditCardEntity creditCardEntity;
    List<NotificationEntity> notificationsUserEntity1;
    List<ReservationEntity> reservationsUserEntity1;

    @BeforeAll
    void setupDatabase() {
        address = new Address();
        address.setStreetNumber("32");
        address.setStreetName("Via Vittorio Bachelet");
        City city = new City();
        city.setCountry("Italia");
        city.setName("Afragola (NA)");
        city.setPostalCode("80021");
        address.setCity(city);

        userEntity = new UserEntity();
        userEntity.setUsername("bonek");
        userEntity.setPassword("ciao");
        userEntity.setFirstName("Vincenzo");
        userEntity.setLastName("Tramo");
        userEntity.setFiscalCode("TRMVCN99C11E791Y");
        userEntity.setEmail("vv.tramo@gmail.com");
        userEntity.setHomeAddress(address);

        creditCardEntity = new CreditCardEntity("AAAAAAAAAAAAAAAA", "BBBBB", "CCCC");
        userEntity.addBillingDetails(creditCardEntity);
        creditCardEntity.setOwner(userEntity);

        sportsFacilityEntity1 = new SportsFacilityEntity("Sports Club 2022", "666");
        sportsFacilityEntity1.setAddress(address);
        userEntity.addSportsFacility(sportsFacilityEntity1);
        sportsFacilityEntity1.setOwner(userEntity);

        sportsFacilityEntity2 = new SportsFacilityEntity("New Sports Club 2022", "777");
        sportsFacilityEntity2.setAddress(address);
        sportsFacilityEntity2.setOwner(userEntity);

        sportsFieldEntity1 = new SoccerFieldEntity("Eden", SoccerFieldType.ELEVEN_A_SIDE, true);
        sportsFieldEntity2 = new BasketballFieldEntity("Basket Field", false);
        sportsFieldEntity3 = new TennisFieldEntity("Tennis Field", TennisFieldType.CEMENT, false);
        sportsFieldEntity1.setSportsFacility(sportsFacilityEntity1);
        sportsFieldEntity2.setSportsFacility(sportsFacilityEntity2);
        sportsFieldEntity3.setSportsFacility(sportsFacilityEntity2);

        sportsFacilityEntity1.getSportsFields().add(sportsFieldEntity1);
        sportsFacilityEntity2.getSportsFields().add(sportsFieldEntity2);
        sportsFacilityEntity2.getSportsFields().add(sportsFieldEntity3);

        sportsFieldPriceListEntity = new SportsFieldPriceListEntity(75.0f, 5.0f);
        sportsFieldEntity1.setPriceList(sportsFieldPriceListEntity);

        notificationsUserEntity1 = List.of(
            new NotificationEntity(null, ZonedDateTime.now(), true, "ciao", userEntity),
            new NotificationEntity(null, ZonedDateTime.now(), false, "ciao2", userEntity),
            new NotificationEntity(null, ZonedDateTime.now(), false, "ciao3", userEntity)
        );

        var dateTimeRange = new DateTimeRange(ZonedDateTime.now(), ZonedDateTime.now().plusDays(1));
        var dateTimeRange2 = new DateTimeRange(ZonedDateTime.now().minusDays(3), ZonedDateTime.now().minusDays(2));
        reservationsUserEntity1 = List.of(
            new ReservationEntity(dateTimeRange, 10f, userEntity),
            new ReservationEntity(dateTimeRange, 10f, userEntity),
            new ReservationEntity(dateTimeRange, 10f, userEntity),
            new ReservationEntity(dateTimeRange2, 30f, userEntity)
        );
        reservationsUserEntity1.get(0).setSportsField(sportsFieldEntity1);
        reservationsUserEntity1.get(1).setSportsField(sportsFieldEntity1);
        reservationsUserEntity1.get(2).setSportsField(sportsFieldEntity2);
        reservationsUserEntity1.get(3).setReservationStatus(ReservationStatus.ACCEPTED);
        reservationsUserEntity1.get(3).setSportsField(sportsFieldEntity3);

        ReservationRatingEntity reservationRatingEntity1 = new ReservationRatingEntity();
        reservationRatingEntity1.setDescription("Wonderful");
        reservationRatingEntity1.setScore(4);

        ReservationRatingEntity reservationRatingEntity2 = new ReservationRatingEntity();
        reservationRatingEntity2.setDescription("Beautiful");
        reservationRatingEntity2.setScore(5);

        reservationsUserEntity1.get(0).setRating(reservationRatingEntity1);
        reservationsUserEntity1.get(1).setRating(reservationRatingEntity2);

        ReservationRatingEntity reservationRatingEntity3 = new ReservationRatingEntity();
        reservationRatingEntity3.setDescription(" ");
        reservationRatingEntity3.setScore(3);

        reservationsUserEntity1.get(3).setRating(reservationRatingEntity3);

        userRepository.save(userEntity);
        notificationRepository.saveAll(notificationsUserEntity1);
        sportsFacilityRepository.save(sportsFacilityEntity2);
        sportsFacilityRepository.save(sportsFacilityEntity1);
        reservationRepository.saveAll(reservationsUserEntity1);
    }
}
