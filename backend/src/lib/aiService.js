import { GoogleGenerativeAI } from '@google/generative-ai';
import conf from '../conf/index.js';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(conf.geminiApiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export const analyzeMealDescription = async (description, mealName = '', mealTime = '') => {
    try {
        const prompt = `
You are a nutrition expert AI. Analyze the following meal description and provide detailed nutritional information.

Meal Information:
- Name: ${mealName || 'Not specified'}
- Time: ${mealTime || 'Not specified'}
- Description: ${description}

Please provide a JSON response with the following structure:
{
  "analysis": {
    "detectedMealName": "string (if meal name can be improved/corrected)",
    "ingredients": ["list of detected ingredients"],
    "estimatedPortionSize": "string (e.g., '1 medium serving', '200g')",
    "confidence": "number (0-1, how confident you are in the analysis)"
  },
  "nutrition": {
    "calories": "number (total estimated calories)",
    "protein": "number (grams of protein)",
    "carbohydrates": "number (grams of carbohydrates)",
    "fats": "number (grams of fats)",
    "fiber": "number (grams of fiber, optional)",
    "sugar": "number (grams of sugar, optional)",
    "sodium": "number (milligrams of sodium, optional)"
  },
  "notes": "string (any additional notes or assumptions made)"
}

Important guidelines:
1. Be conservative with estimates - it's better to underestimate than overestimate
2. If the description is vague, make reasonable assumptions and note them
3. Consider typical portion sizes for the described meal
4. If you cannot determine nutrition info, set values to 0 and explain in notes
5. Only return valid JSON, no additional text

Meal Description to analyze: "${description}"
`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean up the response - remove any markdown formatting
        const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

        // Parse the JSON response
        let analysisResult;
        try {
            analysisResult = JSON.parse(cleanedText);
        } catch (parseError) {
            console.error('Failed to parse AI response as JSON:', cleanedText);
            throw new Error('AI returned invalid JSON format');
        }

        // Validate the response structure
        if (!analysisResult.nutrition || !analysisResult.analysis) {
            throw new Error('AI response missing required fields');
        }

        // Ensure nutrition values are numbers and non-negative
        const nutrition = analysisResult.nutrition;
        nutrition.calories = Math.max(0, parseInt(nutrition.calories) || 0);
        nutrition.protein = Math.max(0, parseInt(nutrition.protein) || 0);
        nutrition.carbohydrates = Math.max(0, parseInt(nutrition.carbohydrates) || 0);
        nutrition.fats = Math.max(0, parseInt(nutrition.fats) || 0);

        return {
            success: true,
            data: analysisResult
        };

    } catch (error) {
        console.error('Gemini AI analysis error:', error);

        // Return a structured error response
        return {
            success: false,
            error: error.message || 'Failed to analyze meal description',
            data: {
                analysis: {
                    detectedMealName: mealName || 'Unknown',
                    ingredients: [],
                    estimatedPortionSize: 'Unknown',
                    confidence: 0
                },
                nutrition: {
                    calories: 0,
                    protein: 0,
                    carbohydrates: 0,
                    fats: 0
                },
                notes: `AI analysis failed: ${error.message || 'Unknown error'}`
            }
        };
    }
};

export const generateMealSuggestions = async (nutritionGoals, previousMeals = []) => {
    try {
        const prompt = `
You are a nutrition expert AI. Based on the provided nutrition goals and previous meals, suggest healthy meal options.

Nutrition Goals:
${JSON.stringify(nutritionGoals, null, 2)}

Previous Meals Today:
${previousMeals.length > 0 ? JSON.stringify(previousMeals, null, 2) : 'No previous meals recorded today'}

Please provide 3-5 meal suggestions that would help achieve the nutrition goals. Return a JSON response with this structure:
{
  "suggestions": [
    {
      "mealName": "string",
      "description": "string (detailed description)",
      "estimatedNutrition": {
        "calories": "number",
        "protein": "number",
        "carbohydrates": "number",
        "fats": "number"
      },
      "ingredients": ["list of main ingredients"],
      "preparationTime": "string (e.g., '15 minutes')",
      "difficulty": "string (easy/medium/hard)"
    }
  ],
  "remainingGoals": {
    "calories": "number (remaining calories for the day)",
    "protein": "number (remaining protein for the day)",
    "carbohydrates": "number (remaining carbs for the day)",
    "fats": "number (remaining fats for the day)"
  }
}

Only return valid JSON, no additional text.
`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const suggestions = JSON.parse(cleanedText);

        return {
            success: true,
            data: suggestions
        };

    } catch (error) {
        console.error('Meal suggestions error:', error);
        return {
            success: false,
            error: error.message || 'Failed to generate meal suggestions'
        };
    }
};