package systems.fervento.sportsclub.mapper;

import org.mapstruct.Mapper;
import systems.fervento.sportsclub.openapi.model.SportEnum;

import java.util.HashMap;
import java.util.Map;

@Mapper(componentModel = "spring")
public interface SportsEnumMapper {

    Map<String, SportEnum> bySport = new HashMap<>() {
        {
            put("soccer", SportEnum.SOCCER);
            put("basket", SportEnum.BASKET);
            put("tennis", SportEnum.TENNIS);
            put("volleyball", SportEnum.VOLLEYBALL);
            put("SoccerField", SportEnum.SOCCER);
            put("TennisField", SportEnum.TENNIS);
            put("BasketField", SportEnum.BASKET);
            put("VolleyballField", SportEnum.VOLLEYBALL);
        }
    };

    default SportEnum mapToSportsEnum(String sport) {
        return bySport.get(sport);
    }
}
