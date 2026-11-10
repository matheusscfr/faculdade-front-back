package com.faculdade.backend.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.util.regex.Pattern;

public class StrongPasswordValidator implements ConstraintValidator<StrongPassword, String> {

    private static final int TAMANHO_MINIMO = 10;
    private static final Pattern MAIUSCULA = Pattern.compile("[A-Z]");
    private static final Pattern MINUSCULA = Pattern.compile("[a-z]");
    private static final Pattern NUMERO = Pattern.compile("[0-9]");
    private static final Pattern ESPECIAL = Pattern.compile("[!@#$%^&*(),.?\":{}|<>_\\-+=\\[\\]\\\\/;'`~]");

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null) {
            return false;
        }
        return value.length() >= TAMANHO_MINIMO
                && MAIUSCULA.matcher(value).find()
                && MINUSCULA.matcher(value).find()
                && NUMERO.matcher(value).find()
                && ESPECIAL.matcher(value).find();
    }
}
