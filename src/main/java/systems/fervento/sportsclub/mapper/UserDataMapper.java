package systems.fervento.sportsclub.mapper;

import org.mapstruct.Context;
import org.mapstruct.Mapper;
import systems.fervento.sportsclub.data.UserData;
import systems.fervento.sportsclub.entity.UserEntity;

@Mapper(componentModel = "spring", uses = {AddressDataMapper.class, SportsFieldDataMapper.class, BillingDetailsDataMapper.class})
public interface UserDataMapper {
    @DoIgnore
    default UserData map(UserEntity userEntity) {
        return map(userEntity, new CycleAvoidingMappingContext());
    }

    UserData map(
        UserEntity userEntity,
        @Context CycleAvoidingMappingContext cycleAvoidingMappingContext
    );
}
