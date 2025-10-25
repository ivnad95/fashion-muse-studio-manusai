# Fashion Muse Studio - React Native Mobile App

A complete React Native with Expo conversion of the Fashion Muse Studio web app. This mobile app features a premium glassmorphism UI design for AI-powered fashion photography editing.

## 🎨 Features

- **Glassmorphism UI Design**: Premium glass effects with backdrop blur throughout the app
- **4 Main Screens**: Home, Results, History, and Settings
- **Image Upload & Generation**: Select photos and generate fashion photoshoots
- **Count Selection**: Choose to generate 1, 2, 4, 6, or 8 images
- **Generation History**: View and manage past generations
- **User Settings**: Configure API keys, preferences, and account settings
- **Floating Island Navigation**: Beautiful bottom navigation bar with glass effects

## 📱 Screens

### 1. Home Screen
- Greeting message with time-based salutation
- Count selector (1, 2, 4, 6, 8 images)
- Image upload placeholder with logo
- Generate button
- Error display panel

### 2. Results Screen
- Grid display of generated images (2 columns)
- Image preview with overlay actions
- View and download buttons
- Progress indicator during generation
- Success message when complete
- Lightbox modal for full-size viewing

### 3. History Screen
- List of past generations
- Image grid for each generation (up to 4 images)
- Generation metadata (date, prompt, style)
- Delete functionality with confirmation
- Download individual images
- Empty state for no history

### 4. Settings Screen
- **Authentication Section**:
  - Google Sign In button (when not authenticated)
  - Profile display with image/initial (when authenticated)
  - Gemini API key status indicator
  - Sign Out button
- **Gemini API Key Configuration**:
  - Secure API key input field
  - Instructions for obtaining key
  - Remove stored key option
- **App Preferences**:
  - Display name input
  - Aspect ratio selector (Portrait, Square, Landscape)
  - Glass blur strength slider (10-50px)
  - Notifications toggle
  - Save settings button
- **Status Messages**: Success/error feedback

## 🎨 Design System

### Colors
```typescript
bgColor: '#0A133B'
lightColor1: '#002857'
lightColor2: '#004b93'
lightColor3: '#0A76AF'
silverLight: '#F5F7FA'
silverMid: '#C8CDD5'
silverDark: '#8A92A0'
```

### Glassmorphism Effects
- **Glass 3D Surface**: Semi-transparent background with blur effect
- **Glass 3D Button**: Interactive buttons with glass styling
- **Active States**: Enhanced glow and color changes
- **Shadows**: Multiple shadow layers for depth
- **Blur**: 20-30 intensity blur views using expo-blur

### Typography
- **Title**: 36px, bold, white with text shadow
- **Section Title**: 16px, semibold, white
- **Body Text**: 14px, regular, gray shades
- **Button Text**: 14-18px, semibold, silver colors

## 📦 Project Structure

```
FashionMuseRN/
├── App.tsx                          # Main app with navigation setup
├── src/
│   ├── screens/
│   │   ├── HomeScreen.tsx           # Home screen with image upload
│   │   ├── ResultsScreen.tsx        # Results grid display
│   │   ├── HistoryScreen.tsx        # Generation history
│   │   └── SettingsScreen.tsx       # User settings
│   ├── components/
│   │   ├── GlassPanel.tsx           # Glassmorphism panel component
│   │   ├── GlassyTitle.tsx          # Title with glass effect
│   │   ├── CountSelector.tsx        # Image count selector
│   │   ├── ImageUploader.tsx        # Image upload component
│   │   └── CustomTabBar.tsx         # Bottom navigation bar
│   └── styles/
│       └── glassStyles.ts           # Glassmorphism styles
├── assets/                          # Images and static assets
└── package.json                     # Dependencies
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development) or Android Emulator

### Install Dependencies
```bash
npm install
```

### Run the App

#### Development Server
```bash
npm start
```

#### iOS Simulator
```bash
npm run ios
```

#### Android Emulator
```bash
npm run android
```

#### Web Browser
```bash
npm run web
```

## 📚 Dependencies

### Core
- **expo**: ~54.0.13
- **react**: 19.1.0
- **react-native**: 0.81.4

### Navigation
- **@react-navigation/native**: ^7.1.18
- **@react-navigation/bottom-tabs**: ^7.4.9
- **react-native-screens**: ^4.17.1
- **react-native-safe-area-context**: ^5.6.1

### UI & Effects
- **expo-linear-gradient**: ^15.0.7 (for gradient backgrounds)
- **expo-blur**: ^15.0.7 (for glassmorphism blur effects)
- **react-native-svg**: Latest (for custom icons)

### Media
- **expo-image-picker**: ^17.0.8 (for image selection)
- **expo-file-system**: ^19.0.17 (for file operations)

## 🎯 Key Components

### GlassPanel
Reusable glassmorphism panel component with customizable blur intensity and border radius.

```typescript
<GlassPanel style={styles.container} radius={24} intensity={20}>
  <Text>Content here</Text>
