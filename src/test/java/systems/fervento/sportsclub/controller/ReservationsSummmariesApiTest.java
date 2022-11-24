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

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@DisplayName("SportsFacility REST API")
public class ReservationsSummmariesApiTest extends SpringDataJpaTest {
    @Autowired
    MockMvc mockMvc;

    @Autowired
    ObjectMapper mapper;

    @Nested
    @DisplayName("Endpoint /sports-facilities/{sportsFacilityId}/reservations-summaries")
    class SportsFacilitiesReservationsSummariesEndPoint {
        @Test
        @DisplayName("GET /sports-facilities/id/reservations-summaries?start_date=2022-11-23T08:31:23.641Z&end_date=2022-11-23T15:31:23.641Z")
        void testSportsFacilitiesReservationsSummaries() throws Exception {
            mockMvc.perform(MockMvcRequestBuilders
                .get("/sports-facilities/" + sportsFacilityEntity1.getId() + "/reservations-summaries?start_date=2022-11-23T08:31:23.641Z&end_date=2022-11-23T15:31:23.641Z")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isCreated());
        }
    }

}
