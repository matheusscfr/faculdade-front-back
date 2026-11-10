package com.faculdade.backend.exception;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.http.HttpStatus;

/**
 * Mesmo formato de erro do NestJS: { "statusCode": 400, "message": ..., "error": "Bad Request" }.
 * "message" pode ser uma string ou uma lista (erros de validação).
 */
public record ErrorResponse(
        @JsonProperty("statusCode") int statusCode,
        @JsonProperty("message") Object message,
        @JsonProperty("error") String error) {

    public static ErrorResponse of(HttpStatus status, Object message) {
        return new ErrorResponse(status.value(), message, status.getReasonPhrase());
    }
}
