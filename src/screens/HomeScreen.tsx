import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import GlassyTitle from '../components/GlassyTitle';
import GlassPanel from '../components/GlassPanel';
import CountSelector from '../components/CountSelector';
import ImageUploader from '../components/ImageUploader';
import { glassStyles } from '../styles/glassStyles';

/**
 * HomeScreen - Main screen for image upload and generation
 */
export default function HomeScreen() {
  const [selectedCount, setSelectedCount] = useState(1);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  // Handle image selection
  const handleImageSelect = async () => {
    try {
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need camera roll permissions to upload images.');
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        setUploading(true);
        setUploadedImage(result.assets[0].uri);
        setError(null);
        setUploading(false);
      }
    } catch (err) {
      setError('Failed to upload image. Please try again.');
      setUploading(false);
    }
  };

  // Handle generate button press
  const handleGenerate = async () => {
    if (!uploadedImage) {
      Alert.alert('No Image', 'Please upload an image first.');
      return;
    }

    setGenerating(true);
    setError(null);

    try {
      // TODO: Implement API call to generate images
      // For now, just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert('Success', 'Generation started! Check the Results tab.');
      setGenerating(false);
    } catch (err) {
      setError('Failed to generate images. Please try again.');
      setGenerating(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={glassStyles.screenContent}
        showsVerticalScrollIndicator={false}
      >
        <GlassyTitle>
          {getGreeting()}, Muse
        </GlassyTitle>
        
        <CountSelector
          value={selectedCount}
          onChange={setSelectedCount}
          disabled={generating}
        />
        
        <ImageUploader
          uploadedImage={uploadedImage}
          uploading={uploading}
          onImageSelect={handleImageSelect}
        />
        
        <TouchableOpacity
          style={[
            glassStyles.glass3DButton,
            glassStyles.primaryButton,
            styles.generateButton,
            (generating || !uploadedImage) && styles.disabledButton,
          ]}
          onPress={handleGenerate}
          disabled={generating || !uploadedImage}
          activeOpacity={0.7}
        >
          <Text style={[glassStyles.buttonText, glassStyles.primaryButtonText]}>
            {generating ? 'Generating...' : 'Generate Photoshoot'}
          </Text>
        </TouchableOpacity>
        
        {error && (
          <GlassPanel style={styles.errorPanel} radius={16}>
            <Text style={styles.errorText}>{error}</Text>
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
  generateButton: {
    width: '100%',
  },
  disabledButton: {
    opacity: 0.5,
  },
  errorPanel: {
    width: '100%',
    marginTop: 12,
    padding: 12,
  },
  errorText: {
    color: '#F87171',
    textAlign: 'center',
    fontSize: 12,
  },
});

