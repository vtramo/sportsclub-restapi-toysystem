package systems.fervento.sportsclub.utils.validator;

import org.springframework.validation.Errors;
import org.springframework.validation.Validator;

public class HelloValidator implements Validator {

    @Override
    public boolean supports(Class<?> aClass) {
//        return Hello.class.equals(aClass);
        return true;
    }

    @Override
    public void validate(Object o, Errors errors) {
//        Hello hello = (Hello)o;
//        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "name", "field.required");
//        if (Objects.equals("greenZebra", hello.getName())) {
//            errors.rejectValue("name", "zooexception");
//        }
    }
}
