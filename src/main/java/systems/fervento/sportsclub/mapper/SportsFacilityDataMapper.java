package systems.fervento.sportsclub.mapper;

import org.mapstruct.Context;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;
import systems.fervento.sportsclub.data.SportsFacilityData;
import systems.fervento.sportsclub.entity.SportsFacilityEntity;

@Mapper(componentModel = "spring", uses = {AddressDataMapper.class, UserDataMapper.class, SportsFieldDataMapper.class})
public interface SportsFacilityDataMapper {
    @DoIgnore
    default SportsFacilityData mapToSportsFacilityData(SportsFacilityEntity sportsFacilityEntity) {
        return mapToSportsFacilityData(sportsFacilityEntity, new CycleAvoidingMappingContext());
    }

    @Mapping(target = "totalSportsField", expression = "java(sportsFacilityEntity.getSportsFields().size())")
    SportsFacilityData mapToSportsFacilityData(
        SportsFacilityEntity sportsFacilityEntity,
        @Context CycleAvoidingMappingContext cycleAvoidingMappingContext
    );
}
