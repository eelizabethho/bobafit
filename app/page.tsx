'use client';

import { useState } from 'react';
import SearchBar from "./components/SearchBar";
import { roundToDecimal, sodiumToMg, shouldShowValue } from './utils/nutritionHelpers';

interface NutritionData {
  food: string;
  serving_size?: number;
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    sugar?: number;
    sodium?: number;
    saturated_fat?: number;
    cholesterol?: number;
    potassium?: number;
  };
  message?: string;
}

// nutrition card component
function NutritionCard({ label, value, unit, bgColor, textColor }: {
  label: string;
  value: number;
  unit: string;
  bgColor: string;
  textColor: string;
}) {
  // decimals for small values, whole numbers for big ones
  const displayValue = value < 1 ? roundToDecimal(value, 1) : Math.round(value);
  
  return (
    <div className={`${bgColor} p-4 rounded-lg`}>
      <div className="text-sm text-gray-600">{label}</div>
      <div className={`text-2xl font-bold ${textColor}`}>
        {displayValue}{unit}
      </div>
    </div>
  );
}

export default function Home() {
  const [nutritionData, setNutritionData] = useState<NutritionData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div 
    className="min-h-screen flex items-center justify-center bg-white text-black dark:bg-black dark:text-white"
      style={
          { backgroundImage: 'url("/bobabackground.jpg")', 
            backgroundRepeat: 'no-repeat', 
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            
          }}
    >
      <div className="w-full max-w-2xl mx-4 rounded-2xl shadow-lg backdrop-blur-md bg-white/20 flex flex-col items-center justify-start py-8 px-6">
        <div className="w-full flex items-center justify-between pt-4 pb-6">
          <div className="w-10"></div>
          <h1 className="text-black text-4xl text-center font-bold">Nutrition Checker</h1>
          <img 
            src="/AmazonLogo.png"
            alt="Amazon Logo"
            className="w-15 h-12"
            />
        </div>
        <div className="flex flex-col items-center w-full mb-6">
          <SearchBar 
            onNutritionData={setNutritionData} 
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        </div>

        {nutritionData && (
          <div className="w-full mt-4 p-6 bg-white/90 rounded-lg shadow-md">
            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {nutritionData.food}
              </h2>
              {nutritionData.serving_size && (
                <p className="text-sm text-gray-600">
                  Serving Size: <span className="font-semibold">{Math.round(nutritionData.serving_size)}g</span>
                </p>
              )}
            </div>
            {nutritionData.message && (
              <p className="text-sm text-amber-600 mb-4 text-center italic">
                {nutritionData.message}
              </p>
            )}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <NutritionCard
                label="Calories"
                value={nutritionData.nutrition.calories}
                unit=" kcal"
                bgColor="bg-blue-50"
                textColor="text-blue-700"
              />
              <NutritionCard
                label="Protein"
                value={roundToDecimal(nutritionData.nutrition.protein)}
                unit="g"
                bgColor="bg-green-50"
                textColor="text-green-700"
              />
              <NutritionCard
                label="Carbs"
                value={roundToDecimal(nutritionData.nutrition.carbs)}
                unit="g"
                bgColor="bg-yellow-50"
                textColor="text-yellow-700"
              />
              <NutritionCard
                label="Fat"
                value={roundToDecimal(nutritionData.nutrition.fat)}
                unit="g"
                bgColor="bg-orange-50"
                textColor="text-orange-700"
              />
              <NutritionCard
                label="Fiber"
                value={roundToDecimal(nutritionData.nutrition.fiber)}
                unit="g"
                bgColor="bg-purple-50"
                textColor="text-purple-700"
              />
              {shouldShowValue(nutritionData.nutrition.sugar) && (
                <NutritionCard
                  label="Sugar"
                  value={roundToDecimal(nutritionData.nutrition.sugar!)}
                  unit="g"
                  bgColor="bg-pink-50"
                  textColor="text-pink-700"
                />
              )}
              {shouldShowValue(nutritionData.nutrition.sodium) && (
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Sodium</div>
                  <div className="text-2xl font-bold text-indigo-700">
                    {sodiumToMg(nutritionData.nutrition.sodium!)}mg
                  </div>
                </div>
              )}
              {shouldShowValue(nutritionData.nutrition.saturated_fat) && (
                <NutritionCard
                  label="Saturated Fat"
                  value={roundToDecimal(nutritionData.nutrition.saturated_fat!)}
                  unit="g"
                  bgColor="bg-red-50"
                  textColor="text-red-700"
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
