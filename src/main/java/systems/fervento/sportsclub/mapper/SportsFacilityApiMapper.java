package systems.fervento.sportsclub.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;
import systems.fervento.sportsclub.data.SportsFacilityData;
import systems.fervento.sportsclub.openapi.model.SportsFacility;
import systems.fervento.sportsclub.openapi.model.SportsFacilityWithSportsFields;

@Mapper(componentModel = "spring", uses = {AddressApiMapper.class, SportsFieldApiMapper.class})
public interface SportsFacilityApiMapper {
    @Mapping(target = "totalSportsFields", expression = "java(sportsFacilityData.getSportsFields().size())")
    @Mapping(target = "ownerId", source = "owner.id")
    SportsFacility map(SportsFacilityData sportsFacilityData);
    @Mapping(target = "totalSportsFields", expression = "java(sportsFacilityData.getSportsFields().size())")
    @Mapping(target = "ownerId", source = "owner.id")
    SportsFacilityWithSportsFields mapToSportsFacilityWithSportsFields(SportsFacilityData sportsFacilityData);
}
