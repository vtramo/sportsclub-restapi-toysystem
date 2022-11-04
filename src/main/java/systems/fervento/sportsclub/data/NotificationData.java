package systems.fervento.sportsclub.data;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NotificationData {
    private Long id;
    private LocalDateTime createdOn;
    private boolean hasBeenRead;
    private String description;
    private UserData owner;
}
