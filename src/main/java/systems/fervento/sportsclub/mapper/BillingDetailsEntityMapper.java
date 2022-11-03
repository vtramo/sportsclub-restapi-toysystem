package systems.fervento.sportsclub.mapper;

import org.mapstruct.Context;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.stereotype.Component;
import systems.fervento.sportsclub.data.BillingDetailsData;
import systems.fervento.sportsclub.data.CreditCardData;
import systems.fervento.sportsclub.entity.BillingDetailsEntity;
import systems.fervento.sportsclub.entity.CreditCardEntity;

@Mapper(componentModel = "spring", uses = UserEntityRepositoryMapperQualifier.class)
@Component
public abstract class BillingDetailsEntityMapper {
    public BillingDetailsEntity mapToBillingDetailsEntity(
        BillingDetailsData billingDetailsData,
        @Context CycleAvoidingMappingContext cycleAvoidingMappingContext
    ) {
        if (billingDetailsData instanceof CreditCardData) {
            return mapToCreditCardEntity((CreditCardData) billingDetailsData, cycleAvoidingMappingContext);
        } else {
            return null;
        }
    }

    @DoIgnore
    public BillingDetailsEntity mapToBillingDetailsEntity(BillingDetailsData billingDetailsEntity) {
        return mapToBillingDetailsEntity(billingDetailsEntity, new CycleAvoidingMappingContext());
    }

    @Mapping(target = "owner", source = "ownerId", qualifiedByName = "getUserEntityById")
    public abstract CreditCardEntity mapToCreditCardEntity(
        CreditCardData creditCardData,
        @Context CycleAvoidingMappingContext cycleAvoidingMappingContext
    );
}
