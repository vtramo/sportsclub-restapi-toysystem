package systems.fervento.sportsclub.mapper;

import org.mapstruct.Context;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;
import systems.fervento.sportsclub.data.SportsFieldPriceListData;
import systems.fervento.sportsclub.entity.SportsFieldPriceListEntity;
import systems.fervento.sportsclub.repository.SportsFacilityRepository;

@Mapper(uses = {SportsFacilityRepository.class, SportsFieldEntityMapper.class})
public interface SportsFieldPriceListEntityMapper {
    SportsFieldPriceListEntityMapper INSTANCE = Mappers.getMapper(SportsFieldPriceListEntityMapper.class);

    @DoIgnore
    default SportsFieldPriceListEntity map(SportsFieldPriceListData sportsFieldPriceListData) {
        return mapToSportsFieldPriceListEntity(sportsFieldPriceListData, new CycleAvoidingMappingContext());
    }

    SportsFieldPriceListEntity mapToSportsFieldPriceListEntity(
        SportsFieldPriceListData sportsFieldPriceListData,
        @Context CycleAvoidingMappingContext cycleAvoidingMappingContext
    );
}
