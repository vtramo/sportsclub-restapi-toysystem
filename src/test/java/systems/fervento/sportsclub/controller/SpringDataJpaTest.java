package systems.fervento.sportsclub.controller;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.TestInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import systems.fervento.sportsclub.entity.*;
import systems.fervento.sportsclub.repository.SportsFacilityRepository;
import systems.fervento.sportsclub.repository.UserRepository;

@SpringBootTest
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
abstract class SpringDataJpaTest {
    @Autowired
    SportsFacilityRepository sportsFacilityRepository;
    @Autowired
    UserRepository userRepository;
    Address address;
    UserEntity userEntity;
    SportsFieldEntity sportsFieldEntity;
    SportsFacilityEntity sportsFacilityEntity1, sportsFacilityEntity2;
    SportsFieldPriceListEntity sportsFieldPriceListEntity;
    CreditCardEntity creditCardEntity;
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

        sportsFieldEntity = new SoccerFieldEntity("Eden", SoccerFieldType.ELEVEN_A_SIDE, true);
        sportsFieldEntity.setSportsFacility(sportsFacilityEntity1);

        sportsFacilityEntity1.getSportsFields().add(sportsFieldEntity);

        sportsFieldPriceListEntity = new SportsFieldPriceListEntity(75.0f, 5.0f);
        sportsFieldEntity.setPriceList(sportsFieldPriceListEntity);

        sportsFacilityEntity2 = new SportsFacilityEntity("New Sports Club 2022", "777");
        sportsFacilityEntity2.setAddress(address);
        sportsFacilityEntity2.setOwner(userEntity);

        userRepository.save(userEntity);
        sportsFacilityRepository.save(sportsFacilityEntity2);
        sportsFacilityRepository.save(sportsFacilityEntity1);
    }
}
