package com.fitness.aiservice.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.HashMap;
import java.util.Map;

@Service
public class GeminiService {
    private final WebClient webClient;

    @Value("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=")
    private String geminiApiUrl;
    @Value("AIzaSyApWJMwlJfGydV2xoxTebIWuDlomBhuVJ0")
    private String geminiApiKey;


    public GeminiService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    public String getAnswer(String question){
        Map<String,Object> requestBody = Map.of("contents",new Object[]{
                Map.of("parts", new Object[]{
                        Map.of("text", question)
                })
        });

        String response = webClient.post()
                .uri(geminiApiUrl+geminiApiKey)
                .header("Content-Type","application/json")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .block();
        return response;
    }
}
