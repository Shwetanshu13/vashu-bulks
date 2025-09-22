# YesChef Frontend - Authentication System

This is the frontend authentication system for the YesChef meal and nutrition tracking application. Built with Next.js 15, React 19, and Tailwind CSS.

## Features

### Authentication Pages

- **Signup** (`/auth/signup`) - User registration with email verification
- **Login** (`/auth/login`) - User authentication with JWT tokens
- **Email Verification** (`/auth/verify`) - Email confirmation page
- **Forgot Password** (`/auth/forgot-password`) - Password reset (placeholder)

### Security Features

- JWT token management with automatic expiry checking
- Protected routes with authentication middleware
- Form validation and error handling
- Secure token storage in localStorage
- Email verification requirement before login

### Components

#### Auth Components (`components/auth/`)

- `Input.js` - Reusable form input with validation
- `Button.js` - Styled button component with loading states
- `AuthLayout.js` - Consistent layout for auth pages
- `Alert.js` - Alert messages for success/error states

#### Route Protection

- `ProtectedRoute.js` - Wrapper for authenticated pages
- `PublicRoute.js` - Wrapper for public pages (redirects if authenticated)
- `Header.js` - Navigation header with auth state

#### Context & State Management

- `AuthContext.js` - Global authentication state management
- `utils/auth.js` - Authentication utilities and API calls

## API Integration

The frontend integrates with the following backend endpoints:

```javascript
POST / api / auth / signup; // User registration
POST / api / auth / login; // User authentication
POST / api / auth / verify - email; // Email verification
POST / api / auth / resend - verification; // Resend verification email
```

## Setup and Usage

### Environment Variables

Create a `.env.local` file with:

```
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

### Installation

```bash
npm install
# or
pnpm install
```

### Development

```bash
npm run dev
# or
pnpm dev
```

### File Structure

```
app/
├── auth/
│   ├── login/page.js          # Login page
│   ├── signup/page.js         # Signup page
│   ├── verify/page.js         # Email verification
│   └── forgot-password/page.js # Password reset
├── dashboard/page.js          # Protected dashboard
├── layout.js                 # Root layout with AuthProvider
└── page.js                   # Home page with auth routing

components/
├── auth/
│   ├── Input.js              # Form input component
│   ├── Button.js             # Button component
│   ├── AuthLayout.js         # Auth page layout
│   └── Alert.js              # Alert component
├── ProtectedRoute.js         # Route protection wrapper
├── PublicRoute.js            # Public route wrapper
└── Header.js                 # Navigation header

contexts/
└── AuthContext.js            # Authentication context

utils/
└── auth.js                   # Auth utilities and API calls
```

## Authentication Flow

1. **Registration**: User signs up → Email verification required
2. **Email Verification**: User clicks link → Account activated
3. **Login**: User authenticates → JWT token issued
4. **Protected Access**: Token validated → Access granted
5. **Token Expiry**: Automatic logout when token expires

## State Management

The authentication state is managed globally through React Context:

```javascript
const { user, isAuthenticated, loading, login, logout } = useAuth();
```

### Key Functions

- `login(token, user)` - Store auth data and update state
- `logout()` - Clear auth data and redirect
- `isAuthenticated` - Boolean auth status
- `user` - Current user data
- `loading` - Initial auth check status

## Styling

Uses Tailwind CSS with:

- Dark mode support
- Responsive design
- Consistent color scheme (blue primary)
- Smooth transitions and animations
- Clean, modern UI components

## Error Handling

- Form validation with real-time feedback
- API error messages displayed in alerts
- Network error handling
- Token expiry detection
- Graceful fallbacks for edge cases

## Security Considerations

- Tokens stored in localStorage (consider httpOnly cookies for production)
- Input validation on both client and server
- CORS configuration required for API calls
- Email verification prevents unauthorized access
- Protected routes redirect unauthenticated users

## Future Enhancements

- Password reset functionality
- Social login options
- Two-factor authentication
- Remember me functionality
- Session management improvements
- Refresh token implementation

## Testing the Flow

1. Start the backend server at `http://localhost:8000`
2. Start the frontend with `npm run dev`
3. Navigate to `http://localhost:3000`
4. Try the signup flow with a valid email
5. Check for verification email
6. Complete verification and login
7. Access the protected dashboard

## Notes

- The forgot password page is a placeholder (backend endpoint not implemented)
- Email verification requires a working email service in the backend
- The dashboard is a simple example - extend with actual meal tracking features
- Consider implementing refresh tokens for production use
