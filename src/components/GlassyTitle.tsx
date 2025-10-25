import React from 'react';
import { Text, ViewStyle } from 'react-native';
import GlassPanel from './GlassPanel';
import { glassStyles } from '../styles/glassStyles';

interface GlassyTitleProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

/**
 * GlassyTitle - Title component with glass effect background
 */
export default function GlassyTitle({ children, style }: GlassyTitleProps) {
  return (
    <GlassPanel style={[glassStyles.titleContainer, style]} radius={20}>
      <Text style={glassStyles.titleText}>
        {children}
      </Text>
    </GlassPanel>
  );
}

