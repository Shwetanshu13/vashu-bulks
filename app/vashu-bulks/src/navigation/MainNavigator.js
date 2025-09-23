import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import DashboardScreen from '../screens/DashboardScreen';
import MealsScreen from '../screens/meals/MealsScreen';
import AddMealScreen from '../screens/meals/AddMealScreen';
import MealDetailScreen from '../screens/meals/MealDetailScreen';
import NutritionScreen from '../screens/nutrition/NutritionScreen';
import AIAnalysisScreen from '../screens/ai/AIAnalysisScreen';
import AISuggestionsScreen from '../screens/ai/AISuggestionsScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MealsStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="MealsList"
                component={MealsScreen}
                options={{ title: 'My Meals' }}
            />
            <Stack.Screen
                name="AddMeal"
                component={AddMealScreen}
                options={{ title: 'Add Meal' }}
            />
            <Stack.Screen
                name="MealDetail"
                component={MealDetailScreen}
                options={{ title: 'Meal Details' }}
            />
        </Stack.Navigator>
    );
}

function AIStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="AIAnalysis"
                component={AIAnalysisScreen}
                options={{ title: 'AI Analysis' }}
            />
            <Stack.Screen
                name="AISuggestions"
                component={AISuggestionsScreen}
                options={{ title: 'AI Suggestions' }}
            />
        </Stack.Navigator>
    );
}

export default function MainNavigator() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Dashboard') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Meals') {
                        iconName = focused ? 'restaurant' : 'restaurant-outline';
                    } else if (route.name === 'Nutrition') {
                        iconName = focused ? 'bar-chart' : 'bar-chart-outline';
                    } else if (route.name === 'AI') {
                        iconName = focused ? 'flash' : 'flash-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#2196F3',
                tabBarInactiveTintColor: 'gray',
                headerShown: false,
            })}
        >
            <Tab.Screen name="Dashboard" component={DashboardScreen} />
            <Tab.Screen name="Meals" component={MealsStack} />
            <Tab.Screen name="Nutrition" component={NutritionScreen} />
            <Tab.Screen name="AI" component={AIStack} />
        </Tab.Navigator>
    );
}