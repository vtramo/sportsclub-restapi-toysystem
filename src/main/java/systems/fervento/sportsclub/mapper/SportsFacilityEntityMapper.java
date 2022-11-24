package systems.fervento.sportsclub.mapper;

import org.mapstruct.Context;
import org.mapstruct.Mapper;
import systems.fervento.sportsclub.data.SportsFacilityData;
import systems.fervento.sportsclub.entity.SportsFacilityEntity;

@Mapper(componentModel = "spring", uses = {AddressEntityMapper.class, SportsFieldEntityMapper.class, UserEntityMapper.class})
public interface SportsFacilityEntityMapper {
    @DoIgnore
    default SportsFacilityEntity mapToSportsFacilityEntity(SportsFacilityData sportsFieldData) {
        return mapToSportsFacilityEntity(sportsFieldData, new CycleAvoidingMappingContext());
    }

    SportsFacilityEntity mapToSportsFacilityEntity(
        SportsFacilityData sportsFacilityData,
        @Context CycleAvoidingMappingContext cycleAvoidingMappingContext
    );
}
