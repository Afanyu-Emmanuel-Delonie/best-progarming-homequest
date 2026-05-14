package com.homequest.reporting;

import static org.hamcrest.Matchers.containsString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.authentication;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.nio.charset.StandardCharsets;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.web.servlet.MockMvc;

import com.webtech.backend.BackendApplication;

@SpringBootTest(classes = BackendApplication.class)
@AutoConfigureMockMvc
class ReportControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ReportExportService reportExportService;

    @Test
    void exportsUsersAsCsvAttachment() throws Exception {
        ReportDownload report = new ReportDownload("users-report-2026-05-14.csv",
                "section,item,field,value\n".getBytes(StandardCharsets.UTF_8));
        when(reportExportService.exportUsers()).thenReturn(report);

        mockMvc.perform(get("/reports/users").with(authentication(
                        new UsernamePasswordAuthenticationToken("admin", "n/a",
                                List.of(new SimpleGrantedAuthority("ROLE_ADMIN"))))))
                .andExpect(status().isOk())
                .andExpect(header().string("Content-Disposition", containsString("users-report-2026-05-14.csv")))
                .andExpect(content().string("section,item,field,value\n"));

        verify(reportExportService).exportUsers();
    }

    @Test
    void exportsAgentReportUsingAuthenticatedPrincipal() throws Exception {
        ReportDownload report = new ReportDownload("agent-report-agent-123.csv",
                "section,item,field,value\n".getBytes(StandardCharsets.UTF_8));
        when(reportExportService.exportAgent(eq("agent-123"))).thenReturn(report);

        mockMvc.perform(get("/reports/agent/me").with(authentication(
                        new UsernamePasswordAuthenticationToken("agent-123", "n/a",
                                List.of(new SimpleGrantedAuthority("ROLE_AGENT"))))))
                .andExpect(status().isOk())
                .andExpect(header().string("Content-Disposition", containsString("agent-report-agent-123.csv")))
                .andExpect(content().string("section,item,field,value\n"));

        verify(reportExportService).exportAgent("agent-123");
    }
}
