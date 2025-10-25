import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Switch, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import GlassyTitle from '../components/GlassyTitle';
import GlassPanel from '../components/GlassPanel';
import { glassStyles, COLORS } from '../styles/glassStyles';

// Google Icon
const GoogleIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24">
    <Path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <Path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <Path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <Path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </Svg>
);

/**
 * SettingsScreen - User settings and configuration
 */
export default function SettingsScreen() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profileName, setProfileName] = useState('Muse');
  const [email, setEmail] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [hasStoredKey, setHasStoredKey] = useState(false);
  const [aspectRatio, setAspectRatio] = useState('portrait');
  const [blurStrength, setBlurStrength] = useState(24);
  const [notifications, setNotifications] = useState(true);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleSignIn = () => {
    // TODO: Implement Google Sign In
    console.log('Sign in with Google');
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    setProfileName('Muse');
    setEmail('');
    setProfileImage(null);
    setGeminiApiKey('');
    setHasStoredKey(false);
  };

  const handleSaveSettings = () => {
    // TODO: Implement save settings API call
    setStatusMessage('Settings saved successfully!');
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleRemoveKey = () => {
    setGeminiApiKey('');
    setHasStoredKey(false);
    setStatusMessage('Gemini API key removed from your account.');
    setTimeout(() => setStatusMessage(null), 3000);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={glassStyles.screenContent}
        showsVerticalScrollIndicator={false}
      >
        <GlassyTitle>Settings</GlassyTitle>
        
        {/* Authentication Section */}
        <GlassPanel style={styles.section} radius={24}>
          <Text style={styles.sectionTitle}>Account & Authentication</Text>
          
          {isAuthenticated ? (
            <View style={styles.authContent}>
              <View style={styles.profileRow}>
                {profileImage ? (
                  <Image 
                    source={{ uri: profileImage }}
                    style={styles.profileImage}
                  />
                ) : (
                  <View style={styles.profilePlaceholder}>
                    <Text style={styles.profileInitial}>
                      {profileName.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                )}
                <View style={styles.profileInfo}>
                  <Text style={styles.profileName}>{profileName}</Text>
                  <Text style={styles.profileEmail}>{email}</Text>
                </View>
              </View>
              
              <View style={[
                styles.statusBanner,
                hasStoredKey ? styles.successBanner : styles.warningBanner
              ]}>
                <Text style={[
                  styles.statusText,
                  hasStoredKey ? styles.successText : styles.warningText
                ]}>
                  {hasStoredKey
                    ? '✓ Gemini API key is securely stored. Generations will use your Google account automatically.'
                    : 'Add your Gemini API key below so generations can run under your Google account.'}
                </Text>
                {hasStoredKey && (
                  <TouchableOpacity onPress={handleRemoveKey}>
                    <Text style={styles.removeKeyText}>Remove stored Gemini API key</Text>
                  </TouchableOpacity>
                )}
              </View>
              
              <TouchableOpacity
                style={[glassStyles.glass3DButton, glassStyles.deleteButton, styles.signOutButton]}
                onPress={handleSignOut}
              >
                <Text style={glassStyles.deleteButtonText}>Sign Out</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.authContent}>
              <View style={styles.statusBanner}>
                <Text style={styles.warningText}>
                  Sign in with Google to automatically use your Gemini API key
                </Text>
                <Text style={styles.subText}>
                  No manual API key configuration needed
                </Text>
              </View>
              
              <TouchableOpacity
                style={[glassStyles.glass3DButton, glassStyles.primaryButton, styles.signInButton]}
                onPress={handleSignIn}
              >
                <GoogleIcon />
                <Text style={[glassStyles.buttonText, { marginLeft: 8 }]}>
                  Sign in with Google
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </GlassPanel>

        {/* Gemini API Key Section */}
        <GlassPanel style={styles.section} radius={24}>
          <Text style={styles.sectionTitle}>Gemini API Key Configuration</Text>
          
          <Text style={styles.description}>
            {isAuthenticated
              ? `Provide the Gemini API key associated with ${email}. We store it securely and use it automatically for generations.`
              : 'Not signed in? Paste your Gemini API key below so we can run generations on your behalf. You can create one at makersuite.google.com/app/apikey.'}
          </Text>
          
          {isAuthenticated && hasStoredKey && (
            <Text style={styles.infoText}>
              A key is already stored. Leave the field blank to keep it, or paste a new key to replace it.
            </Text>
          )}
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Gemini API Key</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your Gemini API key"
              placeholderTextColor="#6B7280"
              value={geminiApiKey}
              onChangeText={setGeminiApiKey}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
        </GlassPanel>

        {/* App Preferences Section */}
        <GlassPanel style={styles.section} radius={24}>
          <Text style={styles.sectionTitle}>App Preferences</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Display Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              placeholderTextColor="#6B7280"
              value={profileName}
              onChangeText={setProfileName}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Aspect Ratio</Text>
            <View style={styles.pickerContainer}>
              {['portrait', 'square', 'landscape'].map((ratio) => (
                <TouchableOpacity
                  key={ratio}
                  style={[
                    styles.pickerOption,
                    aspectRatio === ratio && styles.pickerOptionActive
                  ]}
                  onPress={() => setAspectRatio(ratio)}
                >
                  <Text style={[
                    styles.pickerText,
                    aspectRatio === ratio && styles.pickerTextActive
                  ]}>
                    {ratio.charAt(0).toUpperCase() + ratio.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Glass Blur ({blurStrength}px)</Text>
            <View style={styles.sliderContainer}>
              <Text style={styles.sliderValue}>10</Text>
              <View style={styles.slider}>
                <View style={[styles.sliderTrack, { width: `${((blurStrength - 10) / 40) * 100}%` }]} />
              </View>
              <Text style={styles.sliderValue}>50</Text>
            </View>
          </View>
          
          <View style={styles.switchRow}>
            <Text style={styles.label}>Notifications</Text>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: '#374151', true: COLORS.lightColor3 }}
              thumbColor={notifications ? COLORS.silverLight : '#9CA3AF'}
            />
          </View>
          
          <TouchableOpacity
            style={[glassStyles.glass3DButton, glassStyles.primaryButton, styles.saveButton]}
            onPress={handleSaveSettings}
          >
            <Text style={[glassStyles.buttonText, glassStyles.primaryButtonText]}>
              Save Settings
            </Text>
          </TouchableOpacity>
        </GlassPanel>

        {statusMessage && (
          <GlassPanel style={styles.statusMessagePanel} radius={16}>
            <Text style={styles.statusMessageText}>{statusMessage}</Text>
          </GlassPanel>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    padding: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  authContent: {
    gap: 16,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  profilePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#374151',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  profileInitial: {
    color: '#9CA3AF',
    fontSize: 32,
    fontWeight: '600',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  profileEmail: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  statusBanner: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  successBanner: {
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
    borderColor: 'rgba(34, 197, 94, 0.5)',
  },
  warningBanner: {
    backgroundColor: 'rgba(234, 179, 8, 0.2)',
    borderColor: 'rgba(234, 179, 8, 0.5)',
  },
  statusText: {
    fontSize: 14,
    marginBottom: 8,
  },
  successText: {
    color: '#4ADE80',
  },
  warningText: {
    color: '#FBBF24',
  },
  subText: {
    color: '#9CA3AF',
    fontSize: 12,
  },
  removeKeyText: {
    color: '#FCA5A5',
    fontSize: 12,
    textDecorationLine: 'underline',
  },
  signInButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signOutButton: {
    width: '100%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  description: {
    color: '#9CA3AF',
    fontSize: 14,
    marginBottom: 12,
  },
  infoText: {
    color: '#86EFAC',
    fontSize: 12,
    marginBottom: 12,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 8,
    padding: 12,
    color: '#1F2937',
    fontSize: 14,
  },
  pickerContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  pickerOption: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
  },
  pickerOptionActive: {
    backgroundColor: COLORS.lightColor3,
  },
  pickerText: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  pickerTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  slider: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
  },
  sliderTrack: {
    height: '100%',
    backgroundColor: COLORS.lightColor3,
    borderRadius: 2,
  },
  sliderValue: {
    color: '#9CA3AF',
    fontSize: 12,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  saveButton: {
    width: '100%',
  },
  statusMessagePanel: {
    padding: 12,
  },
  statusMessageText: {
    color: '#4ADE80',
    fontSize: 14,
    textAlign: 'center',
  },
});

