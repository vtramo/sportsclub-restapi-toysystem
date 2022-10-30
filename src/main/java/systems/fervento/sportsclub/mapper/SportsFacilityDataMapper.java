package systems.fervento.sportsclub.mapper;

import org.mapstruct.Context;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;
import systems.fervento.sportsclub.data.SportsFacilityData;
import systems.fervento.sportsclub.entity.SportsFacilityEntity;

@Mapper(uses = {AddressDataMapper.class, UserDataMapper.class, SportsFieldDataMapper.class})
public interface SportsFacilityDataMapper {
    SportsFacilityDataMapper INSTANCE = Mappers.getMapper(SportsFacilityDataMapper.class);

    @DoIgnore
    default SportsFacilityData map(SportsFacilityEntity sportsFacilityEntity) {
        return map(sportsFacilityEntity, new CycleAvoidingMappingContext());
    }

    @Mapping(target = "totalSportsField", expression = "java(sportsFacilityEntity.getSportsFields().size())")
    SportsFacilityData map(
        SportsFacilityEntity sportsFacilityEntity,
        @Context CycleAvoidingMappingContext cycleAvoidingMappingContext
    );
}
