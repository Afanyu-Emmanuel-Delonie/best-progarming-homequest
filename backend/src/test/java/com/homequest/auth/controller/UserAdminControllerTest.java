package com.homequest.auth.controller;

import static org.hamcrest.Matchers.is;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import com.homequest.auth.model.Role;
import com.homequest.auth.model.User;
import com.homequest.auth.repository.UserRepository;
import com.webtech.backend.DataSeeder;
import com.webtech.backend.BackendApplication;

@SpringBootTest(classes = BackendApplication.class)
@AutoConfigureMockMvc
class UserAdminControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserRepository userRepository;

    @MockBean
    private DataSeeder dataSeeder;

    @Test
    void resolvesUserByPublicId() throws Exception {
        UUID publicId = UUID.fromString("11111111-1111-1111-1111-111111111111");
        User user = User.builder()
                .id(1L)
                .publicId(publicId)
                .username("jane")
                .email("jane@example.com")
                .password("secret")
                .role(Role.ROLE_CUSTOMER)
                .isActive(true)
                .createdAt(LocalDateTime.of(2026, 5, 14, 9, 30))
                .build();

        when(userRepository.findByPublicId(publicId)).thenReturn(Optional.of(user));

        mockMvc.perform(get("/api/v1/users/by-public-id/{publicId}", publicId)
                .servletPath("/api/v1")
                .with(user("admin").roles("ADMIN")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.publicId", is(publicId.toString())))
                .andExpect(jsonPath("$.role", is("ROLE_CUSTOMER")))
                .andExpect(jsonPath("$.status", is("ACTIVE")));
    }
}
