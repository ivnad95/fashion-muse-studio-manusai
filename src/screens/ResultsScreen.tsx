import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, Modal, Dimensions, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import GlassyTitle from '../components/GlassyTitle';
import GlassPanel from '../components/GlassPanel';
import { glassStyles, COLORS } from '../styles/glassStyles';
import { useGenerationStore } from '../store/generationStore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Icons
const EyeIcon = () => (
  <Svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
    <Path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <Path d="M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
  </Svg>
);

const DownloadIcon = () => (
  <Svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
    <Path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <Path d="M7 10l5 5 5-5" />
    <Path d="M12 15V3" />
  </Svg>
);

const CheckCircleIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4ADE80" strokeWidth="2">
    <Path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <Path d="M22 4L12 14.01l-3-3" />
  </Svg>
);

/**
 * ResultsScreen - Display generation results in a grid
 */
export default function ResultsScreen() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [downloading, setDownloading] = useState<string | null>(null);

  // Get results from store
  const results = useGenerationStore((state) => state.results);
  const isGenerating = useGenerationStore((state) => state.isGenerating);
  const generationProgress = useGenerationStore((state) => state.generationProgress);

  // Handle image view
  const handleViewImage = (imageUri: string) => {
    setSelectedImage(imageUri);
  };

  // Handle image download
  const handleDownload = async (imageUri: string) => {
    try {
      setDownloading(imageUri);
      // TODO: Implement actual download functionality
      // For now, just simulate a download
      setTimeout(() => {
        setDownloading(null);
      }, 2000);
    } catch (error) {
      console.error('Error downloading image:', error);
      setDownloading(null);
    }
  };

  // Empty state
  if (results.length === 0 && !isGenerating) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <GlassyTitle title="Results" />
            <Text style={styles.subtitle}>Your generated images will appear here</Text>
          </View>

          <GlassPanel style={styles.emptyPanel}>
            <Text style={styles.emptyText}>No images generated yet</Text>
            <Text style={styles.emptySubtext}>
              Go to Home and upload a photo to get started
            </Text>
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
          <GlassyTitle title="Results" />
          <Text style={styles.subtitle}>
            {results.length} image{results.length !== 1 ? 's' : ''} generated
          </Text>
        </View>

        {/* Progress Indicator */}
        {isGenerating && (
          <GlassPanel style={styles.progressPanel}>
            <ActivityIndicator color="#0A76AF" size="large" />
            <Text style={styles.progressText}>Generating images...</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${generationProgress}%` }]} />
            </View>
            <Text style={styles.progressPercentage}>{generationProgress}%</Text>
          </GlassPanel>
        )}

        {/* Results Grid */}
        <View style={styles.grid}>
          {results.map((result, index) => (
            <View key={result.id} style={styles.gridItem}>
              <TouchableOpacity
                style={styles.imageContainer}
                onPress={() => handleViewImage(result.imageUri)}
              >
                <Image
                  source={{ uri: result.imageUri }}
                  style={styles.image}
                  resizeMode="cover"
                />
                <View style={styles.imageOverlay}>
                  <EyeIcon />
                </View>
              </TouchableOpacity>

              {/* Action Buttons */}
              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleViewImage(result.imageUri)}
                >
                  <EyeIcon />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    downloading === result.imageUri && styles.actionButtonActive,
                  ]}
                  onPress={() => handleDownload(result.imageUri)}
                  disabled={downloading === result.imageUri}
                >
                  {downloading === result.imageUri ? (
                    <ActivityIndicator color="#0A76AF" size="small" />
                  ) : (
                    <DownloadIcon />
                  )}
                </TouchableOpacity>
              </View>

              {/* Success Indicator */}
              <View style={styles.successIndicator}>
                <CheckCircleIcon />
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Image Modal */}
      <Modal
        visible={!!selectedImage}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedImage(null)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.modalBackground}
            onPress={() => setSelectedImage(null)}
          >
            {selectedImage && (
              <Image
                source={{ uri: selectedImage }}
                style={styles.modalImage}
                resizeMode="contain"
              />
            )}
          </TouchableOpacity>
        </View>
      </Modal>
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
  emptyPanel: {
    paddingHorizontal: 24,
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: '#F5F7FA',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    color: '#8A92A0',
    fontSize: 14,
    fontWeight: '400',
    textAlign: 'center',
  },
  progressPanel: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  progressText: {
    color: '#F5F7FA',
    fontSize: 14,
    marginTop: 12,
    marginBottom: 12,
    fontWeight: '500',
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#0A76AF',
    borderRadius: 2,
  },
  progressPercentage: {
    color: '#0A76AF',
    fontSize: 12,
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '48%',
    marginBottom: 16,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 3 / 4,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 8,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonActive: {
    backgroundColor: 'rgba(10, 118, 175, 0.2)',
    borderColor: '#0A76AF',
  },
  successIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_WIDTH * 0.9 * 1.33,
  },
});

