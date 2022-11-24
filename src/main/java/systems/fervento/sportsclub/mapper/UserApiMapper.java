package systems.fervento.sportsclub.mapper;

import org.mapstruct.InheritInverseConfiguration;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import systems.fervento.sportsclub.data.UserData;
import systems.fervento.sportsclub.openapi.model.User;

@Mapper(componentModel = "spring", uses = {AddressApiMapper.class})
public interface UserApiMapper {
    @Mapping(target = "address", source = "homeAddress")
    User mapToUserApi(UserData userData);

    @InheritInverseConfiguration
    UserData mapToUserData(User user);
}
