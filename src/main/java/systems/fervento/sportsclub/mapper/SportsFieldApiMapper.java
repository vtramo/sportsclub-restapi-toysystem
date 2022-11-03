package systems.fervento.sportsclub.mapper;

import org.mapstruct.*;
import org.mapstruct.factory.Mappers;
import systems.fervento.sportsclub.data.*;
import systems.fervento.sportsclub.openapi.model.*;

@Mapper
public interface SportsFieldApiMapper {
    SportsFieldApiMapper INSTANCE = Mappers.getMapper(SportsFieldApiMapper.class);

    default SportsField mapToSportsFieldApi(SportsFieldData sportsFieldData) {
        if (sportsFieldData instanceof SoccerFieldData) {
            return mapToSportsFieldApi((SoccerFieldData) sportsFieldData);
        } else if (sportsFieldData instanceof VolleyballFieldData) {
            return mapToSportsFieldApi((VolleyballFieldData) sportsFieldData);
        } else if (sportsFieldData instanceof BasketballFieldData) {
            return mapToSportsFieldApi((BasketballFieldData) sportsFieldData);
        } else if (sportsFieldData instanceof TennisFieldData) {
            return mapToSportsFieldApi((TennisFieldData) sportsFieldData);
        } else {
            return null;
        }
    }

    @BeforeMapping
    default void beforeMappingSoccerFieldDataSetType(@MappingTarget SoccerField soccerField, SoccerFieldData soccerFieldData) {
        SoccerField.SoccerFieldTypeEnum soccerFieldType;
        if ("ELEVEN_A_SIDE".equals(soccerFieldData.getSoccerFieldType())) {
            soccerFieldType = SoccerField.SoccerFieldTypeEnum._11_A_SIDE;
        } else if ("EIGHT_A_SIDE".equals(soccerFieldData.getSoccerFieldType())) {
            soccerFieldType = SoccerField.SoccerFieldTypeEnum._8_A_SIDE;
        } else if ("FIVE_A_SIDE".equals(soccerFieldData.getSoccerFieldType())) {
            soccerFieldType = SoccerField.SoccerFieldTypeEnum._5_A_SIDE;
        } else {
            throw new IllegalArgumentException();
        }
        soccerField.setSoccerFieldType(soccerFieldType);
    }

    @Mapping(target = "sportsFacilityId", source = "sportsFacility.id")
    @Mapping(target = "isIndoor", source = "indoor")
    @Mapping(target = "sport", ignore = true)
    @Mapping(target = "soccerFieldType", ignore = true)
    SoccerField mapToSportsFieldApi(SoccerFieldData soccerFieldData);

    @Mapping(target = "sportsFacilityId", source = "sportsFacility.id")
    @Mapping(target = "isIndoor", source = "indoor")
    @Mapping(target = "sport", ignore = true)
    BasketballField mapToSportsFieldApi(BasketballFieldData basketballFieldData);

    @Mapping(target = "sportsFacilityId", source = "sportsFacility.id")
    @Mapping(target = "isIndoor", source = "indoor")
    @Mapping(target = "sport", ignore = true)
    TennisField mapToSportsFieldApi(TennisFieldData tennisFieldData);

    @Mapping(target = "sportsFacilityId", source = "sportsFacility.id")
    @Mapping(target = "isIndoor", source = "indoor")
    @Mapping(target = "sport", ignore = true)
    VolleyballField mapToSportsFieldApi(VolleyballFieldData volleyballFieldData);
    
    default SportsFieldData mapToSportsFieldData(SportsField sportsField) {
        if (sportsField instanceof SoccerField) {
            return mapToSportsFieldData((SoccerField) sportsField);
        } else if (sportsField instanceof TennisField) {
            return mapToTennisFieldData((TennisField) sportsField);
        } else if (sportsField instanceof BasketballField) {
            return mapToBasketballFieldData((BasketballField) sportsField);
        } else if (sportsField instanceof VolleyballField) {
            return mapToVolleyballFieldData((VolleyballField) sportsField);
        } else {
            return null;
        }
    }

    @DoIgnore
    @InheritInverseConfiguration
    @Mapping(target = "sportsFacility", ignore = true)
    VolleyballFieldData mapToVolleyballFieldData(VolleyballField sportsField);

    @DoIgnore
    @InheritInverseConfiguration
    @Mapping(target = "sportsFacility", ignore = true)
    TennisFieldData mapToTennisFieldData(TennisField sportsField);
    
    @DoIgnore
    @InheritInverseConfiguration
    @Mapping(target = "sportsFacility", ignore = true)
    SoccerFieldData mapToSportsFieldData(SoccerField sportsField);
    
    @DoIgnore
    @InheritInverseConfiguration
    @Mapping(target = "sportsFacility", ignore = true)
    BasketballFieldData mapToBasketballFieldData(BasketballField sportsField);
}
