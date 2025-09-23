# Yes Chef Mobile App

A React Native Expo application for meal tracking, nutrition monitoring, and AI-powered meal analysis.

## Features

### 🔐 Authentication

- User registration and login
- Email verification
- Password reset functionality
- Secure token-based authentication

### 🍽️ Meal Management

- Add, edit, and delete meals
- Photo capture and gallery selection
- Nutrition tracking (calories, protein, carbs, fat)
- Meal history and details

### 📊 Nutrition Tracking

- Daily, weekly, and monthly nutrition summaries
- Macronutrient distribution visualization
- Goal tracking and progress monitoring
- Nutrition insights and trends

### 🤖 AI-Powered Features

- Meal analysis from photos
- Ingredient detection
- Nutrition estimation
- Personalized meal suggestions
- Smart recipe recommendations

### 📱 Mobile Optimizations

- Camera integration for meal photos
- Offline meal storage
- Push notifications (ready for implementation)
- Responsive design for all screen sizes

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio/Emulator (for Android development)

## Installation

1. **Clone the repository** (if applicable)

   ```bash
   git clone <repository-url>
   cd yes-chef-mobile
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm start
   ```

4. **Run on devices**
   - iOS: `npm run ios`
   - Android: `npm run android`
   - Web: `npm run web`

## Configuration

### Environment Setup

Update the API configuration in `src/utils/config.js`:

```javascript
const ENV = {
  development: {
    API_BASE_URL: "http://your-local-api:3000/api",
    DEBUG: true,
  },
  production: {
    API_BASE_URL: "https://your-production-api.com/api",
    DEBUG: false,
  },
};
```

### Backend API Requirements

The app expects the following API endpoints:

#### Authentication

- `POST /auth/login` - User login
- `POST /auth/signup` - User registration
- `POST /auth/forgot-password` - Password reset
- `POST /auth/verify` - Email verification
- `GET /auth/verify-token` - Token validation

#### Meals

- `GET /meals` - Get user meals
- `GET /meals/:id` - Get specific meal
- `POST /meals` - Create new meal
- `PUT /meals/:id` - Update meal
- `DELETE /meals/:id` - Delete meal
- `POST /meals/upload-image` - Upload meal image

#### Nutrition

- `GET /nutrition` - Get nutrition data
- `POST /nutrition` - Add nutrition entry
- `GET /nutrition/summary` - Get nutrition summary

#### AI Features

- `POST /ai/analyze` - Analyze meal image
- `POST /ai/suggestions` - Get meal suggestions
- `GET /ai/analysis-history` - Get analysis history

## Project Structure

```
src/
├── components/
│   └── common/
│       ├── Button.js
│       ├── Input.js
│       └── Card.js
├── contexts/
│   └── AuthContext.js
├── navigation/
│   ├── AppNavigator.js
│   ├── AuthNavigator.js
│   └── MainNavigator.js
├── screens/
│   ├── auth/
│   ├── meals/
│   ├── nutrition/
│   ├── ai/
│   └── DashboardScreen.js
├── styles/
│   └── theme.js
└── utils/
    ├── api.js
    ├── config.js
    └── mobileUtils.js
```

## API Integration Guide

### Authentication Flow

1. User signs up with email/password
2. Backend sends verification email
3. User verifies email with token
4. User can log in and receive JWT token
5. Token is stored securely and used for API calls

### Request/Response Examples

#### Login Request

```javascript
POST /auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Login Response

```javascript
{
  "success": true,
  "token": "jwt-token-here",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

#### Meal Creation Request

```javascript
POST /meals
{
  "name": "Grilled Chicken Salad",
  "description": "Healthy lunch option",
  "calories": 350,
  "protein": 30,
  "carbs": 15,
  "fat": 18,
  "imageUrl": "https://example.com/image.jpg"
}
```

#### AI Analysis Request

```javascript
POST /ai/analyze
Content-Type: multipart/form-data

image: [binary image data]
```

#### AI Analysis Response

```javascript
{
  "success": true,
  "foodName": "Grilled Chicken Breast",
  "confidence": 0.95,
  "description": "Lean protein source, grilled preparation",
  "nutrition": {
    "calories": 185,
    "protein": 35,
    "carbs": 0,
    "fat": 4
  },
  "ingredients": ["chicken breast", "olive oil", "herbs"]
}
```

## Key Features Implementation

### Camera Integration

- Uses `expo-image-picker` for camera and gallery access
- Supports image editing and compression
- Handles permissions gracefully

### Offline Support

- Stores meals locally when offline
- Syncs data when connection is restored
- Uses `expo-secure-store` for secure local storage

### Navigation

- Tab-based navigation for main features
- Stack navigation for detailed flows
- Authentication-aware navigation

### State Management

- React Context for authentication state
- Local state management for screens
- Secure token storage

## Customization

### Theming

Update colors and styles in `src/styles/theme.js`:

```javascript
export const theme = {
  colors: {
    primary: "#2196F3",
    secondary: "#FF9800",
    // ... other colors
  },
  // ... other theme properties
};
```

### Adding New Features

1. Create new screens in appropriate folders
2. Add API endpoints in `src/utils/api.js`
3. Update navigation as needed
4. Add any new dependencies to `package.json`

## Building for Production

### iOS

1. Configure signing in Xcode
2. Update `app.json` with proper bundle identifier
3. Run `expo build:ios` or use EAS Build

### Android

1. Generate signed APK
2. Update `app.json` with proper package name
3. Run `expo build:android` or use EAS Build

## Troubleshooting

### Common Issues

1. **Metro bundler issues**

   ```bash
   npx expo start --clear
   ```

2. **iOS simulator not working**

   ```bash
   xcrun simctl erase all
   ```

3. **Android build issues**
   ```bash
   cd android && ./gradlew clean
   ```

### Debug Mode

Enable debug logging by setting `DEBUG: true` in config.js

## Contributing

1. Follow the existing code structure
2. Use the established naming conventions
3. Add proper error handling
4. Test on both iOS and Android
5. Update documentation as needed

## License

This project is licensed under the MIT License.

## Support

For issues and questions:

- Check the troubleshooting section
- Review the API integration guide
- Ensure all dependencies are properly installed
- Verify backend API endpoints are accessible
