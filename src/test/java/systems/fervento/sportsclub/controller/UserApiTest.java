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

@SpringBootTest
@AutoConfigureMockMvc
@DisplayName("User REST API")
public class UserApiTest {
    @Autowired
    MockMvc mockMvc;

    @Autowired
    ObjectMapper mapper;

    @Nested
    @DisplayName("Endpoint /users")
    class UsersEndpoint {

        class UserRequestBody implements Serializable {
            String username;
            String password;
            String email;
            String firstName;
            String lastName;
            String fiscalCode;
            Address address = new Address();
            class Address {
                String state;
                String city;
                String streetName;
                String streetNumber;
                String postcode;
            }
        }

        @Test
        void testPostCreateUsersWithValidBody() throws Exception {
            var userRequestBody = new UserRequestBody();
            userRequestBody.username = "bonek";
            userRequestBody.password = "123qweasd";
            userRequestBody.email = "vv.tramo@gmail.com";
            userRequestBody.firstName = "Vincenzo";
            userRequestBody.lastName = "Tramo";
            userRequestBody.fiscalCode = "TRMVCN99C11E791Y";
            userRequestBody.address.city = "Afragola (NA)";
            userRequestBody.address.state = "Italia";
            userRequestBody.address.streetName = "Via Vittorio Bachelet n° 32";
            userRequestBody.address.streetNumber = "32";
            userRequestBody.address.postcode = "80021";


            mapper.configure(SerializationFeature.WRAP_ROOT_VALUE, false);
            mapper.setVisibility(PropertyAccessor.FIELD, JsonAutoDetect.Visibility.ANY);
            var objectWriter = mapper.writer().withDefaultPrettyPrinter();
            var userRequestBodyJsonString = objectWriter.writeValueAsString(userRequestBody);

            mockMvc.perform(MockMvcRequestBuilders
                .post("/users")
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(userRequestBodyJsonString))
                .andExpect(jsonPath("$.id", is(notNullValue())))
                .andExpect(jsonPath("$.username", is(equalTo("bonek"))))
                .andExpect(jsonPath("$.address.streetName", is(equalTo("Via Vittorio Bachelet n° 32"))));
        }
    }
}
