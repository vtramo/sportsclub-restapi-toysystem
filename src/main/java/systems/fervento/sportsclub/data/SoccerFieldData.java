package systems.fervento.sportsclub.data;

import lombok.*;
import systems.fervento.sportsclub.entity.SoccerFieldType;

@Setter
@Getter
@EqualsAndHashCode(callSuper = true)
@AllArgsConstructor
@NoArgsConstructor
public class SoccerFieldData extends SportsFieldData {
    private SoccerFieldType soccerFieldType;
}
