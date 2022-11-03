package systems.fervento.sportsclub.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;
import systems.fervento.sportsclub.data.AddressData;
import systems.fervento.sportsclub.entity.Address;

@Mapper
public interface AddressEntityMapper {
    AddressEntityMapper MAPPER = Mappers.getMapper(AddressEntityMapper.class);

    @Mapping(target = "city.country", source = "country")
    @Mapping(target = "city.postalCode", source = "postalCode")
    @Mapping(target = "city.name", source = "city")
    Address mapToAddressEntity(AddressData city);
}
