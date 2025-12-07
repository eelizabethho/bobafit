# BobaFit Setup

## Prerequisites

- Node.js 18+ and npm
- Python 3.12
- AWS SAM CLI
- Docker (for local Lambda testing)
- CalorieNinjas API key (get one at https://www.calorieninjas.com/)

## Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend/bobafit-backend
   ```

2. Add your CalorieNinjas API key to `env.json`:
   ```json
   {
     "NutritionFunction": {
       "CALORIENINJAS_API_KEY": "your-api-key-here"
     }
   }
   ```

3. Build and run locally:
   ```bash
   sam build
   sam local start-api --port 3001 --env-vars env.json
   ```

4. For deployment, configure AWS credentials and run:
   ```bash
   sam deploy --guided
   ```
   You'll need to provide the API key as a parameter during deployment.

## Frontend Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env.local` file (optional, for production API):
   ```
   NEXT_PUBLIC_API_ENDPOINT=https://your-api-gateway-url.execute-api.region.amazonaws.com/Prod
   ```

3. Run development server:
   ```bash
   npm run dev
   ```

## Testing

- Backend: Test the Lambda function locally using `sam local invoke`
- Frontend: Manual testing required - search for foods and verify nutrition data displays correctly
- Integration: Test the full flow from frontend → API Gateway → Lambda → CalorieNinjas

## Notes

- The food suggestions list in `SearchBar.tsx` can be customized
- API timeout is set to 10 seconds in the backend
- CORS is configured to allow all origins (restrict in production)


