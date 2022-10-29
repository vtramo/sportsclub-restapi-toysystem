package systems.fervento.sportsclub.mapper;

import org.mapstruct.Context;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;
import systems.fervento.sportsclub.data.BillingDetailsData;
import systems.fervento.sportsclub.data.CreditCardData;
import systems.fervento.sportsclub.entity.BillingDetailsEntity;
import systems.fervento.sportsclub.entity.CreditCardEntity;

@Mapper(uses = {UserDataMapper.class, AddressDataMapper.class, SportsFieldDataMapper.class})
public interface BillingDetailsDataMapper {
    BillingDetailsDataMapper INSTANCE = Mappers.getMapper(BillingDetailsDataMapper.class);

    default BillingDetailsData convertToBillingDetailsData(BillingDetailsEntity billingDetailsEntity) {
        if (billingDetailsEntity instanceof CreditCardEntity) {
            return map((CreditCardEntity) billingDetailsEntity, new CycleAvoidingMappingContext());
        } else {
            return null;
        }
    }

    CreditCardData map(CreditCardEntity creditCardEntity, @Context CycleAvoidingMappingContext cycleAvoidingMappingContext);
}
