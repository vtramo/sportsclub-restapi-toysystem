package systems.fervento.sportsclub.mapper;

import org.mapstruct.BeforeMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;
import systems.fervento.sportsclub.data.*;
import systems.fervento.sportsclub.openapi.model.*;

@Mapper
public interface SportsFieldApiMapper {
    SportsFieldApiMapper INSTANCE = Mappers.getMapper(SportsFieldApiMapper.class);

    default SportsField map(SportsFieldData sportsFieldData) {
        if (sportsFieldData instanceof SoccerFieldData) {
            return map((SoccerFieldData) sportsFieldData);
        } else if (sportsFieldData instanceof VolleyballFieldData) {
            return map((VolleyballFieldData) sportsFieldData);
        } else if (sportsFieldData instanceof BasketballFieldData) {
            return map((BasketballFieldData) sportsFieldData);
        } else if (sportsFieldData instanceof TennisFieldData) {
            return map((TennisFieldData) sportsFieldData);
        } else {
            return null;
        }
    }
    @DoIgnore
    default SportEnum fromValue(String sport) {
        return SportEnum.fromValue(sport);
    }
    @BeforeMapping
    default void beforeMappingSoccerFieldDataSetType(@MappingTarget SportsField sportsField, SoccerFieldData soccerFieldData) {
        SportsField.SoccerFieldTypeEnum soccerFieldType;
        if ("ELEVEN_A_SIDE".equals(soccerFieldData.getSoccerFieldType())) {
            soccerFieldType = SportsField.SoccerFieldTypeEnum._11_A_SIDE;
        } else if ("EIGHT_A_SIDE".equals(soccerFieldData.getSoccerFieldType())) {
            soccerFieldType = SportsField.SoccerFieldTypeEnum._8_A_SIDE;
        } else if ("FIVE_A_SIDE".equals(soccerFieldData.getSoccerFieldType())) {
            soccerFieldType = SportsField.SoccerFieldTypeEnum._5_A_SIDE;
        } else {
            throw new IllegalArgumentException();
        }
        sportsField.setSoccerFieldType(soccerFieldType);
    }

    @Mapping(target = "sport", expression = "java(fromValue(\"soccer\"))")
    @Mapping(target = "tennisFieldType", ignore = true)
    @Mapping(target = "sportsFacilityId", source = "sportsFacility.id")
    @Mapping(target = "isIndoor", source = "indoor")
    @Mapping(target = "soccerFieldType", ignore = true)
    SportsField map(SoccerFieldData soccerFieldData);

    @Mapping(target = "tennisFieldType", ignore = true)
    @Mapping(target = "soccerFieldType", ignore = true)
    @Mapping(target = "sportsFacilityId", source = "sportsFacility.id")
    @Mapping(target = "isIndoor", source = "indoor")
    @Mapping(target = "sport", expression = "java(fromValue(\"basket\"))")
    SportsField map(BasketballFieldData basketballFieldData);

    @Mapping(target = "soccerFieldType", ignore = true)
    @Mapping(target = "sportsFacilityId", source = "sportsFacility.id")
    @Mapping(target = "isIndoor", source = "indoor")
    @Mapping(target = "sport", expression = "java(fromValue(\"tennis\"))")
    SportsField map(TennisFieldData tennisFieldData);

    @Mapping(target = "soccerFieldType", ignore = true)
    @Mapping(target = "tennisFieldType", ignore = true)
    @Mapping(target = "sportsFacilityId", source = "sportsFacility.id")
    @Mapping(target = "isIndoor", source = "indoor")
    @Mapping(target = "sport", expression = "java(fromValue(\"volleyball\"))")
    SportsField map(VolleyballFieldData volleyballFieldData);
}
