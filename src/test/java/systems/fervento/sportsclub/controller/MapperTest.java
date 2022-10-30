package systems.fervento.sportsclub.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import systems.fervento.sportsclub.data.*;
import systems.fervento.sportsclub.entity.*;
import systems.fervento.sportsclub.mapper.*;
import systems.fervento.sportsclub.openapi.model.SportsFacility;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
public class MapperTest {
    AddressDataMapper addressDataMapper = AddressDataMapper.INSTANCE;
    UserDataMapper userDataMapper = UserDataMapper.INSTANCE;
    SportsFacilityDataMapper sportsFacilityDataMapper = SportsFacilityDataMapper.INSTANCE;
    SportsFieldDataMapper sportsFieldDataMapper = SportsFieldDataMapper.INSTANCE;
    SportsFieldPriceListDataMapper sportsFieldPriceListDataMapper = SportsFieldPriceListDataMapper.INSTANCE;
    BillingDetailsDataMapper billingDetailsDataMapper = BillingDetailsDataMapper.INSTANCE;
    SportsFacilityApiMapper sportsFacilityApiMapper = SportsFacilityApiMapper.INSTANCE;

    Address address;
    UserEntity userEntity;
    SportsFieldEntity sportsFieldEntity;
    SportsFacilityEntity sportsFacilityEntity;
    SportsFieldPriceListEntity sportsFieldPriceListEntity;
    CreditCardEntity creditCardEntity;

    @BeforeEach
    void setup() {
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
        userEntity.setId(10L);
        userEntity.setPassword("ciao");
        userEntity.setFirstName("Vincenzo");
        userEntity.setLastName("Tramo");
        userEntity.setFiscalCode("TRMVCN99C11E791Y");
        userEntity.setHomeAddress(address);

        creditCardEntity = new CreditCardEntity("AAAAAAAAAAAAAAAA", "BBBBB", "CCCC");
        userEntity.addBillingDetails(creditCardEntity);

        sportsFacilityEntity = new SportsFacilityEntity("Sports Club 2022", "666");
        sportsFacilityEntity.setAddress(address);
        userEntity.addSportsFacility(sportsFacilityEntity);

        sportsFieldEntity = new SoccerFieldEntity("Eden", SoccerFieldType.ELEVEN_A_SIDE, true);
        sportsFieldEntity.setSportsFacility(sportsFacilityEntity);

        sportsFacilityEntity.getSportsFields().add(sportsFieldEntity);

        sportsFieldPriceListEntity = new SportsFieldPriceListEntity(75.0f, 5.0f);
        sportsFieldEntity.setPriceList(sportsFieldPriceListEntity);
    }

    @Test
    void testMappingAddress() {
        AddressData addressData = addressDataMapper.map(address);
        assertEquals("Italia", addressData.getCountry());
    }

    @Test
    void testMappingUser() {
        UserData userData = userDataMapper.map(userEntity);
        assertEquals("80021", userData.getHomeAddress().getPostalCode());
        assertEquals(userEntity.getRegisteredOn(), userData.getRegisteredOn());
        assertEquals(userEntity.getSportsFacilities().size(), userData.getSportsFacilities().size());
        assertEquals(userEntity.getAllBillingDetails().size(), userData.getAllBillingDetails().size());
    }

    @Test
    void testMappingSportsFacility() {
        SportsFacilityData sportsFacilityData = sportsFacilityDataMapper.map(sportsFacilityEntity);
        SportsFacility sportsFacility = sportsFacilityApiMapper.map(sportsFacilityData);
        assertEquals("Afragola (NA)", sportsFacilityData.getAddress().getCity());
        assertEquals(1, sportsFacilityData.getSportsFields().size());
        assertEquals(sportsFacility.getId(), sportsFacilityData.getId());
        assertEquals(sportsFacilityData.getTotalSportsField(), 1);
    }

    @Test
    void testMappingSportsField() {
        SportsFieldData sportsFieldData = sportsFieldDataMapper.toSportsFieldData(sportsFieldEntity);
        assertTrue(sportsFieldData instanceof SoccerFieldData);
        assertEquals(sportsFieldData.getSportsFacility().getId(), sportsFacilityEntity.getId());
        assertEquals(sportsFieldData.getPriceList().getId(), sportsFieldPriceListEntity.getId());
    }

    @Test
    void testMappingSportsFieldPriceList() {
        SportsFieldPriceListData sportsFieldPriceListData = sportsFieldPriceListDataMapper.map(sportsFieldPriceListEntity);
        assertEquals(sportsFieldEntity.getId(), sportsFieldPriceListData.getSportsField().getId());
        assertEquals(sportsFieldPriceListData.getPriceIndoor(), sportsFieldPriceListEntity.getPriceIndoor());
    }

    @Test
    void testMappingBillingDetails() {
        BillingDetailsEntity billingDetailsEntity = userEntity.getAllBillingDetails().iterator().next();
        BillingDetailsData billingDetailsData = billingDetailsDataMapper.toBillingDetailsData(billingDetailsEntity);
        assertEquals(billingDetailsData.getId(), billingDetailsEntity.getId());
    }
}
