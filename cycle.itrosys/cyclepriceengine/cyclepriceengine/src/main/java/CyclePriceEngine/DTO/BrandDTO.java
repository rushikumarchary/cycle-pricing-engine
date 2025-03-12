package CyclePriceEngine.DTO;


import CyclePriceEngine.Constants.Status;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Date;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class BrandDTO {
    private String message;
    private Long brandId;
    private String brandName;
    private Status status;
    private String updatedBy;



}
