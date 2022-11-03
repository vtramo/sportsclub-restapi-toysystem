package systems.fervento.sportsclub.mapper;

import org.mapstruct.InheritInverseConfiguration;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;
import systems.fervento.sportsclub.data.UserData;
import systems.fervento.sportsclub.openapi.model.User;

@Mapper(uses = {AddressApiMapper.class})
public interface UserApiMapper {
    UserApiMapper INSTANCE = Mappers.getMapper(UserApiMapper.class);

    @Mapping(target = "address", source = "homeAddress")
    User mapToUserApi(UserData userData);

    @InheritInverseConfiguration
    UserData mapToUserData(User user);
}
