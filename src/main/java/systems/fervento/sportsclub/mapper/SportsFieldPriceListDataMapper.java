package systems.fervento.sportsclub.mapper;

import org.mapstruct.Context;
import org.mapstruct.InheritInverseConfiguration;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;
import systems.fervento.sportsclub.data.SportsFieldPriceListData;
import systems.fervento.sportsclub.entity.SportsFieldPriceListEntity;

@Mapper(uses = {SportsFieldDataMapper.class})
public interface SportsFieldPriceListDataMapper {
    SportsFieldPriceListDataMapper INSTANCE = Mappers.getMapper(SportsFieldPriceListDataMapper.class);

    @DoIgnore
    default SportsFieldPriceListData map(SportsFieldPriceListEntity sportsFieldPriceListEntity) {
        return map(sportsFieldPriceListEntity, new CycleAvoidingMappingContext());
    }

    @DoIgnore
    default SportsFieldPriceListEntity map(SportsFieldPriceListData sportsFieldPriceListData) {
        return map(sportsFieldPriceListData, new CycleAvoidingMappingContext());
    }

    SportsFieldPriceListData map(
        SportsFieldPriceListEntity sportsFieldPriceListEntity,
        @Context CycleAvoidingMappingContext cycleAvoidingMappingContext
    );

    @InheritInverseConfiguration
    SportsFieldPriceListEntity map(
        SportsFieldPriceListData sportsFieldPriceListData,
        @Context CycleAvoidingMappingContext cycleAvoidingMappingContext
    );
}
