# AI-Powered Fitness Recommendation System

An intelligent microservices-based web application that provides personalized fitness recommendations and activity tracking using AI.

![Project Banner](path-to-banner-image) <!-- Add an image link -->

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](link-to-build)
[![Contributions Welcome](https://img.shields.io/badge/contributions-welcome-brightgreen)](CONTRIBUTING.md)

---

## Table of Contents
- [Overview](#overview)
- [Architecture](#architecture)
- [Features](#features)
- [Getting Started](#getting-started)
- [Tech Stack](#tech-stack)
- [Screenshots](#screenshots)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Author](#author)

## Overview

This project is a full-stack fitness platform leveraging AI to deliver tailored workout suggestions and activity analytics. It utilizes a microservices architecture, combining a React frontend with Spring Boot backend services. Key features include:

✨ **Personalized Activity Recommendations:** AI-driven suggestions based on user activity and metrics  
📊 **Activity Tracking:** Log workouts, duration, calories burned, and additional metrics  
🧠 **Intelligent Analysis:** Automated feedback and next workout suggestions via generative AI (Google Gemini API)  
🎨 **Modern Frontend:** Built with React and Vite, featuring a clean dashboard and detailed activity views  
🔒 **Secure Authentication:** OAuth2-based login via Keycloak  
🔗 **Microservices Architecture:** Includes dedicated services for activity management, AI recommendations, gateway, and config server  

## Architecture

- **Frontend:** `fitness-app-frontend/` (React + Vite)
- **API Gateway:** `gateway/` (Spring Boot)
- **Activity Service:** `activityservice/` (Spring Boot)
- **AI Service:** `aiservice/` (Spring Boot, Google Gemini API)
- **Config Server:** `configserver/` (Spring Cloud Config)

![Architecture Diagram](path-to-architecture-diagram) <!-- Add an image link -->

## Features

✨ **Activity Dashboard:** View and track fitness progress  
➕ **Add/Edit Activities:** Log workouts with advanced metrics  
🧠 **AI Insights:** Automated performance analysis, improvements, and safety tips  
🔒 **Authentication:** Secure login/register with OAuth2 (Keycloak)  
📱 **Responsive UI:** Material-UI based design  
⚙️ **Microservices:** Scalability and separation of concerns  

## Getting Started

### Prerequisites
- Node.js & npm
- Java 17+
- Docker (for microservices/keycloak recommended)
- Keycloak server (for OAuth2 authentication)
- Google Cloud Gemini API key

### Development Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/Hari-20042002/AI-Powered-Fitness-Recommendation-System.git
   cd AI-Powered-Fitness-Recommendation-System
   ```

2. Start the frontend:
   ```bash
   cd fitness-app-frontend
   npm install
   npm run dev
   ```

3. Start the backend services:
   ```bash
   # Config Server
   cd configserver
   ./mvnw spring-boot:run

   # Gateway
   cd gateway
   ./mvnw spring-boot:run

   # Activity Service
   cd activityservice
   ./mvnw spring-boot:run

   # AI Service
   cd aiservice
   ./mvnw spring-boot:run
   ```

4. Configure environment variables:
   - Set the Google Gemini API key in `aiservice/src/main/java/com/fitness/aiservice/service/GeminiService.java`

5. Access the app at `http://localhost:3000`

## Screenshots

![Dashboard Screenshot](path-to-dashboard-screenshot) <!-- Add an image link -->
_Description: Interactive dashboard for tracking fitness activities_

![AI Recommendations Screenshot](path-to-ai-recommendations-screenshot) <!-- Add an image link -->
_Description: AI-powered fitness recommendations_

## Tech Stack

- **Frontend:** React, Vite, Material-UI, Redux
- **Backend:** Spring Boot, Spring Cloud, Java 17
- **AI:** Google Gemini API
- **Authentication:** Keycloak OAuth2
- **Microservices:** Config Server, Gateway, Activity Service, AI Service

## Roadmap

- [ ] Add social sharing for fitness achievements  
- [ ] Integrate wearable device support (e.g., Fitbit, Garmin)  
- [ ] Deploy with Docker Compose for seamless setup  
- [ ] Mobile app version  

## Contributing

Contributions are welcome! Please follow these steps:
1. Fork this repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

[Hari-20042002](https://github.com/Hari-20042002)

---

_Feedback and contributions are always appreciated!_
