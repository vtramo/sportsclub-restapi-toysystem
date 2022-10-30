package systems.fervento.sportsclub.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;
import systems.fervento.sportsclub.openapi.model.Error;

import javax.validation.ConstraintViolation;
import javax.validation.ConstraintViolationException;
import java.util.Set;

@ControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(value = {PreconditionViolationException.class})
    public ResponseEntity<Error> handlePreconditionViolationException(
        PreconditionViolationException preconditionViolationException
    ) {
        final var error = new Error();
        error.setStatus(HttpStatus.BAD_REQUEST.value());
        error.detail(preconditionViolationException.getMessage());
        error.setTitle("Violation precondition(s)");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    @ExceptionHandler(value = {ConstraintViolationException.class})
    public ResponseEntity<Error> handleConstraintViolationException(
        ConstraintViolationException constraintViolationException
    ) {
        final var error = new Error();
        error.setStatus(HttpStatus.BAD_REQUEST.value());
        error.detail(buildValidationErrorMessage(constraintViolationException.getConstraintViolations()));
        error.setTitle("Violation precondition(s)");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    private String buildValidationErrorMessage(Set<ConstraintViolation<?>> violations) {
        return violations
            .stream()
            .map(violation -> violation.getPropertyPath() + " " + violation.getMessage() + "!")
            .reduce("", (s1, s2) -> s1 + (s1.isEmpty() ? "" : " ") + s2);
    }

    @ExceptionHandler(value = {ResourceNotFoundException.class})
    public ResponseEntity<Error> handleResourceNotFoundException(
        ResourceNotFoundException resourceNotFoundException
    ) {
        final var error = new Error();
        error.setStatus(HttpStatus.NOT_FOUND.value());
        error.detail(resourceNotFoundException.getMessage());
        error.setTitle("Resource not found");
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }
}
