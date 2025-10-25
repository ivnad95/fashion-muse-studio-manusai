import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { glassStyles } from '../styles/glassStyles';

interface GlassPanelProps {
  children: React.ReactNode;
  style?: ViewStyle;
  radius?: number;
  intensity?: number;
}

/**
 * GlassPanel - Glassmorphism UI surface component
 * Creates a beautiful glass effect with backdrop blur
 */
export default function GlassPanel({ 
  children, 
  style, 
  radius = 28,
  intensity = 20,
}: GlassPanelProps) {
  return (
    <View style={[
      glassStyles.glass3DSurface,
      { borderRadius: radius },
      style,
    ]}>
      <BlurView intensity={intensity} style={StyleSheet.absoluteFill}>
        {children}
      </BlurView>
    </View>
  );
}

