package systems.fervento.sportsclub.entity;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


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
