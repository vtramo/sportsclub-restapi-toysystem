package systems.fervento.sportsclub.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import javax.validation.constraints.NotNull;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Embeddable
public class City {
    @NotNull
    @Column(nullable = false, length = 64)
    private String name;

    @NotNull
    @Column(nullable = false, length = 64)
    private String country;

    @NotNull
    @Column(nullable = false, length = 16)
    private String postalCode;
}
