package systems.fervento.sportsclub.exception;

public class ResourceNotFoundException extends RuntimeException {
    private static final long serialVersionUID = 5071646428281007891L;

    public ResourceNotFoundException(String message) {
        super(message);
    }
}
