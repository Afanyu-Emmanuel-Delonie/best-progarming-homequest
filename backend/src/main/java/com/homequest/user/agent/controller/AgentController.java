package com.homequest.user.agent.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.homequest.user.agent.dto.AgentCardResponse;
import com.homequest.user.agent.dto.AgentRequest;
import com.homequest.user.agent.dto.AgentResponse;
import com.homequest.user.agent.model.AgentStatus;
import com.homequest.user.agent.service.AgentService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/agents")
@RequiredArgsConstructor
public class AgentController {

    private final AgentService agentService;

    @PostMapping("/me")
    @PreAuthorize("hasAuthority('ROLE_AGENT')")
    public ResponseEntity<AgentResponse> createMyProfile(@Valid @RequestBody AgentRequest request, Authentication auth) {
        return ResponseEntity.status(HttpStatus.CREATED).body(agentService.createProfile(getUserPublicId(auth), request));
    }

    @GetMapping("/me")
    @PreAuthorize("hasAuthority('ROLE_AGENT')")
    public ResponseEntity<AgentResponse> getMyProfile(Authentication auth) {
        return ResponseEntity.ok(agentService.getByUserPublicId(getUserPublicId(auth)));
    }

    @PutMapping("/me")
    @PreAuthorize("hasAuthority('ROLE_AGENT')")
    public ResponseEntity<AgentResponse> updateMyProfile(@Valid @RequestBody AgentRequest request, Authentication auth) {
        return ResponseEntity.ok(agentService.updateProfile(getUserPublicId(auth), request));
    }

    @GetMapping("/by-public-id/{publicId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<AgentResponse> getByPublicId(@PathVariable String publicId) {
        return ResponseEntity.ok(agentService.getByUserPublicId(publicId));
    }

    /** Public: top agents for marketing (no auth). */
    @GetMapping("/top")
    public ResponseEntity<List<AgentCardResponse>> getTopAgents(@RequestParam(defaultValue = "8") int limit) {
        return ResponseEntity.ok(agentService.getTopPublicAgents(limit));
    }

    /** Public: all active agents for agent selection during application. */
    @GetMapping("/all")
    public ResponseEntity<List<AgentCardResponse>> getAllActiveAgents() {
        return ResponseEntity.ok(agentService.getTopPublicAgents(Integer.MAX_VALUE));
    }

    @GetMapping("/{id:\\d+}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<AgentResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(agentService.getById(id));
    }

    @GetMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<AgentResponse>> getByCompany(@RequestParam Long companyId) {
        return ResponseEntity.ok(agentService.getByCompany(companyId));
    }

    @PatchMapping("/{id:\\d+}/status")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<AgentResponse> updateStatus(@PathVariable Long id, @RequestParam AgentStatus status) {
        return ResponseEntity.ok(agentService.updateStatus(id, status));
    }

    private String getUserPublicId(Authentication auth) {
        return (String) auth.getPrincipal();
    }
}
