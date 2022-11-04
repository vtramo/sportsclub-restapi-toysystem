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
@DisplayName("User REST API")
public class UserApiTest extends SpringDataJpaTest {
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
        @DisplayName("when POST /users with valid valid User body then 201 and return the created user")
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
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", is(notNullValue())))
                .andExpect(jsonPath("$.username", is(equalTo("bonek"))))
                .andExpect(jsonPath("$.address.streetName", is(equalTo("Via Vittorio Bachelet n° 32"))));
        }
    }

    @Nested
    @DisplayName("Endpoint /users/{ownerId}/notifications")
    class UserByIdNotificationsEndpoint {
        @Test
        @DisplayName("when GET /users/1000/notifications?pageNo=0&pageSize=10 then 200 and return all user notifications")
        void testGetAllUserNotificationsById() throws Exception {
            mockMvc.perform(MockMvcRequestBuilders
                .get("/users/" + userEntity.getId() + "/notifications")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.pageNo", is(equalTo(0))))
                .andExpect(jsonPath("$.pageSize", is(equalTo(10))))
                .andExpect(jsonPath("$.notifications", hasSize(3)));
        }

        @Test
        @DisplayName("when GET /users/1000/notifications?has_been_read=true then 200 and return all read user notifications")
        void testGetAllReadUserNotificationsById() throws Exception {
            mockMvc.perform(MockMvcRequestBuilders
                .get("/users/" + userEntity.getId() + "/notifications?has_been_read=true")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.notifications", hasSize(1)));
        }

        @Test
        @DisplayName("when GET /users/1000/notifications?has_been_read=false then 200 and return all unread user notifications")
        void testGetAllUnReadUserNotificationsById() throws Exception {
            mockMvc.perform(MockMvcRequestBuilders
                .get("/users/" + userEntity.getId() + "/notifications?has_been_read=false")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.notifications", hasSize(2)));
        }
    }
}
