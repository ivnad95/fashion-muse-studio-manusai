import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Switch, Image, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import GlassyTitle from '../components/GlassyTitle';
import GlassPanel from '../components/GlassPanel';
import { glassStyles, COLORS } from '../styles/glassStyles';
import { useAuthStore } from '../store/authStore';
import { authService } from '../services/authService';

// Google Icon
const GoogleIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24">
    <Path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <Path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <Path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <Path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </Svg>
);

const LogoutIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF5050" strokeWidth="2">
    <Path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </Svg>
);

/**
 * SettingsScreen - User settings and configuration
 */
export default function SettingsScreen() {
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [aspectRatio, setAspectRatio] = useState('portrait');
  const [blurStrength, setBlurStrength] = useState(24);
  const [notifications, setNotifications] = useState(true);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Get auth state
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Load settings on mount
  useEffect(() => {
    if (isAuthenticated && user) {
      loadSettings();
    }
  }, [isAuthenticated, user]);

  // Load user settings from backend
  const loadSettings = async () => {
    try {
      const profile = await authService.getProfile();
      if (profile.settings) {
        setGeminiApiKey(profile.settings.geminiApiKey || '');
        setAspectRatio(profile.settings.aspectRatio || 'portrait');
        setBlurStrength(profile.settings.blurStrength || 24);
        setNotifications(profile.settings.notifications !== false);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  // Handle sign out
  const handleSignOut = async () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', onPress: () => {}, style: 'cancel' },
      {
        text: 'Sign Out',
        onPress: async () => {
          try {
            setLoading(true);
            await authService.signOut();
            Alert.alert('Success', 'Signed out successfully');
          } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to sign out');
          } finally {
            setLoading(false);
          }
        },
        style: 'destructive',
      },
    ]);
  };

  // Handle save settings
  const handleSaveSettings = async () => {
    if (!user) return;

    try {
      setLoading(true);
      await authService.updateProfile({
        settings: {
          geminiApiKey,
          aspectRatio,
          blurStrength,
          notifications,
        },
      });
      setStatusMessage('Settings saved successfully!');
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  // Handle remove API key
  const handleRemoveKey = async () => {
    Alert.alert(
      'Remove API Key',
      'Are you sure you want to remove your Gemini API key?',
      [
        { text: 'Cancel', onPress: () => {}, style: 'cancel' },
        {
          text: 'Remove',
          onPress: async () => {
            try {
              setLoading(true);
              setGeminiApiKey('');
              await handleSaveSettings();
              setStatusMessage('Gemini API key removed from your account.');
              setTimeout(() => setStatusMessage(null), 3000);
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to remove API key');
            } finally {
              setLoading(false);
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  // Not authenticated state
  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <GlassyTitle title="Settings" />
            <Text style={styles.subtitle}>Sign in to access settings</Text>
          </View>

          <GlassPanel style={styles.section}>
            <Text style={styles.sectionTitle}>Account & Authentication</Text>
            <Text style={styles.description}>
              Sign in with your account to access all features and save your preferences.
            </Text>
            <TouchableOpacity style={styles.signInButton}>
              <GoogleIcon />
              <Text style={styles.signInButtonText}>Sign In with Google</Text>
            </TouchableOpacity>
          </GlassPanel>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <GlassyTitle title="Settings" />
          <Text style={styles.subtitle}>Manage your preferences</Text>
        </View>

        {/* Status Message */}
        {statusMessage && (
          <GlassPanel style={styles.successPanel}>
            <Text style={styles.successText}>{statusMessage}</Text>
          </GlassPanel>
        )}

        {/* Profile Section */}
        <GlassPanel style={styles.section}>
          <Text style={styles.sectionTitle}>Profile</Text>
          <View style={styles.profileInfo}>
            <View>
              <Text style={styles.profileName}>{user?.name || 'User'}</Text>
              <Text style={styles.profileEmail}>{user?.email}</Text>
            </View>
            {user?.credits !== undefined && (
              <View style={styles.creditsBadge}>
                <Text style={styles.creditsText}>{user.credits} credits</Text>
              </View>
            )}
          </View>
        </GlassPanel>

        {/* API Configuration Section */}
        <GlassPanel style={styles.section}>
          <Text style={styles.sectionTitle}>API Configuration</Text>
          
          <View style={styles.settingGroup}>
            <Text style={styles.settingLabel}>Gemini API Key</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your Gemini API key"
              placeholderTextColor="#8A92A0"
              value={geminiApiKey}
              onChangeText={setGeminiApiKey}
              secureTextEntry={true}
              editable={!loading}
            />
            {geminiApiKey && (
              <TouchableOpacity
                style={styles.removeButton}
                onPress={handleRemoveKey}
                disabled={loading}
              >
                <Text style={styles.removeButtonText}>Remove Key</Text>
              </TouchableOpacity>
            )}
          </View>
        </GlassPanel>

        {/* Preferences Section */}
        <GlassPanel style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>

          {/* Aspect Ratio */}
          <View style={styles.settingGroup}>
            <Text style={styles.settingLabel}>Image Aspect Ratio</Text>
            <View style={styles.optionGroup}>
              {['portrait', 'landscape', 'square'].map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.optionButton,
                    aspectRatio === option && styles.optionButtonActive,
                  ]}
                  onPress={() => setAspectRatio(option)}
                  disabled={loading}
                >
                  <Text
                    style={[
                      styles.optionButtonText,
                      aspectRatio === option && styles.optionButtonTextActive,
                    ]}
                  >
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Blur Strength */}
          <View style={styles.settingGroup}>
            <Text style={styles.settingLabel}>UI Blur Strength</Text>
            <View style={styles.sliderContainer}>
              <Text style={styles.sliderValue}>{blurStrength}</Text>
              <View style={styles.slider}>
                <View
                  style={[
                    styles.sliderFill,
                    { width: `${(blurStrength / 50) * 100}%` },
                  ]}
                />
              </View>
            </View>
          </View>

          {/* Notifications */}
          <View style={styles.settingGroup}>
            <View style={styles.notificationRow}>
              <Text style={styles.settingLabel}>Notifications</Text>
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                disabled={loading}
                trackColor={{ false: '#8A92A0', true: '#0A76AF' }}
              />
            </View>
          </View>
        </GlassPanel>

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveButton, loading && styles.saveButtonDisabled]}
          onPress={handleSaveSettings}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#F5F7FA" size="small" />
          ) : (
            <Text style={styles.saveButtonText}>Save Settings</Text>
          )}
        </TouchableOpacity>

        {/* Sign Out Button */}
        <TouchableOpacity
          style={styles.signOutButton}
          onPress={handleSignOut}
          disabled={loading}
        >
          <LogoutIcon />
          <Text style={styles.signOutButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 24,
  },
  subtitle: {
    color: '#C8CDD5',
    fontSize: 14,
    marginTop: 8,
    fontWeight: '400',
  },
  successPanel: {
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(74, 222, 128, 0.1)',
  },
  successText: {
    color: '#4ADE80',
    fontSize: 12,
    fontWeight: '500',
  },
  section: {
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  sectionTitle: {
    color: '#F5F7FA',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  description: {
    color: '#C8CDD5',
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  profileInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileName: {
    color: '#F5F7FA',
    fontSize: 16,
    fontWeight: '600',
  },
  profileEmail: {
    color: '#8A92A0',
    fontSize: 12,
    marginTop: 4,
  },
  creditsBadge: {
    backgroundColor: 'rgba(10, 118, 175, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  creditsText: {
    color: '#0A76AF',
    fontSize: 12,
    fontWeight: '600',
  },
  settingGroup: {
    marginBottom: 16,
  },
  settingLabel: {
    color: '#F5F7FA',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#F5F7FA',
    fontSize: 14,
    marginBottom: 8,
  },
  removeButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255, 80, 80, 0.1)',
    borderRadius: 6,
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#FF5050',
    fontSize: 12,
    fontWeight: '600',
  },
  optionGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  optionButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
  },
  optionButtonActive: {
    backgroundColor: 'rgba(10, 118, 175, 0.2)',
    borderColor: '#0A76AF',
  },
  optionButtonText: {
    color: '#C8CDD5',
    fontSize: 12,
    fontWeight: '600',
  },
  optionButtonTextActive: {
    color: '#0A76AF',
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sliderValue: {
    color: '#0A76AF',
    fontSize: 14,
    fontWeight: '600',
    minWidth: 30,
  },
  slider: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  sliderFill: {
    height: '100%',
    backgroundColor: '#0A76AF',
    borderRadius: 2,
  },
  notificationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  signInButton: {
    flexDirection: 'row',
    backgroundColor: '#0A76AF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  signInButtonText: {
    color: '#F5F7FA',
    fontSize: 14,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#0A76AF',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#F5F7FA',
    fontSize: 16,
    fontWeight: '600',
  },
  signOutButton: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 80, 80, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  signOutButtonText: {
    color: '#FF5050',
    fontSize: 14,
    fontWeight: '600',
  },
});

