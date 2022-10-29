package systems.fervento.sportsclub.mapper;

import org.mapstruct.Context;
import org.mapstruct.InheritInverseConfiguration;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;
import systems.fervento.sportsclub.data.*;
import systems.fervento.sportsclub.entity.*;

@Mapper(uses = {AddressDataMapper.class, SportsFieldPriceListData.class, BillingDetailsDataMapper.class})
public interface SportsFieldDataMapper {
    SportsFieldDataMapper INSTANCE = Mappers.getMapper(SportsFieldDataMapper.class);

    default SportsFieldData toSportsFieldData(
        SportsFieldEntity sportsFieldEntity,
        @Context CycleAvoidingMappingContext cycleAvoidingMappingContext
    ) {
        return convertToSportsFieldData(sportsFieldEntity, cycleAvoidingMappingContext);
    }

    default SportsFieldEntity toSportsFieldEntity(
        SportsFieldData sportsFieldData,
        @Context CycleAvoidingMappingContext cycleAvoidingMappingContext
    ) {
        return convertToSportsFieldEntity(sportsFieldData, cycleAvoidingMappingContext);
    }

    @DoIgnore
    default SportsFieldData toSportsFieldData(SportsFieldEntity sportsFieldEntity) {
        return convertToSportsFieldData(sportsFieldEntity, new CycleAvoidingMappingContext());
    }

    @DoIgnore
    default SportsFieldEntity toSportsFieldEntity(SportsFieldData sportsFieldData) {
        return convertToSportsFieldEntity(sportsFieldData, new CycleAvoidingMappingContext());
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
    @Mapping(target = "soccerFieldType", source = "soccerFieldType")
    SoccerFieldData map(
        SoccerFieldEntity soccerFieldEntity,
        @Context CycleAvoidingMappingContext cycleAvoidingMappingContext
    );

    @DoIgnore
    @InheritInverseConfiguration
    SoccerFieldEntity map(
        SoccerFieldData soccerFieldData,
        @Context CycleAvoidingMappingContext cycleAvoidingMappingContext
    );

    @DoIgnore
    @Mapping(target = "tennisFieldType", source = "tennisFieldType")
    TennisFieldData map(
        TennisFieldEntity tennisFieldEntity,
        @Context CycleAvoidingMappingContext cycleAvoidingMappingContext
    );

    @DoIgnore
    @InheritInverseConfiguration
    TennisFieldEntity map(
        TennisFieldData tennisFieldData,
        @Context CycleAvoidingMappingContext cycleAvoidingMappingContext
    );

    @DoIgnore
    BasketballFieldData map(
        BasketballFieldEntity basketballFieldEntity,
        @Context CycleAvoidingMappingContext cycleAvoidingMappingContext
    );

    @DoIgnore
    @InheritInverseConfiguration
    BasketballFieldEntity map(
        BasketballFieldData basketballFieldData,
        @Context CycleAvoidingMappingContext cycleAvoidingMappingContext
    );

    @DoIgnore
    VolleyballFieldData map(
        VolleyballFieldEntity volleyballFieldEntity,
        @Context CycleAvoidingMappingContext cycleAvoidingMappingContext
    );

    @DoIgnore
    @InheritInverseConfiguration
    VolleyballFieldEntity map(
        VolleyballFieldData volleyballFieldData,
        @Context CycleAvoidingMappingContext cycleAvoidingMappingContext
    );
}
