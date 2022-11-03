package systems.fervento.sportsclub.mapper;

import org.mapstruct.Context;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;
import systems.fervento.sportsclub.data.UserData;
import systems.fervento.sportsclub.entity.UserEntity;

@Mapper(uses = {BillingDetailsEntityMapper.class, SportsFieldEntityMapper.class, AddressEntityMapper.class})
public interface UserEntityMapper {
    UserEntityMapper INSTANCE = Mappers.getMapper(UserEntityMapper.class);

    @DoIgnore
    default UserEntity mapToUserEntity(UserData userData) {
        return mapToUserEntity(userData, new CycleAvoidingMappingContext());
    }

    UserEntity mapToUserEntity(UserData userData, @Context CycleAvoidingMappingContext cycleAvoidingMappingContext);
}
