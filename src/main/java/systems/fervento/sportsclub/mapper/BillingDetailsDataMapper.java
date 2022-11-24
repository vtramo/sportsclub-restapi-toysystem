package systems.fervento.sportsclub.mapper;

import org.mapstruct.Context;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;
import systems.fervento.sportsclub.data.BillingDetailsData;
import systems.fervento.sportsclub.data.CreditCardData;
import systems.fervento.sportsclub.entity.BillingDetailsEntity;
import systems.fervento.sportsclub.entity.CreditCardEntity;

@Mapper(componentModel = "spring", uses = {UserDataMapper.class, AddressDataMapper.class, SportsFieldDataMapper.class})
public interface BillingDetailsDataMapper {
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

    @DoIgnore
    default BillingDetailsData toBillingDetailsData(BillingDetailsEntity billingDetailsEntity) {
        return convertToBillingDetailsData(billingDetailsEntity, new CycleAvoidingMappingContext());
    }

    @Mapping(target = "ownerId", source = "owner.id")
    CreditCardData map(CreditCardEntity creditCardEntity, @Context CycleAvoidingMappingContext cycleAvoidingMappingContext);
}
