package systems.fervento.sportsclub.data;

import lombok.*;
import systems.fervento.sportsclub.entity.TennisFieldType;

@Setter
@Getter
@EqualsAndHashCode(callSuper = true)
@AllArgsConstructor
@NoArgsConstructor
public class TennisFieldData extends SportsFieldData {
    private TennisFieldType tennisFieldType;
}
