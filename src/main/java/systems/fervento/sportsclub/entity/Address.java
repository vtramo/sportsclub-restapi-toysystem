package systems.fervento.sportsclub.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.AttributeOverride;
import javax.persistence.Column;
import javax.persistence.Embeddable;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Embeddable
public class Address {
    @NotNull
    @NotBlank
    @AttributeOverride(
        name = "name",
        column = @Column(name = "city", nullable = false)
    )
    private City city;

    @NotNull
    @NotBlank
    @Column(nullable = false)
    private String streetName;

    @NotNull
    @NotBlank
    @Column(nullable = false, length = 8)
    private String streetNumber;
}
