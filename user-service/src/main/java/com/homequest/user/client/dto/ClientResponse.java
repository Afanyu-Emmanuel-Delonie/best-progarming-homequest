package com.homequest.user.client.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ClientResponse {
    private Long id;
    private String userPublicId;
    private String firstName;
    private String lastName;
    private String phone;
}
