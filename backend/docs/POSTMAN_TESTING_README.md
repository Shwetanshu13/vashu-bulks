# YesChef Backend API - Postman Testing Guide

This directory contains Postman collection and environment files for testing the YesChef backend API.

## 📁 Files

- `YesChef_Backend_Postman_Collection.json` - Complete API collection with all endpoints
- `YesChef_Backend_Postman_Environment.json` - Environment variables for testing

## 🚀 Setup Instructions

### 1. Import Files into Postman

1. Open Postman
2. Click "Import" button
3. Import both JSON files:
   - First import the environment file
   - Then import the collection file

### 2. Configure Environment

1. Select "YesChef Backend Environment" from the environment dropdown
2. Update the `base_url` variable if your server runs on a different port:
   - Default: `http://localhost:8000`
   - Change to your actual server URL

### 3. Start Your Backend Server

Make sure your backend server is running:

```bash
cd backend
pnpm run dev
```

And ensure Docker services are running:

```bash
docker-compose up -d
```

## 🧪 Testing Workflow

### 1. User Registration & Authentication

1. **Signup** → Create a new user account
2. **Verify Email** → Use the verification token from email (check your Mailtrap inbox)
3. **Login** → Get JWT token for authenticated requests

### 2. Manual Meal & Nutrition Logging

1. **Create Meal** → Add a meal with manual nutrition data
2. **Add Nutrition** → Add/update nutrition for existing meals
3. **Get Meals** → View all meals with pagination
4. **Daily Summary** → Check nutrition totals for any date

### 3. AI-Powered Features

1. **AI Meal Analysis** → Create meal with natural language description
2. **Check Status** → Monitor AI analysis progress
3. **Get Suggestions** → Receive AI meal recommendations

## 🔧 Environment Variables

The collection automatically manages these variables:

- `auth_token` - JWT token (set after login)
- `user_email` - User email (set after signup)
- `meal_id` - Current meal ID (set after meal creation)
- `ai_meal_id` - AI-analyzed meal ID (set after AI analysis)

## 📋 API Endpoints Overview

### Authentication (`/api/auth`)

- `POST /signup` - Register new user
- `POST /login` - User login
- `POST /verify-email` - Email verification
- `POST /resend-verification` - Resend verification email

### Meals (`/api/meals`)

- `POST /` - Create meal
- `GET /` - Get meals (paginated)
- `GET /:id` - Get specific meal
- `PUT /:id` - Update meal
- `DELETE /:id` - Delete meal

### Nutrition (`/api/nutrition`)

- `POST /meals/:mealId` - Add nutrition to meal
- `GET /meals/:mealId` - Get meal nutrition
- `PUT /:id` - Update nutrition record
- `DELETE /:id` - Delete nutrition record
- `GET /summary` - Daily nutrition summary

### AI Features (`/api/ai`)

- `POST /analyze-meal` - Create meal with AI analysis
- `GET /meals/:id/status` - Check AI analysis status
- `POST /meals/:id/retry` - Retry failed analysis
- `GET /suggestions` - Get AI meal suggestions

## 🧪 Sample Test Data

### Meal Descriptions for AI Analysis

**Breakfast:**

```
"I had oatmeal with banana, almonds, and a scoop of protein powder. About 1 cup cooked oatmeal, 1 medium banana, 1/4 cup almonds, and 1 scoop whey protein."
```

**Lunch:**

```
"Grilled chicken salad with mixed greens, cherry tomatoes, cucumber, feta cheese, and balsamic vinaigrette. Chicken breast was 6oz, salad was large portion."
```

**Dinner:**

```
"Baked salmon with quinoa and steamed broccoli. 6oz salmon fillet, 1 cup cooked quinoa, 2 cups broccoli, seasoned with lemon and herbs."
```

**Snack:**

```
"Greek yogurt with berries and a handful of walnuts. Plain Greek yogurt 6oz, mixed berries 1 cup, walnuts 1/4 cup."
```

## 🔍 Testing Tips

1. **Run requests in order** - Authentication first, then other endpoints
2. **Check response codes** - 200/201 for success, 400/401/404 for errors
3. **Monitor variables** - Collection variables update automatically
4. **Use different users** - Test with multiple accounts if needed
5. **Check AI status** - AI analysis takes a few seconds, check status endpoint

## 🐛 Troubleshooting

### Common Issues:

1. **401 Unauthorized**

   - Make sure you're logged in and have a valid `auth_token`
   - Check if email is verified before login

2. **404 Not Found**

   - Verify the endpoint URL and method
   - Check if the resource ID exists

3. **500 Internal Server Error**

   - Check server logs for detailed error messages
   - Ensure database and Redis are running

4. **AI Analysis Not Working**
   - Verify `GEMINI_API_KEY` is set in `.env`
   - Check Redis connection for queue processing

### Environment Setup:

Make sure your `.env` file includes:

```env
PORT=8000
DB_URL=postgresql://root:your_password@localhost:5432/yes_chef_db
JWT_SECRET=your_jwt_secret
MAILTRAP_HOST=sandbox.smtp.mailtrap.io
MAILTRAP_PORT=2525
MAILTRAP_USER=your_mailtrap_user
MAILTRAP_PASS=your_mailtrap_pass
REDIS_HOST=localhost
REDIS_PORT=6379
GEMINI_API_KEY=your_gemini_api_key
```

## 📞 Support

If you encounter issues:

1. Check the server logs in the terminal
2. Verify all services are running (PostgreSQL, Redis)
3. Ensure environment variables are correctly set
4. Test individual endpoints with simple data first
