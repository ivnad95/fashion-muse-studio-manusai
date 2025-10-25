# Fashion Muse Studio: Design Theme Specification

This document provides a comprehensive specification of the visual design theme for the Fashion Muse Studio mobile application, focusing on the core aesthetic, color palette, typography, and the implementation of the signature glassmorphism effect.

## 1. Core Aesthetic: "Deep Sea Glass"

The design theme is built around a **premium, minimalist, and futuristic** aesthetic, which we term **"Deep Sea Glass."** This theme is characterized by deep, rich blue backgrounds that evoke the ocean's depths, contrasted with luminous, frosted glass surfaces. The goal is to create a UI that is both visually striking and highly functional, providing a sense of depth and luxury.

## 2. Color Palette Specification

The color scheme is anchored by a gradient of deep blues, which serves as the backdrop for all glassmorphism effects. The palette is defined in `src/styles/glassStyles.ts`.

| Variable | Hex Code | RGB/RGBA | Purpose | Rationale |
| :--- | :--- | :--- | :--- | :--- |
| **`bgColor`** | `#0A133B` | `rgb(10, 19, 59)` | Primary Background | The deepest blue, providing the necessary contrast for the glass elements to float above. |
| **`lightColor1`** | `#002857` | `rgb(0, 40, 87)` | Gradient Start | Used in the background gradient to create a subtle light source and depth. |
| **`lightColor2`** | `#004b93` | `rgb(0, 75, 147)` | Gradient Midpoint | A brighter blue used for gradients and subtle highlights. |
| **`lightColor3`** | `#0A76AF` | `rgb(10, 118, 175)` | Accent/Active State | The primary accent color, used for active navigation, progress bars, and key interactive elements. |
| **`silverLight`** | `#F5F7FA` | `rgb(245, 247, 250)` | Primary Text/Icons | Near-white color for maximum readability against the dark background. |
| **`silverMid`** | `#C8CDD5` | `rgb(200, 205, 213)` | Secondary Text/Icons | Used for secondary labels, inactive states, and less critical information. |
| **`silverDark`** | `#8A92A0` | `rgb(138, 146, 160)` | Tertiary Text/Chips | Used for placeholders, subtle dividers, and background elements like filter chips. |

## 3. Glassmorphism Implementation

The signature glassmorphism effect is achieved through the custom **`GlassPanel`** component, which encapsulates the styling logic. This effect is crucial for providing visual separation and depth.

| Property | Implementation Details | Rationale |
| :--- | :--- | :--- |
| **Backdrop Blur** | Achieved using `expo-blur`'s `BlurView` component. | Provides the authentic frosted glass effect by blurring the background content. |
| **Background Color** | `rgba(255, 255, 255, 0.03)` | Extremely low opacity white to create a luminous, semi-transparent surface that allows the deep blue background to shine through. |
| **Border** | `rgba(255, 255, 255, 0.1)` (1px solid) | A subtle, light border is essential to define the edges of the glass panel and prevent it from blending into the background. |
| **Shadows** | Multiple shadow layers (e.g., `shadowRadius: 35`) | Creates the illusion of the glass panel floating above the background, enhancing the 3D depth. |
| **Blur Intensity** | Customizable, typically set between **20 and 30** | The intensity is fine-tuned to provide a perfect balance between visibility of the background and readability of the foreground content. |

**Key Glassmorphism Components:**
*   **`GlassPanel`**: The primary reusable container for all content blocks.
*   **`CustomTabBar`**: The "Floating Island" navigation bar, which uses the glass effect to appear as a detached, luminous element at the bottom of the screen.

## 4. Typography and Text Styles

The application utilizes a clean, modern, and highly legible sans-serif typeface (default system font for React Native) to maintain a professional feel.

| Style | Size (px) | Weight | Color | Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Title** | 36 | Bold | `silverLight` | Main screen titles (e.g., "Home," "Settings"). Includes a subtle text shadow for lift. |
| **Section Title** | 16 | Semi-Bold | `silverLight` | Headers for sections within screens (e.g., "App Preferences"). |
| **Body Text** | 14 | Regular | `silverMid` | Standard content, descriptions, and placeholder text. |
| **Button Text** | 14-18 | Semi-Bold | `silverLight` | Text within primary and secondary interactive buttons. |

## 5. Interface Layout and Usability

The interface adheres to a **minimalist** design philosophy, prioritizing content and key actions.

*   **Minimal Component Count**: All options are organized into logical sections or accordions to prevent screen clutter, especially on mobile devices.
*   **Safe Area Compliance**: All screens are built with `react-native-safe-area-context` to ensure content is correctly displayed around device notches and system bars.
*   **Visual Hierarchy**: The use of the `GlassPanel` and the contrast of `lightColor3` for active states clearly guides the user's eye to the most important elements and actions.
*   **Floating Navigation**: The detached `CustomTabBar` maximizes screen real estate for content while providing persistent, easy-to-reach navigation.

This specification ensures that any further development or modification maintains the high visual fidelity and premium aesthetic of the Fashion Muse Studio application.
