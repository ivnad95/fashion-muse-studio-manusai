# Fashion Muse Studio - React Native Mobile App

The **Fashion Muse Studio** mobile application is a complete, high-fidelity conversion of the original web interface, built using **React Native with Expo**. It delivers a premium, AI-powered fashion photography editing experience directly to mobile devices, distinguished by a modern **glassmorphism** UI design.

This project serves as a robust, fully-featured frontend template, ready for integration with a powerful backend for image generation and user management.

## 🎨 Core Features

The application is engineered for a seamless and intuitive user experience, focusing on the core workflow of AI-driven image generation.

### 1. **Premium Glassmorphism Interface**
- **High-Fidelity Design**: A pixel-perfect recreation of the web app's aesthetic, utilizing `expo-blur` for authentic backdrop blur effects.
- **Floating Island Navigation**: An elegant, glass-effect bottom tab bar for effortless screen switching.
- **Consistent Styling**: Centralized design system (`glassStyles.ts`) ensures uniform application of colors, shadows, and glass effects across all components.

### 2. **AI Generation Workflow**
- **Intuitive Home Screen**: A clean interface for initiating new fashion photoshoots.
- **Image Upload**: Seamless integration with the device's media library for uploading source images.
- **Count Selector**: Allows users to precisely control the output, choosing to generate **1, 2, 4, 6, or 8** final images per request.

### 3. **User Management & History**
- **Generation History**: Dedicated screen to review and manage past AI-generated photoshoots, including metadata (date, prompt, style).
- **Settings & Preferences**: Comprehensive controls for user experience, including display name, preferred image aspect ratio (Portrait, Square, Landscape), and UI customization (Glass Blur Strength).
- **API Configuration**: Secure input fields for managing the **Gemini API Key**, designed to integrate with a secure backend storage solution.

## 📱 Application Screens

The app is structured around four primary navigation tabs, ensuring a clear and logical user journey.

| Screen | Primary Functionality | Key Components |
| :--- | :--- | :--- |
| **Home** | Image Upload & Generation Request | `ImageUploader`, `CountSelector`, `GlassyTitle` |
| **Results** | Viewing and Managing New Generations | 2-Column Grid, Lightbox Modal, Progress Indicator |
| **History** | Reviewing Past Generations | Generation List, Image Grids, Delete/Download Actions |
| **Settings** | Account, API Key, and App Preferences | Authentication UI, `Switch`, `TextInput`, Aspect Ratio Picker |

## 🎨 Design System Deep Dive

The design is built on a "Deep Sea" aesthetic, combining dark, rich blues with luminous silver accents to enhance the glassmorphism effect.

### Colors
The color palette is defined in `src/styles/glassStyles.ts`:

| Variable | Hex Code | Purpose |
| :--- | :--- | :--- |
| `bgColor` | `#0A133B` | Primary background deep blue |
| `lightColor1` | `#002857` | Gradient start/mid point |
| `lightColor2` | `#004b93` | Gradient mid point |
| `lightColor3` | `#0A76AF` | Accent color, progress bars, active states |
| `silverLight` | `#F5F7FA` | Primary text and active icon color |
| `silverMid` | `#C8CDD5` | Secondary text and inactive icon color |
| `silverDark` | `#8A92A0` | Tertiary text and chip background |

### Glassmorphism Implementation
The core of the design is the **Glass 3D Surface**, implemented in `GlassPanel.tsx` using `expo-blur`.

| Style Property | Value | Rationale |
| :--- | :--- | :--- |
| **Background** | `rgba(255, 255, 255, 0.03)` | Extreme transparency to let the gradient background show through. |
| **Border** | `rgba(255, 255, 255, 0.1)` | Subtle white outline for definition. |
| **Blur Intensity** | `20-30` | Optimal range for a frosted glass look without obscuring content. |
| **Shadows** | Multiple layers (e.g., `shadowRadius: 35`) | Creates a floating, three-dimensional effect, crucial for the "3D Surface" feel. |

## 📦 Project Structure

```
FashionMuseRN/
├── App.tsx                          # Main app with navigation setup
├── src/
│   ├── screens/                     # Primary navigation views
│   │   ├── HomeScreen.tsx
│   │   ├── ResultsScreen.tsx
│   │   ├── HistoryScreen.tsx
│   │   └── SettingsScreen.tsx
│   ├── components/                  # Reusable UI elements
│   │   ├── GlassPanel.tsx           # Core glassmorphism container
│   │   ├── GlassyTitle.tsx
│   │   ├── CountSelector.tsx
│   │   ├── ImageUploader.tsx
│   │   └── CustomTabBar.tsx         # Floating bottom navigation
│   └── styles/
│       └── glassStyles.ts           # Centralized design system and constants
├── assets/                          # Images and static assets (e.g., logo.png)
├── package.json                     # Project dependencies and scripts
└── README_Refined.md                # This document
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator

### Install Dependencies
```bash
npm install
```

### Run the App

```bash
npm start
```
Scan the QR code with the Expo Go app or select a simulator/emulator option.

## 📚 Dependencies

This project relies on key Expo and React Native libraries to achieve the desired functionality and aesthetic:

| Category | Package | Purpose |
| :--- | :--- | :--- |
| **UI Effects** | `expo-blur` | Essential for the glassmorphism backdrop blur. |
| | `expo-linear-gradient` | Used for the rich, deep-sea background gradient. |
| **Navigation** | `@react-navigation/bottom-tabs` | The foundation for the floating island navigation. |
| | `react-native-safe-area-context` | Ensures UI elements correctly handle device notches and safe areas. |
| **Media** | `expo-image-picker` | Handles seamless image selection from the device library. |
| | `react-native-svg` | Used for rendering custom, scalable vector icons (e.g., navigation icons). |

## 📝 Future Enhancements (Roadmap)

This section outlines high-value features for future development, transforming the frontend into a fully commercial application.

- [ ] **Full-Stack Integration:** Implement secure backend endpoints for image generation requests and result retrieval.
- [ ] **Secure Storage:** Utilize `expo-secure-store` to safely encrypt and store sensitive user data, such as the Gemini API Key.
- [ ] **Advanced Authentication:** Implement a robust authentication flow, prioritizing **Manus AI Authentication** as the primary sign-in method, with Google Sign-In as an optional secondary method.
- [ ] **Payment Gateway:** Integrate **Stripe** for credit purchases and subscription management, with all transactions configured for **British Pounds (£)**.
- [ ] **Theming Engine:** Implement the full suite of **8 themes** and **24 pose catalogs** from the original web application, allowing users to customize their generation experience.
- [ ] **Real-Time Progress:** Utilize WebSockets or long-polling to provide users with live updates and a percentage completion for their image generation job.
- [ ] **Image Sharing:** Add native sharing functionality to easily share generated photoshoots to social media platforms.
- [ ] **Offline Mode:** Implement caching for history and settings to ensure a smooth experience even without an internet connection.
- [ ] **Analytics:** Integrate a mobile analytics platform (e.g., Firebase Analytics) to track key user flows and feature adoption.
- [ ] **Push Notifications:** Implement push notifications to alert users when a long-running image generation task is complete.

---

**Note**: This document focuses on the frontend conversion. The implementation of the backend API, secure storage, and payment processing is required to make this a fully functional, production-ready application.

