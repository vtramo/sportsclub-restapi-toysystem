package systems.fervento.sportsclub.data;

import lombok.*;

@Setter
@Getter
@EqualsAndHashCode(callSuper = true)
@AllArgsConstructor
@NoArgsConstructor
public class TennisFieldData extends SportsFieldData {
    private String tennisFieldType;
}
