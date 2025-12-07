'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { buildNutritionUrl } from '../utils/apiConfig';

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
  };
  message?: string;
}

interface Suggestion {
  food: string;
}

// foods that work with the API
// tested these manually
const COMMON_FOODS = [
  'apple', 'banana', 'orange', 'strawberry', 'blueberry', 'grape', 'watermelon',
  'chicken breast', 'chicken thigh', 'beef', 'pork', 'salmon', 'tuna', 'shrimp',
  'rice', 'pasta', 'bread', 'potato', 'sweet potato', 'broccoli', 'carrot', 'spinach',
  'milk', 'yogurt', 'cheese', 'egg', 'butter', 'olive oil',
  'boba', 'coffee', 'tea', 'orange juice', 'apple juice',
  'chocolate', 'cookie', 'cake', 'ice cream', 'pizza', 'burger', 'sandwich'
];

const MAX_SUGGESTIONS = 8;

interface SearchBarProps {
  onNutritionData: (data: NutritionData | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export default function SearchBar({ onNutritionData, isLoading, setIsLoading }: SearchBarProps) {
  const [foodQuery, setFoodQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // filter suggestions as user types
  useEffect(() => {
    const trimmed = foodQuery.trim();
    
    if (trimmed.length === 0) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const query = trimmed.toLowerCase();
    const filtered = COMMON_FOODS
      .filter(food => food.toLowerCase().includes(query))
      .slice(0, MAX_SUGGESTIONS)
      .map(food => ({ food }));

    setSuggestions(filtered);
    setShowSuggestions(filtered.length > 0);
  }, [foodQuery]);

  const handleSearch = useCallback(async (query?: string) => {
    const searchQuery = query || foodQuery;
    const trimmed = searchQuery.trim();
    
    if (!trimmed) {
      return;
    }

    setIsLoading(true);
    setShowSuggestions(false);
    onNutritionData(null);

    try {
      const url = buildNutritionUrl(trimmed);
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        onNutritionData(data);
      } else {
        let errorMsg = 'Failed to fetch nutrition data';
        try {
          const errorData = await response.json();
          if (errorData.error) {
            errorMsg = errorData.error;
          }
        } catch (e) {
          // json parse failed
        }
        console.error('Error:', errorMsg);
        onNutritionData(null);
      }
    } catch (error) {
      console.error('Network error:', error);
      onNutritionData(null);
    } finally {
      setIsLoading(false);
    }
  }, [foodQuery, onNutritionData, setIsLoading]);

  const handleSuggestionClick = (suggestion: Suggestion) => {
    setFoodQuery(suggestion.food);
    setShowSuggestions(false);
    handleSearch(suggestion.food);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFoodQuery(value);
    if (value.trim().length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center max-w-lg w-full space-x-2">   
      <div className="relative w-full" ref={searchRef}>
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
          <svg
            className="w-5 h-5 text-gray-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
            />
          </svg>
        </div>
        <input
          type="text"
          value={foodQuery}
          onChange={handleInputChange}
          onFocus={() => {
            if (suggestions.length > 0) {
              setShowSuggestions(true);
            }
          }}
          className="block w-full pl-10 pr-3 py-2.5 bg-white/70 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500 shadow-sm"
          placeholder="type food item"
          required
          disabled={isLoading}
        />

        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full text-left px-4 py-3 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none transition-colors border-b border-gray-100 last:border-b-0"
              >
                <span className="text-gray-900 font-medium capitalize">{suggestion.food}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="inline-flex items-center text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 shadow font-medium text-sm px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Loading...' : 'Search'}
      </button>
    </form>
  );
}
