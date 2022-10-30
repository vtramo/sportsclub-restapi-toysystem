package systems.fervento.sportsclub.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;
import systems.fervento.sportsclub.data.SportsFacilityData;
import systems.fervento.sportsclub.openapi.model.SportsFacility;
import systems.fervento.sportsclub.openapi.model.SportsFacilityWithSportsFields;

@Mapper(uses = AddressApiMapper.class)
public interface SportsFacilityApiMapper {
    SportsFacilityApiMapper INSTANCE = Mappers.getMapper(SportsFacilityApiMapper.class);

    @Mapping(target = "totalSportsFields", expression = "java(sportsFacilityData.getSportsFields().size())")
    @Mapping(target = "ownerId", source = "owner.id")
    SportsFacility map(SportsFacilityData sportsFacilityData);
    @Mapping(target = "totalSportsFields", expression = "java(sportsFacilityData.getSportsFields().size())")
    @Mapping(target = "ownerId", source = "owner.id")
    SportsFacilityWithSportsFields mapToSportsFacilityWithSportsFields(SportsFacilityData sportsFacilityData);
}
