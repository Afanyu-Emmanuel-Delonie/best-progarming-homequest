package com.homequest.user.agent.dto;

import com.homequest.user.agent.model.AgentStatus;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AgentResponse {
    private Long id;
    private String userPublicId;
    private String firstName;
    private String lastName;
    private String phone;
    private String licenseNumber;
    private String profileImage;
    private Long companyId;
    private AgentStatus status;
}
