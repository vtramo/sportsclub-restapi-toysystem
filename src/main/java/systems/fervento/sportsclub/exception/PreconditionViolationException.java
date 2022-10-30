package systems.fervento.sportsclub.exception;

public class PreconditionViolationException extends RuntimeException {
    private static final long serialVersionUID = 5071646428281007896L;

    public PreconditionViolationException(String message) {
        super(message);
    }
}
