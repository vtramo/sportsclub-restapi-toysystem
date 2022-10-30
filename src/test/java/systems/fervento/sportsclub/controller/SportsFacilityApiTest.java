package systems.fervento.sportsclub.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import static org.hamcrest.Matchers.hasSize;
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
                .andExpect(jsonPath("$", hasSize(1)));
        }

        @Test
        @DisplayName("when GET /sports-facilities?total_sports_field.gt=0 then 200 OK and return filtered sports facilities")
        void testGetAllSportsFacilitiesByTotalSportsFieldsGraterThan() throws Exception {
            mockMvc.perform(MockMvcRequestBuilders
                .get("/sports-facilities?total_sports_field.gt=0"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)));
        }
    }
}
