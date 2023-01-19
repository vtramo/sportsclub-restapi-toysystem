package systems.fervento.sportsclub.mapper;

import org.mapstruct.*;
import org.springframework.data.domain.Page;
import systems.fervento.sportsclub.data.*;
import systems.fervento.sportsclub.openapi.model.*;

@Mapper(componentModel = "spring")
public interface SportsFieldApiMapper {
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
    @Mapping(target = "sport", expression = "java(\"SoccerField\")")
    @Mapping(target = "soccerFieldType", ignore = true)
    SoccerField mapToSportsFieldApi(SoccerFieldData soccerFieldData);

    @Mapping(target = "sportsFacilityId", source = "sportsFacility.id")
    @Mapping(target = "isIndoor", source = "indoor")
    @Mapping(target = "sport", expression = "java(\"BasketballField\")")
    BasketballField mapToSportsFieldApi(BasketballFieldData basketballFieldData);

    @Mapping(target = "sportsFacilityId", source = "sportsFacility.id")
    @Mapping(target = "isIndoor", source = "indoor")
    @Mapping(target = "sport", expression = "java(\"TennisField\")")
    TennisField mapToSportsFieldApi(TennisFieldData tennisFieldData);

    @Mapping(target = "sportsFacilityId", source = "sportsFacility.id")
    @Mapping(target = "isIndoor", source = "indoor")
    @Mapping(target = "sport", expression = "java(\"VolleyballField\")")
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

    default SportsFieldsPage mapToSportsFieldsPage(Page<SportsFieldData> sportsFieldsDataPage) {
        return mapToSportsFieldsPage(1, sportsFieldsDataPage);
    }

    @Mapping(target = "pageNo", expression = "java(sportsFieldDataPage.getNumber())")
    @Mapping(target = "pageSize", expression = "java(sportsFieldDataPage.getSize())")
    @Mapping(target = "totalPages", expression = "java(sportsFieldDataPage.getTotalPages())")
    @Mapping(target = "totalElements", expression = "java(sportsFieldDataPage.getTotalElements())")
    @Mapping(target = "last", expression = "java(sportsFieldDataPage.isLast())")
    @Mapping(target = "sportsFields", ignore = true)
    @DoIgnore
    SportsFieldsPage mapToSportsFieldsPage(Integer dummy, Page<SportsFieldData> sportsFieldDataPage);
}
