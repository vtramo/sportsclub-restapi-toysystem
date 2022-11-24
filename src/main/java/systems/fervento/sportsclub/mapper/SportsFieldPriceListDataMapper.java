package systems.fervento.sportsclub.mapper;

import org.mapstruct.Context;
import org.mapstruct.Mapper;
import systems.fervento.sportsclub.data.SportsFieldPriceListData;
import systems.fervento.sportsclub.entity.SportsFieldPriceListEntity;

@Mapper(componentModel = "spring", uses = {SportsFieldDataMapper.class})
public interface SportsFieldPriceListDataMapper {
    @DoIgnore
    default SportsFieldPriceListData map(SportsFieldPriceListEntity sportsFieldPriceListEntity) {
        return map(sportsFieldPriceListEntity, new CycleAvoidingMappingContext());
    }

    SportsFieldPriceListData map(
        SportsFieldPriceListEntity sportsFieldPriceListEntity,
        @Context CycleAvoidingMappingContext cycleAvoidingMappingContext
    );
}
