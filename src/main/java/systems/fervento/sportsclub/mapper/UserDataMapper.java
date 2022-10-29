package systems.fervento.sportsclub.mapper;

import org.mapstruct.Context;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;
import systems.fervento.sportsclub.data.UserData;
import systems.fervento.sportsclub.entity.UserEntity;

@Mapper(uses = {AddressDataMapper.class, SportsFieldDataMapper.class})
public interface UserDataMapper {
    UserDataMapper INSTANCE = Mappers.getMapper(UserDataMapper.class);

    @DoIgnore
    default UserData map(UserEntity userEntity) {
        return map(userEntity, new CycleAvoidingMappingContext());
    }
    UserData map(
        UserEntity userEntity,
        @Context CycleAvoidingMappingContext cycleAvoidingMappingContext
    );
}
