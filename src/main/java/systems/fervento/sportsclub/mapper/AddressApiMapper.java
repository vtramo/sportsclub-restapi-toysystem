package systems.fervento.sportsclub.mapper;

import org.mapstruct.InheritInverseConfiguration;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;
import systems.fervento.sportsclub.data.AddressData;
import systems.fervento.sportsclub.openapi.model.Address;

@Mapper
public interface AddressApiMapper {
    AddressApiMapper INSTANCE = Mappers.getMapper(AddressApiMapper.class);

    @Mapping(target = "state", source = "country")
    @Mapping(target = "postcode", source = "postalCode")
    Address mapToAddressApi(AddressData addressData);

    @InheritInverseConfiguration
    AddressData mapToAddressData(Address address);
}
