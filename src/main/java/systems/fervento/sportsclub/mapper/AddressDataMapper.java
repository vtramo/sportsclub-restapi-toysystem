package systems.fervento.sportsclub.mapper;

import org.mapstruct.InheritInverseConfiguration;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;
import systems.fervento.sportsclub.data.AddressData;
import systems.fervento.sportsclub.entity.Address;

@Mapper
public abstract class AddressDataMapper {
    public static final AddressDataMapper INSTANCE = Mappers.getMapper(AddressDataMapper.class);

    @Mapping(source = "city.name", target = "city")
    @Mapping(source = "city.country", target = "country")
    @Mapping(source = "city.postalCode", target = "postalCode")
    public abstract AddressData map(Address address);

    @InheritInverseConfiguration
    public abstract Address map(AddressData addressData);
}
