import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import GlassyTitle from '../components/GlassyTitle';
import GlassPanel from '../components/GlassPanel';
import CountSelector from '../components/CountSelector';
import ImageUploader from '../components/ImageUploader';
import { glassStyles } from '../styles/glassStyles';
import { useGenerationStore } from '../store/generationStore';
import { useAuthStore } from '../store/authStore';
import { generationService } from '../services/generationService';

/**
 * HomeScreen - Main screen for image upload and generation
 */
export default function HomeScreen() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get stores
  const selectedCount = useGenerationStore((state) => state.selectedCount);
  const setSelectedCount = useGenerationStore((state) => state.setSelectedCount);
  const isGenerating = useGenerationStore((state) => state.isGenerating);
  const setGenerating = useGenerationStore((state) => state.setGenerating);
  const setResults = useGenerationStore((state) => state.setResults);
  const setProgress = useGenerationStore((state) => state.setProgress);
  const user = useAuthStore((state) => state.user);

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
      console.error('Error selecting image:', err);
      setError('Failed to select image');
      setUploading(false);
    }
  };

  // Handle image generation
  const handleGenerate = async () => {
    if (!uploadedImage) {
      Alert.alert('No Image', 'Please select an image first');
      return;
    }

    if (!user) {
      Alert.alert('Not Authenticated', 'Please log in to generate images');
      return;
    }

    try {
      setGenerating(true);
      setError(null);
      setProgress(0);

      // Call the generation service
      const response = await generationService.generateImages(
        uploadedImage,
        selectedCount,
        user.id
      );

      // Convert response to results format
      const results = response.images.map((imageUri, index) => ({
        id: `${response.historyId}-${index}`,
        imageUri,
        createdAt: new Date().toISOString(),
      }));

      setResults(results);
      setProgress(100);

      // Show success message
      Alert.alert('Success', `Generated ${selectedCount} images successfully!`);

      // Clear the uploaded image
      setUploadedImage(null);
    } catch (err: any) {
      console.error('Error generating images:', err);
      setError(err.message || 'Failed to generate images');
      Alert.alert('Generation Failed', err.message || 'Failed to generate images');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <GlassyTitle title={`${getGreeting()}!`} />
          <Text style={styles.subtitle}>Create stunning fashion photos</Text>
        </View>

        {/* Error Message */}
        {error && (
          <GlassPanel style={styles.errorPanel}>
            <Text style={styles.errorText}>{error}</Text>
          </GlassPanel>
        )}

        {/* Image Upload Section */}
        <GlassPanel style={styles.uploadSection}>
          <Text style={styles.sectionTitle}>Upload Photo</Text>
          <ImageUploader
            image={uploadedImage}
            onSelect={handleImageSelect}
            loading={uploading}
          />
        </GlassPanel>

        {/* Count Selector Section */}
        <GlassPanel style={styles.countSection}>
          <Text style={styles.sectionTitle}>Number of Variations</Text>
          <CountSelector
            selected={selectedCount}
            onSelect={setSelectedCount}
            disabled={isGenerating}
          />
        </GlassPanel>

        {/* Generate Button */}
        <TouchableOpacity
          style={[
            styles.generateButton,
            (isGenerating || !uploadedImage) && styles.generateButtonDisabled,
          ]}
          onPress={handleGenerate}
          disabled={isGenerating || !uploadedImage}
        >
          {isGenerating ? (
            <>
              <ActivityIndicator color="#F5F7FA" size="small" />
              <Text style={styles.generateButtonText}>Generating...</Text>
            </>
          ) : (
            <Text style={styles.generateButtonText}>Generate Images</Text>
          )}
        </TouchableOpacity>

        {/* Progress Indicator */}
        {isGenerating && (
          <GlassPanel style={styles.progressPanel}>
            <Text style={styles.progressText}>Processing your images...</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '50%' }]} />
            </View>
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
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 32,
  },
  subtitle: {
    color: '#C8CDD5',
    fontSize: 14,
    marginTop: 8,
    fontWeight: '400',
  },
  errorPanel: {
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(255, 100, 100, 0.1)',
  },
  errorText: {
    color: '#FF6464',
    fontSize: 12,
    fontWeight: '500',
  },
  uploadSection: {
    marginBottom: 20,
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  countSection: {
    marginBottom: 20,
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  sectionTitle: {
    color: '#F5F7FA',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  generateButton: {
    backgroundColor: '#0A76AF',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    flexDirection: 'row',
    gap: 8,
  },
  generateButtonDisabled: {
    backgroundColor: '#004b93',
    opacity: 0.6,
  },
  generateButtonText: {
    color: '#F5F7FA',
    fontSize: 16,
    fontWeight: '600',
  },
  progressPanel: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  progressText: {
    color: '#F5F7FA',
    fontSize: 14,
    marginBottom: 12,
    fontWeight: '500',
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#0A76AF',
    borderRadius: 2,
  },
});

