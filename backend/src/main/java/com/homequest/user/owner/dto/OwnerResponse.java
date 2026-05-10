package com.homequest.user.owner.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class OwnerResponse {
    private Long id;
    private String userPublicId;
    private String firstName;
    private String lastName;
    private String phone;
    private String nationalId;
}
