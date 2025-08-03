package com.fitness.activityservice.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum ActivityType {
    Running,
    Walking,
    Cycling,
    Swimming,
    Weight_Training,
    Yoga,
    Stretching,
    Cardio,
    Other;

    @JsonCreator
    public static ActivityType fromValue(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }

        String trimmedValue = value.trim();

        // Handle case-insensitive matching with enum names
        for (ActivityType type : ActivityType.values()) {
            if (type.name().equalsIgnoreCase(trimmedValue)) {
                return type;
            }
        }

        // Handle some common variations
        switch (trimmedValue.toLowerCase()) {
            case "cycling":
            case "bike":
            case "biking":
                return Cycling;
            case "running":
            case "run":
                return Running;
            case "walking":
            case "walk":
                return Walking;
            case "swimming":
            case "swim":
                return Swimming;
            case "weight_training":
            case "weighttraining":
            case "weights":
                return Weight_Training;
            case "yoga":
                return Yoga;
            case "stretching":
            case "stretch":
                return Stretching;
            case "cardio":
                return Cardio;
            default:
                return Other;
        }
    }

    @JsonValue
    public String getValue() {
        return this.name();
    }
}