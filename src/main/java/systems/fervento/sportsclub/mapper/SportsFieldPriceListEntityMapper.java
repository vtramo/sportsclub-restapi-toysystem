package systems.fervento.sportsclub.mapper;

import org.mapstruct.Context;
import org.mapstruct.Mapper;
import systems.fervento.sportsclub.data.SportsFieldPriceListData;
import systems.fervento.sportsclub.entity.SportsFieldPriceListEntity;
import systems.fervento.sportsclub.repository.SportsFacilityRepository;

@Mapper(componentModel = "spring", uses = {SportsFacilityRepository.class, SportsFieldEntityMapper.class})
public interface SportsFieldPriceListEntityMapper {
    @DoIgnore
    default SportsFieldPriceListEntity map(SportsFieldPriceListData sportsFieldPriceListData) {
        return mapToSportsFieldPriceListEntity(sportsFieldPriceListData, new CycleAvoidingMappingContext());
    }

    SportsFieldPriceListEntity mapToSportsFieldPriceListEntity(
        SportsFieldPriceListData sportsFieldPriceListData,
        @Context CycleAvoidingMappingContext cycleAvoidingMappingContext
    );
}
