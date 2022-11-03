package systems.fervento.sportsclub.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.MethodSource;
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
@DisplayName("Sports Fields Endpoints")
public class SportsFieldApiTest extends SpringDataJpaTest {
    @Autowired
    MockMvc mockMvc;

    @Autowired
    ObjectMapper mapper;

    @Nested
    @DisplayName("Endpoint /sports-fields")
    class SportsFieldsEndpoint {
        @Test
        @DisplayName("when GET /sports-fields then 200 OK and return all sports fields")
        void testGetAllSportsFields() throws Exception {
            mockMvc.perform(MockMvcRequestBuilders
            .get("/sports-fields")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(3)));
        }

        @Test
        @DisplayName("when GET /sports-fields?filter_by_sport=SOCCER then 200 OK and return filtered sports fields")
        void testGetSportsFieldsFilteredBySport() throws Exception {
            mockMvc.perform(MockMvcRequestBuilders
                .get("/sports-fields?filter_by_sport=SOCCER")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)));
        }

        @ParameterizedTest
        @MethodSource("systems.fervento.sportsclub.controller.providers.SportsFieldsQueryParameterProvider#testGetSportsFieldsFilteredBySportProvider")
        @DisplayName("when GET /sports-fields?filter_by_sport=VOLLEYBALL then 200 OK and return filtered sports fields")
        void testGetSportsFieldsFilteredBySport(String sport, int expectedNumberOfSportsFields) throws Exception {
            mockMvc.perform(MockMvcRequestBuilders
                .get("/sports-fields?filter_by_sport=" + sport)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(expectedNumberOfSportsFields)));
        }
    }
}
