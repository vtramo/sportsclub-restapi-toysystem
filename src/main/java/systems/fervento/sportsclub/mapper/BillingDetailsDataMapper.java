package systems.fervento.sportsclub.mapper;

import org.mapstruct.Context;
import org.mapstruct.InheritInverseConfiguration;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;
import systems.fervento.sportsclub.data.BillingDetailsData;
import systems.fervento.sportsclub.data.CreditCardData;
import systems.fervento.sportsclub.entity.BillingDetailsEntity;
import systems.fervento.sportsclub.entity.CreditCardEntity;

@Mapper(uses = {UserDataMapper.class, AddressDataMapper.class, SportsFieldDataMapper.class})
public interface BillingDetailsDataMapper {
    BillingDetailsDataMapper INSTANCE = Mappers.getMapper(BillingDetailsDataMapper.class);

    default BillingDetailsData convertToBillingDetailsData(
            BillingDetailsEntity billingDetailsEntity,
            @Context CycleAvoidingMappingContext cycleAvoidingMappingContext
    ) {
        if (billingDetailsEntity instanceof CreditCardEntity) {
            return map((CreditCardEntity) billingDetailsEntity, cycleAvoidingMappingContext);
        } else {
            return null;
        }
    }

    default BillingDetailsEntity convertToBillingDetailsEntity(
            BillingDetailsData billingDetailsData,
            @Context CycleAvoidingMappingContext cycleAvoidingMappingContext
    ) {
        if (billingDetailsData instanceof CreditCardData) {
            return map((CreditCardData) billingDetailsData, cycleAvoidingMappingContext);
        } else {
            return null;
        }
    }


    @DoIgnore
    default BillingDetailsData toBillingDetailsData(BillingDetailsEntity billingDetailsEntity) {
        return convertToBillingDetailsData(billingDetailsEntity, new CycleAvoidingMappingContext());
    }

    @Mapping(target = "ownerId", source = "owner.id")
    CreditCardData map(CreditCardEntity creditCardEntity, @Context CycleAvoidingMappingContext cycleAvoidingMappingContext);

    @InheritInverseConfiguration
    CreditCardEntity map(CreditCardData creditCardData, @Context CycleAvoidingMappingContext cycleAvoidingMappingContext);
}
