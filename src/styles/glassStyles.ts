import { StyleSheet } from 'react-native';

// Color constants matching the web app
export const COLORS = {
  bgColor: '#0A133B',
  lightColor1: '#002857',
  lightColor2: '#004b93',
  lightColor3: '#0A76AF',
  silverLight: '#F5F7FA',
  silverMid: '#C8CDD5',
  silverDark: '#8A92A0',
  silverGlow: 'rgba(200, 205, 213, 0.4)',
  shadowColor: 'rgba(0,0,0,0.5)',
  glassBlur: 24,
};

export const glassStyles = StyleSheet.create({
  // Glass 3D Surface - Main glassmorphism effect
  glass3DSurface: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.5,
    shadowRadius: 35,
    elevation: 15,
  },

  // Glass 3D Button
  glass3DButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 8,
  },

  // Button text styling
  buttonText: {
    color: COLORS.silverMid,
    fontWeight: '600',
    textShadowColor: COLORS.shadowColor,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  // Active button state
  activeButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },

  // Active button text
  activeButtonText: {
    color: COLORS.silverLight,
    textShadowColor: COLORS.silverGlow,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },

  // Number chip (count selector)
  numberChip: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Active number chip
  activeNumberChip: {
    backgroundColor: COLORS.silverDark,
  },

  // Active number chip text
  activeNumberChipText: {
    color: '#333',
    textShadowColor: 'transparent',
  },

  // Primary button
  primaryButton: {
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Primary button text
  primaryButtonText: {
    fontSize: 18,
  },

  // Delete button
  deleteButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 80, 80, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 150, 150, 0.15)',
  },

  // Delete button text
  deleteButtonText: {
    color: 'rgba(255, 150, 150, 1)',
  },

  // Screen content container
  screenContent: {
    flex: 1,
    padding: 20,
    paddingBottom: 100,
  },

  // Title container
  titleContainer: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 20,
  },

  // Title text
  titleText: {
    color: '#fff',
    fontSize: 36,
    fontWeight: '700',
    lineHeight: 40,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },

  // Panel container
  panelContainer: {
    padding: 16,
    borderRadius: 24,
  },

  // Image placeholder
  imagePlaceholder: {
    width: '100%',
    aspectRatio: 4 / 5,
    borderRadius: 20,
    marginBottom: 16,
    overflow: 'hidden',
  },

  // Image container
  imageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Loader
  loader: {
    width: 32,
    height: 32,
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.1)',
    borderTopColor: COLORS.silverMid,
    borderRadius: 16,
  },

  // Loading pulse overlay
  loadingPulse: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

