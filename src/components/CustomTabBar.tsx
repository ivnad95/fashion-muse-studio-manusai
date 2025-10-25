import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import Svg, { Path, Circle, Polyline, Rect } from 'react-native-svg';
import { glassStyles, COLORS } from '../styles/glassStyles';

// Icon components
const HomeIcon = ({ color }: { color: string }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <Path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <Polyline points="9 22 9 12 15 12 15 22" />
  </Svg>
);

const ResultsIcon = ({ color }: { color: string }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <Rect x="3" y="3" width="7" height="7" rx="1" />
    <Rect x="14" y="3" width="7" height="7" rx="1" />
    <Rect x="3" y="14" width="7" height="7" rx="1" />
    <Rect x="14" y="14" width="7" height="7" rx="1" />
  </Svg>
);

const HistoryIcon = ({ color }: { color: string }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <Circle cx="12" cy="12" r="10" />
    <Polyline points="12 6 12 12 16 14" />
  </Svg>
);

const SettingsIcon = ({ color }: { color: string }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <Circle cx="12" cy="12" r="3" />
    <Path d="M19.4 15a1.49 1.49 0 0 0 .6-2l-1-3.4a1 1 0 0 0-1-1.2h-3.2a1 1 0 0 0-1-.6l-3.4-1a1.49 1.49 0 0 0-2 .6l-1 3.4a1 1 0 0 0-.6 1.2v3.2a1 1 0 0 0 .6 1l1 3.4a1.49 1.49 0 0 0 2 .6h3.2a1 1 0 0 0 1 .6l3.4 1a1.49 1.49 0 0 0 2-.6l1-3.4a1 1 0 0 0 .6-1.2z" />
  </Svg>
);

/**
 * CustomTabBar - Floating island navigation bar with glassmorphism
 */
export default function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const getIcon = (routeName: string, isFocused: boolean) => {
    const color = isFocused ? COLORS.silverLight : COLORS.silverMid;
    
    switch (routeName) {
      case 'Home':
        return <HomeIcon color={color} />;
      case 'Results':
        return <ResultsIcon color={color} />;
      case 'History':
        return <HistoryIcon color={color} />;
      case 'Settings':
        return <SettingsIcon color={color} />;
      default:
        return <HomeIcon color={color} />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={[glassStyles.glass3DSurface, styles.tabBar]}>
        <BlurView intensity={30} style={styles.blurView}>
          <View style={styles.tabBarInner}>
            {state.routes.map((route, index) => {
              const { options } = descriptors[route.key];
              const isFocused = state.index === index;

              const onPress = () => {
                const event = navigation.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                });

                if (!isFocused && !event.defaultPrevented) {
                  navigation.navigate(route.name);
                }
              };

              return (
                <TouchableOpacity
                  key={route.key}
                  accessibilityRole="button"
                  accessibilityState={isFocused ? { selected: true } : {}}
                  accessibilityLabel={options.tabBarAccessibilityLabel}
                  testID={options.tabBarTestID}
                  onPress={onPress}
                  style={[
                    glassStyles.glass3DButton,
                    styles.navButton,
                    isFocused && glassStyles.activeButton,
                  ]}
                  activeOpacity={0.7}
                >
                  {getIcon(route.name, isFocused)}
                </TouchableOpacity>
              );
            })}
          </View>
        </BlurView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
  tabBar: {
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
  },
  blurView: {
    flex: 1,
  },
  tabBarInner: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  navButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

