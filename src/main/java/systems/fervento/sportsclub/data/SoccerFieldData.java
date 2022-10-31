package systems.fervento.sportsclub.data;

import lombok.*;

@Setter
@Getter
@EqualsAndHashCode(callSuper = true)
@AllArgsConstructor
@NoArgsConstructor
public class SoccerFieldData extends SportsFieldData {
    private String soccerFieldType;
}
