import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const food = searchParams.get('food');

  if (!food) {
    return NextResponse.json(
      { error: 'Food parameter is required' },
      { status: 400 }
    );
  }

  // get endpoint from env or use local sam server
  const apiEndpoint = process.env.API_GATEWAY_ENDPOINT || 
                     process.env.LOCAL_API_ENDPOINT || 
                     'http://127.0.0.1:3001';

  try {
    const response = await fetch(`${apiEndpoint}/nutrition?food=${encodeURIComponent(food)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json(data, { status: response.status });
    } else {
      // api failed, return mock
      const errorText = await response.text();
      console.warn('API call failed:', errorText);
      return NextResponse.json({
        food: food,
        nutrition: {
          calories: 250,
          protein: 10,
          carbs: 30,
          fat: 8,
          fiber: 5,
          sugar: 15,
          sodium: 0.2
        },
        message: 'Using mock data. Make sure SAM local API is running on port 3001.'
      });
    }
  } catch (error) {
    // network error
    console.warn('Could not reach API:', error);
    return NextResponse.json({
      food: food,
      nutrition: {
        calories: 250,
        protein: 10,
        carbs: 30,
        fat: 8,
        fiber: 5,
        sugar: 15,
        sodium: 0.2
      },
      message: 'Using mock data. Start SAM local API with "sam local start-api --port 3001" for real data.'
    });
  }
}
