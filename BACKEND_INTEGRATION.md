# Backend Integration Guide

This document describes the integration of the **rork-fashion-muse-studio-last** backend with the React Native Expo frontend application.

## Overview

The React Native application is now fully integrated with the backend API, providing:

1. **Authentication** - User sign-in/sign-up with JWT tokens
2. **Image Generation** - AI-powered fashion photo generation using Rork API
3. **History Management** - Store and retrieve user generation history
4. **User Profiles** - Manage user settings and preferences
5. **Credit System** - Track and manage user credits

## Architecture

### Frontend Structure

```
src/
├── lib/
│   ├── api.ts              # Axios client with interceptors
│   └── trpc.ts             # TRPC client configuration
├── services/
│   ├── authService.ts      # Authentication API calls
│   ├── generationService.ts # Image generation API calls
│   └── index.ts            # Service exports
├── store/
│   ├── authStore.ts        # Zustand auth state management
│   └── generationStore.ts  # Zustand generation state management
└── screens/
    ├── HomeScreen.tsx      # Image upload and generation
    ├── ResultsScreen.tsx   # Display generated images
    ├── HistoryScreen.tsx   # Manage generation history
    └── SettingsScreen.tsx  # User settings and preferences
```

### Backend Integration Points

#### 1. Authentication Service (`src/services/authService.ts`)

**Endpoints:**
- `POST /api/auth/sign-up` - Register new user
- `POST /api/auth/sign-in` - Login user
- `POST /api/auth/sign-out` - Logout user
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile

**Usage:**
```typescript
import { authService } from '../services/authService';

// Sign up
const response = await authService.signUp({
  email: 'user@example.com',
  password: 'password123',
  name: 'John Doe',
});

// Sign in
const response = await authService.signIn({
  email: 'user@example.com',
  password: 'password123',
});

// Sign out
await authService.signOut();
```

#### 2. Generation Service (`src/services/generationService.ts`)

**Endpoints:**
- `POST /api/generation/generate` - Generate images
- `GET /api/generation/history/:userId` - Get user history
- `DELETE /api/generation/history/:historyId` - Delete history item

**Usage:**
```typescript
import { generationService } from '../services/generationService';

// Generate images
const response = await generationService.generateImages(
  imageUri,
  count,
  userId
);

// Get history
const history = await generationService.getHistory(userId);

// Delete history item
await generationService.deleteHistory(historyId);
```

#### 3. State Management

**Auth Store (`src/store/authStore.ts`):**
```typescript
import { useAuthStore } from '../store/authStore';

const user = useAuthStore((state) => state.user);
const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
const setUser = useAuthStore((state) => state.setUser);
```

**Generation Store (`src/store/generationStore.ts`):**
```typescript
import { useGenerationStore } from '../store/generationStore';

const results = useGenerationStore((state) => state.results);
const isGenerating = useGenerationStore((state) => state.isGenerating);
const setResults = useGenerationStore((state) => state.setResults);
```

## Configuration

### Backend URL

Set the backend URL in `src/lib/api.ts`:

```typescript
export const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL || 'http://localhost:3000';
```

For production, set the environment variable:
```bash
EXPO_PUBLIC_BACKEND_URL=https://your-backend-url.com
```

### API Client

The API client is configured with:
- **Base URL**: Configurable via environment variable
- **Timeout**: 30 seconds
- **Interceptors**: Automatic token injection and error handling
- **Token Storage**: localStorage (web) / AsyncStorage (native)

## Screen Integration

### HomeScreen

**Features:**
- Image upload with validation
- Count selector (1, 2, 4, 6, 8 images)
- Real-time generation progress
- Error handling and user feedback

**State Management:**
- Uses `useGenerationStore` for generation state
- Uses `useAuthStore` for user authentication
- Calls `generationService.generateImages()` on button press

### ResultsScreen

**Features:**
- Display generated images in a grid
- View images in fullscreen modal
- Download images (placeholder)
- Real-time progress indicator

**State Management:**
- Reads results from `useGenerationStore`
- Displays generation progress
- Shows empty state when no results

### HistoryScreen

**Features:**
- Load user generation history
- Display history items with thumbnails
- Delete history items with confirmation
- Download images from history

**State Management:**
- Loads history on screen focus
- Uses `useAuthStore` for user ID
- Calls `generationService.getHistory()` and `deleteHistory()`

### SettingsScreen

**Features:**
- User profile display
- Gemini API key configuration
- Image aspect ratio preferences
- UI blur strength adjustment
- Notification settings
- Sign out functionality

**State Management:**
- Uses `useAuthStore` for user data
- Calls `authService.updateProfile()` to save settings
- Calls `authService.signOut()` for logout

## Error Handling

All services include comprehensive error handling:

```typescript
try {
  const response = await generationService.generateImages(...);
} catch (error: any) {
  console.error('Error:', error);
  // Display error to user
  Alert.alert('Error', error.message || 'Failed to generate images');
}
```

## Security Considerations

1. **Token Storage**: Auth tokens are stored in localStorage (web) or AsyncStorage (native)
2. **API Key Security**: API keys are sent securely via HTTPS
3. **Request Interceptors**: Automatic token injection for authenticated requests
4. **Error Handling**: Sensitive error messages are sanitized before display

## Testing

### Mock Backend

For development without a backend, you can mock the API responses:

```typescript
// In src/services/generationService.ts
async generateImages(imageUri: string, count: number, userId: string) {
  // Mock response
  return {
    images: Array(count).fill('https://via.placeholder.com/300x400'),
    historyId: 'mock-' + Date.now(),
  };
}
```

### Test Credentials

```
Email: test@example.com
Password: test123456
```

## Troubleshooting

### "Failed to fetch" errors

- Check that the backend is running and accessible
- Verify the `EXPO_PUBLIC_BACKEND_URL` environment variable
- Check CORS settings on the backend

### "Unauthorized" errors

- Ensure the user is authenticated
- Check that the auth token is being stored and sent correctly
- Verify the token hasn't expired

### "Image too large" errors

- Compress the image before uploading
- Maximum image size is 4MB
- Reduce image dimensions or quality

## Future Enhancements

1. **Real-time Notifications** - WebSocket integration for generation updates
2. **Batch Operations** - Generate multiple sets of images in parallel
3. **Image Editing** - Built-in image editor for post-processing
4. **Social Sharing** - Share generated images to social media
5. **Advanced Filters** - More customization options for image generation
6. **Payment Integration** - Stripe integration for credit purchases

## Support

For issues or questions about the backend integration, please refer to:
- Backend Repository: https://github.com/ivnad95/rork-fashion-muse-studio-last
- API Documentation: See backend README
- Issue Tracker: GitHub Issues

