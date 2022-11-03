package systems.fervento.sportsclub.controller;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.PropertyAccessor;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import java.io.Serializable;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@DisplayName("SportsFacility REST API")
public class SportsFacilityApiTest extends SpringDataJpaTest {
    @Autowired
    MockMvc mockMvc;
    @Autowired
    ObjectMapper mapper;
    @Nested
    @DisplayName("Endpoint /sports-facilities")
    class SportsFacilitiesEndPoint {
        @Test
        @DisplayName("when GET /sports-facilities then 200 OK and return all sports facilities")
        void testGetAllSportsFacilities() throws Exception {
            mockMvc.perform(MockMvcRequestBuilders
                .get("/sports-facilities")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)));
        }

        @Test
        @DisplayName("when GET /sports-facilites?filter_by_owner_id=-1 then 400 BAD REQUEST")
        void testGetSportsFacilitiesByInvalidOwnerId() throws Exception {
            mockMvc.perform(MockMvcRequestBuilders
                .get("/sports-facilities?filter_by_owner_id=-1"))
                .andExpect(status().isBadRequest());
        }

        @Test
        @DisplayName("when GET /sports-facilities?total_sports_field.gt=2&total_sports_field.lt=1 then 400 BAD REQUEST")
        void testGetSportsFacilitiesWithInvalidTotalSportsFieldsRange() throws Exception {
            mockMvc.perform(MockMvcRequestBuilders
                .get("/sports-facilities?total_sports_field.gt=2&total_sports_field.lt=1"))
                .andExpect(status().isBadRequest());
        }

        @Test
        @DisplayName("when GET /sports-facilities?total_sports_field.lt=1 then 200 OK and return filtered sports facilities")
        void testGetAllSportsFacilitiesByTotalSportsFieldsLessThan() throws Exception {
            mockMvc.perform(MockMvcRequestBuilders
                .get("/sports-facilities?total_sports_field.lt=1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));
        }

        @Test
        @DisplayName("when GET /sports-facilities?total_sports_field.gt=0 then 200 OK and return filtered sports facilities")
        void testGetAllSportsFacilitiesByTotalSportsFieldsGraterThan() throws Exception {
            mockMvc.perform(MockMvcRequestBuilders
                .get("/sports-facilities?total_sports_field.gt=0"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].totalSportsFields", is(equalTo(1))));
        }
    }

    @Nested
    @DisplayName("Endpoint /sports-facilities/{sportsFacilityId}")
    class SportsFacilityByIdEndPoint {
        @Test
        @DisplayName("when GET /sports-facilities/-1 then 400 BAD REQUEST")
        void testGetSportsFacilitiesByInvalidId() throws Exception {
            mockMvc.perform(MockMvcRequestBuilders
                .get("/sports-facilities/-1"))
                .andExpect(status().isBadRequest());
        }

        @Test
        @DisplayName("when GET /sports-facilities/0 then 404 NOT FOUND")
        void testGetSportsFacilityByNonExistentId() throws Exception {
            mockMvc.perform(MockMvcRequestBuilders
                .get("/sports-facilities/0"))
                .andExpect(status().isNotFound());
        }

        @Test
        @DisplayName("when GET /sports-facilities/1001 then 200 OK and return a sports facility")
        void testGetSportsFacilityByValidId() throws Exception {
            mockMvc.perform(MockMvcRequestBuilders
                .get("/sports-facilities/" + sportsFacilityEntity1.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.sportsFields", hasSize(1)))
                .andExpect(jsonPath("$.totalSportsFields", is(equalTo(1))));
        }
    }

    @Nested
    @DisplayName("Endpoint /sports-facilities/{sportsFacilityId}/sports-fields")
    class SportsFacilityByIdSportsFields {

        class SportsFieldRequestBody implements Serializable {
            String name;
            String sport;
            boolean isIndoor;
            PriceList priceList = new PriceList();
            class PriceList {
                float pricePerHour;
            }
        }

        @Test
        @DisplayName("when POST /sports-facilities/1001/sports-fields with a valid body then 201 CREATED and return a sports field")
        void testPostSportsFacilitiesByValidIdWithValidSportsFieldBody() throws Exception {
            var sportsFieldRequestBody = new SportsFieldRequestBody();
            sportsFieldRequestBody.name = "Sports 2022";
            sportsFieldRequestBody.sport = "basket";
            sportsFieldRequestBody.isIndoor = true;
            sportsFieldRequestBody.priceList.pricePerHour = 75.0f;

            mapper.configure(SerializationFeature.WRAP_ROOT_VALUE, false);
            mapper.setVisibility(PropertyAccessor.FIELD, JsonAutoDetect.Visibility.ANY);
            var objectWriter = mapper.writer().withDefaultPrettyPrinter();
            var sportsFieldRequestBodyJsonString = objectWriter.writeValueAsString(sportsFieldRequestBody);

            mockMvc.perform(MockMvcRequestBuilders
                .post("/sports-facilities/" + sportsFacilityEntity1.getId() + "/sports-fields")
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(sportsFieldRequestBodyJsonString))
                .andExpect(jsonPath("$.sportsFacilityId", is(equalTo(sportsFacilityEntity1.getId().intValue()))))
                .andExpect(jsonPath("$.sport", is(equalTo("BasketballField"))));
        }
    }
}