</GlassPanel>
```

### GlassyTitle
Title component with glass effect background.

```typescript
<GlassyTitle>Welcome, User</GlassyTitle>
```

### CountSelector
Interactive count selector for choosing number of images (1, 2, 4, 6, 8).

```typescript
<CountSelector
  value={selectedCount}
  onChange={setSelectedCount}
  disabled={loading}
/>
```

### ImageUploader
Image upload component with placeholder and loading states.

```typescript
<ImageUploader
  uploadedImage={imageUri}
  uploading={uploading}
  onImageSelect={handleImageSelect}
/>
```

### CustomTabBar
Floating island navigation bar with glassmorphism effects.

## 🔧 Customization

### Adjust Blur Strength
Edit `src/styles/glassStyles.ts`:
```typescript
export const COLORS = {
  glassBlur: 24, // Change this value (10-50)
};
```

### Change Color Scheme
Update color constants in `src/styles/glassStyles.ts`:
```typescript
export const COLORS = {
  lightColor1: '#YOUR_COLOR',
  lightColor2: '#YOUR_COLOR',
  // ... etc
};
```

### Modify Navigation Icons
Edit `src/components/CustomTabBar.tsx` to change icon designs.

## 🎨 Design Highlights

### Glassmorphism Implementation
- Uses `expo-blur` BlurView for backdrop blur effects
- Semi-transparent backgrounds with rgba colors
- Multiple shadow layers for 3D depth
- Smooth transitions and hover states

### Responsive Layout
- Safe area handling for notched devices
- Flexible grid layouts
- ScrollView for content overflow
- Keyboard-aware inputs

### User Experience
- Smooth animations and transitions
- Loading states and progress indicators
- Error handling with user-friendly messages
- Confirmation dialogs for destructive actions
- Accessibility labels for screen readers

## 🔐 Authentication & API Integration

### Google Sign In
The app includes UI for Google authentication. To implement:
1. Set up Google OAuth in Expo
2. Configure redirect URIs
3. Implement sign-in/sign-out logic in SettingsScreen

### Gemini API Integration
The app supports Gemini API key configuration for image generation:
1. Users can enter their API key in Settings
2. Keys are stored securely (implement secure storage)
3. Used for generation requests

## 📝 TODO & Future Enhancements

- [ ] Implement actual API calls for image generation
- [ ] Add secure storage for API keys (expo-secure-store)
- [ ] Implement Google Sign In functionality
- [ ] Add image download functionality
- [ ] Implement generation history persistence
- [ ] Add theme selection (8 themes from web app)
- [ ] Add pose catalog selection (24 poses from web app)
- [ ] Implement real-time generation progress
- [ ] Add image sharing functionality
- [ ] Implement offline support
- [ ] Add analytics tracking
- [ ] Implement push notifications

## 🐛 Known Issues

- Logo image needs to be added to assets folder
- API integration is mocked (needs backend connection)
- Download functionality not implemented
- Google Sign In needs OAuth configuration

## 📄 License

This project is part of Fashion Muse Studio. All rights reserved.

## 🤝 Contributing

This is a conversion of the web app to React Native. Maintain design consistency with the web version when making changes.

## 📞 Support

For issues or questions, please refer to the main Fashion Muse Studio documentation.

---

**Note**: This is a complete frontend conversion. Backend API integration, authentication, and payment processing need to be implemented separately.

