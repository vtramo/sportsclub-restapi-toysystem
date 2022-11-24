package systems.fervento.sportsclub.mapper;

import org.mapstruct.Context;
import org.mapstruct.Mapper;
import systems.fervento.sportsclub.data.UserData;
import systems.fervento.sportsclub.entity.UserEntity;

@Mapper(componentModel = "spring", uses = {BillingDetailsEntityMapper.class, SportsFieldEntityMapper.class, AddressEntityMapper.class})
public interface UserEntityMapper {
    @DoIgnore
    default UserEntity mapToUserEntity(UserData userData) {
        return mapToUserEntity(userData, new CycleAvoidingMappingContext());
    }

    UserEntity mapToUserEntity(UserData userData, @Context CycleAvoidingMappingContext cycleAvoidingMappingContext);
}
