package systems.fervento.sportsclub.mapper;

import org.mapstruct.Context;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import systems.fervento.sportsclub.data.*;
import systems.fervento.sportsclub.entity.*;

@Mapper(componentModel = "spring", uses = {AddressDataMapper.class, SportsFieldPriceListData.class, BillingDetailsDataMapper.class})
public interface SportsFieldDataMapper {
    default SportsFieldData mapToSportsFieldData(
        SportsFieldEntity sportsFieldEntity,
        @Context CycleAvoidingMappingContext cycleAvoidingMappingContext
    ) {
        return convertToSportsFieldData(sportsFieldEntity, cycleAvoidingMappingContext);
    }

    @DoIgnore
    default SportsFieldData mapToSportsFieldData(SportsFieldEntity sportsFieldEntity) {
        return convertToSportsFieldData(sportsFieldEntity, new CycleAvoidingMappingContext());
    }

    @DoIgnore
    default SportsFieldData convertToSportsFieldData(
        SportsFieldEntity sportsFieldEntity,
        CycleAvoidingMappingContext cycleAvoidingMappingContext
    ) {
        if (sportsFieldEntity instanceof SoccerFieldEntity) {
            return map((SoccerFieldEntity) sportsFieldEntity, cycleAvoidingMappingContext);
        } else if (sportsFieldEntity instanceof VolleyballFieldEntity) {
            return map((VolleyballFieldEntity) sportsFieldEntity, cycleAvoidingMappingContext);
        } else if (sportsFieldEntity instanceof TennisFieldEntity) {
            return map((TennisFieldEntity) sportsFieldEntity, cycleAvoidingMappingContext);
        } else if (sportsFieldEntity instanceof BasketballFieldEntity) {
            return map((BasketballFieldEntity) sportsFieldEntity, cycleAvoidingMappingContext);
        } else {
            return null;
        }
    }


    @DoIgnore
    @Mapping(target = "sportsFacilityId", source = "sportsFacility.id")
    SoccerFieldData map(
        SoccerFieldEntity soccerFieldEntity,
        @Context CycleAvoidingMappingContext cycleAvoidingMappingContext
    );

    @DoIgnore
    @Mapping(target = "sportsFacilityId", source = "sportsFacility.id")
    TennisFieldData map(
        TennisFieldEntity tennisFieldEntity,
        @Context CycleAvoidingMappingContext cycleAvoidingMappingContext
    );

    @DoIgnore
    @Mapping(target = "sportsFacilityId", source = "sportsFacility.id")
    BasketballFieldData map(
        BasketballFieldEntity basketballFieldEntity,
        @Context CycleAvoidingMappingContext cycleAvoidingMappingContext
    );

    @DoIgnore
    @Mapping(target = "sportsFacilityId", source = "sportsFacility.id")
    VolleyballFieldData map(
        VolleyballFieldEntity volleyballFieldEntity,
        @Context CycleAvoidingMappingContext cycleAvoidingMappingContext
    );
}
