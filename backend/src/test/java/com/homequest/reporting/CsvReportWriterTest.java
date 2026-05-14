package com.homequest.reporting;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.nio.charset.StandardCharsets;
import java.util.List;

import org.junit.jupiter.api.Test;

class CsvReportWriterTest {

    @Test
    void escapesQuotesAndCommas() {
        CsvReportWriter writer = new CsvReportWriter();

        byte[] csv = writer.write(List.of(
                new CsvReportWriter.CsvRow("profile", "agent-1", "fullName", "Jane, \"JJ\" Smith")));

        assertEquals("""
                section,item,field,value
                "profile","agent-1","fullName","Jane, ""JJ"" Smith"
                """, new String(csv, StandardCharsets.UTF_8));
    }
}
