package systems.fervento.sportsclub.mapper;

import org.mapstruct.Context;
import org.mapstruct.Mapper;
import systems.fervento.sportsclub.data.*;
import systems.fervento.sportsclub.entity.*;

@Mapper(componentModel = "spring", uses = {AddressEntityMapper.class, BillingDetailsEntityMapper.class})
public interface SportsFieldEntityMapper {

    default SportsFieldEntity map(
        SportsFieldData sportsFieldData,
        @Context CycleAvoidingMappingContext cycleAvoidingMappingContext
    ) {
        return convertToSportsFieldEntity(sportsFieldData, cycleAvoidingMappingContext);
    }

    @DoIgnore
    default SportsFieldEntity map(SportsFieldData sportsFieldData) {
        return convertToSportsFieldEntity(sportsFieldData, new CycleAvoidingMappingContext());
    }

    @DoIgnore
    default SportsFieldEntity convertToSportsFieldEntity(
        SportsFieldData sportsFieldData,
        CycleAvoidingMappingContext cycleAvoidingMappingContext
    ) {
        if (sportsFieldData instanceof SoccerFieldData) {
            return map((SoccerFieldData) sportsFieldData, cycleAvoidingMappingContext);
        } else if (sportsFieldData instanceof VolleyballFieldData) {
            return map((VolleyballFieldData) sportsFieldData, cycleAvoidingMappingContext);
        } else if (sportsFieldData instanceof TennisFieldData) {
            return map((TennisFieldData) sportsFieldData, cycleAvoidingMappingContext);
        } else if (sportsFieldData instanceof BasketballFieldData) {
            return map((BasketballFieldData) sportsFieldData, cycleAvoidingMappingContext);
        } else {
            return null;
        }
    }

    @DoIgnore
    SoccerFieldEntity map(
        SoccerFieldData soccerFieldData,
        @Context CycleAvoidingMappingContext cycleAvoidingMappingContext
    );

    @DoIgnore
    TennisFieldEntity map(
        TennisFieldData tennisFieldData,
        @Context CycleAvoidingMappingContext cycleAvoidingMappingContext
    );

    @DoIgnore
    BasketballFieldEntity map(
        BasketballFieldData basketballFieldData,
        @Context CycleAvoidingMappingContext cycleAvoidingMappingContext
    );

    @DoIgnore
    VolleyballFieldEntity map(
        VolleyballFieldData volleyballFieldData,
        @Context CycleAvoidingMappingContext cycleAvoidingMappingContext
    );
}
