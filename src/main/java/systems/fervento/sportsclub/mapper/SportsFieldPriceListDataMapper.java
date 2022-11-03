package systems.fervento.sportsclub.mapper;

import org.mapstruct.Context;
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

    SportsFieldPriceListData map(
        SportsFieldPriceListEntity sportsFieldPriceListEntity,
        @Context CycleAvoidingMappingContext cycleAvoidingMappingContext
    );
}
