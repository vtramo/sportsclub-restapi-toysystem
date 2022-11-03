package systems.fervento.sportsclub.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import systems.fervento.sportsclub.data.*;
import systems.fervento.sportsclub.entity.Address;
import systems.fervento.sportsclub.entity.*;
import systems.fervento.sportsclub.mapper.*;
import systems.fervento.sportsclub.openapi.model.*;
import systems.fervento.sportsclub.repository.UserRepository;

import java.util.Optional;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;

@SpringBootTest
public class MapperTest {
    AddressDataMapper addressDataMapper = AddressDataMapper.INSTANCE;
    UserDataMapper userDataMapper = UserDataMapper.INSTANCE;
    SportsFacilityDataMapper sportsFacilityDataMapper = SportsFacilityDataMapper.INSTANCE;
    SportsFieldDataMapper sportsFieldDataMapper = SportsFieldDataMapper.INSTANCE;
    SportsFieldApiMapper sportsFieldApiMapper = SportsFieldApiMapper.INSTANCE;
    SportsFieldPriceListDataMapper sportsFieldPriceListDataMapper = SportsFieldPriceListDataMapper.INSTANCE;
    BillingDetailsDataMapper billingDetailsDataMapper = BillingDetailsDataMapper.INSTANCE;

    SportsFacilityApiMapper sportsFacilityApiMapper = SportsFacilityApiMapper.INSTANCE;

    @Mock
    UserRepository mockedUserRepository;

    @Autowired
    BillingDetailsEntityMapper billingDetailsEntityMapper;
    Address address;
    UserEntity userEntity;
    SportsFieldEntity sportsFieldEntity, sportsFieldEntity2;
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
        userEntity.setEmail("vv.tramo@gmail.com");
        userEntity.setHomeAddress(address);

        creditCardEntity = new CreditCardEntity("AAAAAAAAAAAAAAAA", "BBBBB", "CCCC");
        userEntity.addBillingDetails(creditCardEntity);

        sportsFacilityEntity = new SportsFacilityEntity("Sports Club 2022", "666");
        sportsFacilityEntity.setAddress(address);
        sportsFacilityEntity.setOwner(userEntity);
        userEntity.addSportsFacility(sportsFacilityEntity);

        sportsFieldEntity = new SoccerFieldEntity("Eden", SoccerFieldType.ELEVEN_A_SIDE, true);
        sportsFieldEntity.setSportsFacility(sportsFacilityEntity);

        sportsFieldEntity2 = new TennisFieldEntity("Tennis Club", TennisFieldType.CEMENT, false);

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
        SportsFacilityData sportsFacilityData = sportsFacilityDataMapper.mapToSportsFacilityData(sportsFacilityEntity);
        SportsFacility sportsFacility = sportsFacilityApiMapper.map(sportsFacilityData);
        SportsFacilityWithSportsFields sportsFacilityWithSportsFields =
                sportsFacilityApiMapper.mapToSportsFacilityWithSportsFields(sportsFacilityData);
        assertEquals("Afragola (NA)", sportsFacilityData.getAddress().getCity());
        assertEquals(1, sportsFacilityData.getSportsFields().size());
        assertEquals(sportsFacility.getId(), sportsFacilityData.getId());
        assertEquals(sportsFacilityData.getTotalSportsField(), 1);
        assertThat(sportsFacilityWithSportsFields.getSportsFields(), hasSize(1));
    }

    @Test
    void testMappingSportsField() {
        SportsFieldData sportsFieldData = sportsFieldDataMapper.mapToSportsFieldData(sportsFieldEntity);
        SoccerField sportsField = (SoccerField) sportsFieldApiMapper.mapToSportsFieldApi(sportsFieldData);
        assertTrue(sportsFieldData instanceof SoccerFieldData);
        assertEquals(sportsFieldData.getSportsFacility().getId(), sportsFacilityEntity.getId());
        assertEquals(sportsFieldData.getPriceList().getId(), sportsFieldPriceListEntity.getId());
        assertThat(((SoccerFieldData) sportsFieldData).getSoccerFieldType(), is(equalTo("ELEVEN_A_SIDE")));
        assertThat(sportsField.getSport(), is(equalTo(SportEnum.SOCCER)));
        assertThat(sportsField.getPriceList(), is(notNullValue()));
        assertThat(sportsField.getPriceList().getPricePerHour(), is(equalTo(75.0f)));

        SportsFieldData sportsFieldData2 = sportsFieldDataMapper.mapToSportsFieldData(sportsFieldEntity2);
        TennisField sportsField2 = (TennisField) sportsFieldApiMapper.mapToSportsFieldApi(sportsFieldData2);
        assertThat(sportsField2.getSport(), is(equalTo(SportEnum.TENNIS)));
        SportsFieldData sportsFieldDataMappedFromSportsFieldApi = sportsFieldApiMapper.mapToSportsFieldData(sportsField2);
        assertEquals(sportsFieldDataMappedFromSportsFieldApi, sportsFieldData2);
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

        MockitoAnnotations.initMocks(this);
        when(mockedUserRepository.findById(anyLong())).thenReturn(Optional.of(userEntity));
        BillingDetailsEntity billingDetailsEntity2 = billingDetailsEntityMapper.mapToBillingDetailsEntity(billingDetailsData);
        assertThat(billingDetailsEntity2.getOwner().getId(), is(equalTo(billingDetailsEntity.getOwner().getId())));
    }
}
