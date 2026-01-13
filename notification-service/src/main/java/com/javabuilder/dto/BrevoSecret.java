package com.javabuilder.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class BrevoSecret {
    @JsonProperty("brevo-api-key")
    private String apiKey;

}
