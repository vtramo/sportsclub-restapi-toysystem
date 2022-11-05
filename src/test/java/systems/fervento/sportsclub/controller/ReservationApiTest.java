package systems.fervento.sportsclub.controller;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.PropertyAccessor;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import org.junit.jupiter.api.BeforeEach;
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
@DisplayName("Reservations REST API")
public class ReservationApiTest extends SpringDataJpaTest {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    ObjectMapper mapper;

    @Nested
    @DisplayName("Endpoint /reservations")
    class ReservationsEndpoint {

        class ReservationRequestBody implements Serializable {
            long sportsFieldId;
            long ownerId;
            DateRange dateRange = new DateRange();
            class DateRange {
                String startDate;
                String endDate;
            }
        }

        @BeforeEach
        void configureMapper() {
            mapper.configure(SerializationFeature.WRAP_ROOT_VALUE, false);
            mapper.setVisibility(PropertyAccessor.FIELD, JsonAutoDetect.Visibility.ANY);
        }

        @Test
        @DisplayName("when POST /reservations with valid body then return 201 and the created reservation")
        void testPostReservationsWithValidBody() throws Exception {
            final var reservationRequestBody = new ReservationRequestBody();
            reservationRequestBody.sportsFieldId = sportsFieldEntity1.getId();
            reservationRequestBody.ownerId = userEntity.getId();
            reservationRequestBody.dateRange.startDate = "2022-11-05T16:00:00Z";
            reservationRequestBody.dateRange.endDate = "2022-11-05T17:00:00Z";

            var objectWriter = mapper.writer().withDefaultPrettyPrinter();
            var reservationRequestBodyJsonString = objectWriter.writeValueAsString(reservationRequestBody);

            mockMvc.perform(MockMvcRequestBuilders
                .post("/reservations")
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(reservationRequestBodyJsonString))
                .andExpect(jsonPath("$.sportsFieldId", is(equalTo(sportsFieldEntity1.getId().intValue()))))
                .andExpect(jsonPath("$.id", is(notNullValue())))
                .andExpect(jsonPath("$.ownerId", is(equalTo(userEntity.getId().intValue()))))
                .andExpect(jsonPath("$.price", is(equalTo(80.0))))
                .andExpect(status().isCreated());
        }

        @Test
        @DisplayName("when POST /reservations with invalid start date then return 400 bad request")
        void testPostReservationWithInvalidStartDate() throws Exception {
            final var reservationRequestBody = new ReservationRequestBody();
            reservationRequestBody.sportsFieldId = sportsFieldEntity1.getId();
            reservationRequestBody.ownerId = userEntity.getId();
            reservationRequestBody.dateRange.startDate = "2022-11-05a16:00:00Z";
            reservationRequestBody.dateRange.endDate = "2022-11-05T17:00:00Z";

            var objectWriter = mapper.writer().withDefaultPrettyPrinter();
            var reservationRequestBodyJsonString = objectWriter.writeValueAsString(reservationRequestBody);

            mockMvc.perform(MockMvcRequestBuilders
                .post("/reservations")
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(reservationRequestBodyJsonString))
                .andExpect(status().isBadRequest());
        }
    }
}
