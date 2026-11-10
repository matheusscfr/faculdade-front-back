package com.faculdade.backend.config;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;

import java.io.IOException;
import java.time.*;
import java.time.format.DateTimeParseException;

/**
 * Aceita datas como "2000-05-10", "2000-05-10T00:00:00", "2000-05-10T00:00:00Z" ou com offset,
 * assim como o class-transformer do NestJS fazia com new Date(valor).
 */
public class FlexibleInstantDeserializer extends JsonDeserializer<Instant> {

    @Override
    public Instant deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
        String texto = p.getValueAsString();
        if (texto == null || texto.isBlank()) {
            return null;
        }
        texto = texto.trim();
        try {
            return OffsetDateTime.parse(texto).toInstant();
        } catch (DateTimeParseException ignored) {
            // tenta próximos formatos
        }
        try {
            return LocalDateTime.parse(texto).toInstant(ZoneOffset.UTC);
        } catch (DateTimeParseException ignored) {
            // tenta próximo formato
        }
        try {
            return LocalDate.parse(texto).atStartOfDay(ZoneOffset.UTC).toInstant();
        } catch (DateTimeParseException e) {
            return (Instant) ctxt.handleWeirdStringValue(Instant.class, texto, "data inválida");
        }
    }
}
