package com.homequest.user.agent.dto;

import java.util.Map;

import lombok.Builder;
import lombok.Data;

/** Public landing-page card for an agent (no auth). */
@Data
@Builder
public class AgentCardResponse {
    private Long id;
    private String userPublicId;
    private String firstName;
    private String lastName;
    private String phone;
    private String licenseNumber;
    private String profileImage;
    private String companyName;
    private int listings;
    private double rating;
    private String bio;
    private String location;
    private Map<String, String> social;
}
