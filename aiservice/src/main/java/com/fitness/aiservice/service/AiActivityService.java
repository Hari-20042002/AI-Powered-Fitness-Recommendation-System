package com.fitness.aiservice.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fitness.aiservice.model.Activity;
import com.fitness.aiservice.model.Recommendation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor

public class AiActivityService {
    private final GeminiService geminiService;

    public Recommendation generateRecommendation(Activity activity){
        String prompt = createPromptForActivity(activity);
        String aiResponse = geminiService.getAnswer(prompt);
        log.info("Response from AI: {}", aiResponse);
        return processAIResponse(activity,aiResponse);
    }

    private Recommendation processAIResponse(Activity activity,String aiResponse){
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode rootNode = mapper.readTree(aiResponse);

            JsonNode textNode = rootNode.path("candidates")
                    .get(0)
                    .path("content")
                    .path("parts")
                    .get(0)
                    .path("text");

            String jsonContent =  textNode.asText()
                    .replaceAll("```json\\n","")
                    .replaceAll("\\n```","")
                    .trim();
  //          log.info("Parsed Response from AI: {}", jsonContent);
            JsonNode analysisJson = mapper.readTree(jsonContent);
            JsonNode analysisNode = analysisJson.path("analysis");
            StringBuilder fullAnalysis = new StringBuilder();
            addAnalysisSection(fullAnalysis, analysisNode, "overall","Overall:");
            addAnalysisSection(fullAnalysis, analysisNode, "pace","Pace:");
            addAnalysisSection(fullAnalysis, analysisNode, "heartRate","HeartRate:");
            addAnalysisSection(fullAnalysis, analysisNode, "caloriesBurned","CaloriesBurned:");

            List<String> improvements = extractImprovements(analysisJson.path("improvements"));
            List<String> suggestions = extractSuggestions(analysisJson.path("suggestions"));
            List<String> safety = extractSafetyGuidelines(analysisJson.path("safety"));


            return Recommendation.builder()
                    .activityId(activity.getId())
                    .userId(activity.getUserId())
                    .activityType(activity.getType())
                    .recommendation(fullAnalysis.toString().trim())
                    .improvements(improvements)
                    .suggestions(suggestions)
                    .safety(safety)
                    .createdAt(LocalDateTime.now())
                    .build();

        }catch (Exception e){
            e.printStackTrace();
            return createDefaultRecommendation(activity);
        }

    }

    private Recommendation createDefaultRecommendation(Activity activity) {
        return Recommendation.builder()
                .activityId(activity.getId())
                .activityType(activity.getType())
                .userId(activity.getUserId())
                .recommendation("Unable to generate detailed analysis")
                .improvements(Collections.singletonList("Continue with your routine"))
                .suggestions(Collections.singletonList("Consider Consulting a fitness professional "))
                .safety(Arrays.asList(
                        "Always warmup before exercise",
                        "Stay Hydrated",
                        "Listen to your body"))
                .build();
    }

    private List<String> extractSafetyGuidelines(JsonNode safetyNode) {
        List<String> safetyGuidelines = new ArrayList<>();
        if(safetyNode.isArray()){
            safetyNode.forEach(Item -> safetyGuidelines.add(Item.asText()));
        }
        return safetyGuidelines.isEmpty() ?
                Collections.singletonList("Follow General Safety Guidelines") :
                safetyGuidelines;
    }

    private List<String> extractSuggestions(JsonNode suggestionsNode) {
        List<String> suggestionList = new ArrayList<>();
        if(suggestionsNode.isArray()){
            suggestionsNode.forEach(suggestion -> {
                String workout =  suggestion.path("workout").asText();
                String description =   suggestion.path("description").asText();
                suggestionList.add(String.format("%s: %s", workout, description));

            });
        }
        return suggestionList.isEmpty() ?
                Collections.singletonList("No specific Suggestion provided: ") :
                suggestionList;

    }

    private List<String> extractImprovements(JsonNode improvementsNode) {
        List<String> improvements = new ArrayList<>();
        if(improvementsNode.isArray()){
            improvementsNode.forEach(improvement -> {
                String area = improvement.path("area").asText();
                String detail = improvement.path("recommendation").asText();
                improvements.add(String.format("%s: %s", area, detail));
            });
        }
        return improvements.isEmpty() ?
                Collections.singletonList("NO specific Improvements provided: ") :
                improvements;

    }

    private void addAnalysisSection(StringBuilder fullAnalysis, JsonNode analysisNode, String key, String prefix) {
        if(!analysisNode.path(key).isMissingNode()){
            fullAnalysis.append(prefix)
                    .append(analysisNode.path(key).asText())
                    .append(":\n\n");
        }
    }

    private String createPromptForActivity(Activity activity) {
        return String.format("""
                Analyze this fitness activity and provide detailed recommendations in the following JSON Format and Feel free to add the better version fo this format I didnt add some field if think any field is good enough for this like below add them too:
                {
                  "analysis": {
                      "overall": "Overall Analysis Here",
                      "pace": "Pace Analysis Here",
                      "heartRate": "HeartRate Analysis Here",
                      "caloriesBurned": "calories analysis Here","
                  },
                  "improvements": [
                  
                     { 
                        "area": "AreaName",
                        "recommendation": "Detailed Recommendation","
                     }
                      
                    ],
                    "suggestions": [
                        {
                        "workout": "Workout name",
                        "description": "Detailed workout description"
                        } 
                    ],
                    "safety": [
                       "Safety point 1",
                       "Safety point 2","
                    ]
                }
                
                Analyze this activity:
                activity Type: %s,
                Duration: %d minutes,
                Calories Burned: %d minutes,
                Additional Metrics: %s
                
                Provide detailed analysis focusing on performance, improvements, next workout suggestions and safety points.
                
                """,

                        activity.getType(),
                        activity.getDuration(),
                        activity.getCaloriesBurned(),
                        activity.getAdditionalMetrics()

        );
    }
}
