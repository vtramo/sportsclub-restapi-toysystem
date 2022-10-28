package systems.fervento.sportsclub.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper()
public abstract class UserApiMapper {
    public static final UserApiMapper INSTANCE = Mappers.getMapper(UserApiMapper.class);

    /*public abstract User map(UserData userData);*/
}
