package com.homequest.reporting;

import java.nio.charset.StandardCharsets;
import java.util.List;

public class CsvReportWriter {

    public byte[] write(List<CsvRow> rows) {
        StringBuilder csv = new StringBuilder();
        csv.append("section,item,field,value\n");
        for (CsvRow row : rows) {
            csv.append(escape(row.section())).append(',')
                    .append(escape(row.item())).append(',')
                    .append(escape(row.field())).append(',')
                    .append(escape(row.value()))
                    .append('\n');
        }
        return csv.toString().getBytes(StandardCharsets.UTF_8);
    }

    private String escape(String value) {
        if (value == null) {
            return "";
        }
        return "\"" + value.replace("\"", "\"\"") + "\"";
    }

    public record CsvRow(String section, String item, String field, String value) {}
}
