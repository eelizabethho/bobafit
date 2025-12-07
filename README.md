# BobaFit 🧋

A nutrition tracking application I developed for a class project. Users can search for foods and receive detailed nutrition information using the CalorieNinjas API.

## Overview

This application allows users to input a food item (such as "apple" or "chicken breast") and displays comprehensive nutrition facts including calories, protein, carbohydrates, fat, and other nutrients. I implemented an autocomplete feature to improve the user experience and reduce typing.

## Technology Stack

- **Frontend**: Next.js with React and TypeScript
- **Backend**: AWS Lambda functions written in Python
- **API**: CalorieNinjas for nutrition data retrieval
- **Deployment**: AWS SAM for backend infrastructure, Vercel/Next.js for frontend hosting

## Setup Instructions

### Prerequisites

- Node.js 18 or higher
- Python 3.12
- AWS SAM CLI
- Docker (required for local Lambda testing)
- CalorieNinjas API key (available for free at https://www.calorieninjas.com/)

### Backend Configuration

1. Navigate to the backend directory:
   ```bash
   cd backend/bobafit-backend
   ```

2. Edit the `env.json` file and add your CalorieNinjas API key:
   ```json
   {
     "NutritionFunction": {
       "CALORIENINJAS_API_KEY": "your-api-key-here"
     }
   }
   ```

3. Build and run the backend locally:
   ```bash
   sam build
   sam local start-api --port 3001 --env-vars env.json
   ```

   Keep this terminal window open as the backend server needs to remain running.

### Frontend Configuration

1. Install project dependencies:
   ```bash
   npm install
   ```

2. If you have deployed the backend to AWS, create a `.env.local` file in the root directory:
   ```
   NEXT_PUBLIC_API_ENDPOINT=https://your-api-url.execute-api.region.amazonaws.com/Prod
   ```
   
   If running locally, the application will automatically use the local API route which proxies requests to the SAM local server.

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open http://localhost:3000 in your browser to access the application.

## Development Experience

### Challenges Encountered

During development, I encountered several challenges that required problem-solving:

- Initially attempted to use the FatSecret API, but encountered issues with their search functionality. Switched to CalorieNinjas API which proved more reliable.
- CORS configuration required significant troubleshooting to ensure proper communication between frontend and backend.
- Implementing the dropdown autocomplete feature was more complex than anticipated and required multiple iterations.
- Code refactoring was necessary to eliminate duplicate logic and improve maintainability.

### Key Learnings

This project provided valuable experience with:

- AWS Lambda functions and serverless architecture
- API integration and error handling
- TypeScript for type safety and improved code quality
- React hooks and state management
- CORS configuration and cross-origin requests

## Future Enhancements

Potential improvements for future iterations:

- User favorites list for frequently searched foods
- Search history functionality
- Meal planning features
- Enhanced error messaging and user feedback
- Expanded food suggestions database
- User authentication and personalized profiles

## Technical Notes

- The food suggestions list can be customized in `app/components/SearchBar.tsx`
- Backend API timeout is configured to 10 seconds
- CORS is currently configured to allow all origins; this should be restricted in production environments
- The application handles both single food items and multiple food queries (aggregating nutrition values)

## Acknowledgments

- CalorieNinjas API for providing nutrition data
- Next.js documentation for framework guidance
- AWS SAM documentation for serverless deployment assistance
