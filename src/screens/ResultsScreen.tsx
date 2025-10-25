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

const ErrorIcon = () => (
  <Svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#FF5050" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </Svg>
);

/**
 * ImagePlaceholder - Placeholder for failed image loads
 */
const ImagePlaceholder = ({ onRetry }: { onRetry?: () => void }) => (
  <View style={styles.placeholderContainer}>
    <ErrorIcon />
    <Text style={styles.placeholderText}>Failed to load image</Text>
    {onRetry && (
      <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
        <Text style={styles.retryButtonText}>Retry</Text>
      </TouchableOpacity>
    )}
  </View>
);

/**
 * ImageItem - Individual image item with error handling
 */
const ImageItem = ({
  result,
  onViewImage,
  onDownload,
  downloading,
}: {
  result: any;
  onViewImage: (uri: string) => void;
  onDownload: (uri: string) => void;
  downloading: string | null;
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const handleRetry = () => {
    setImageError(false);
    setImageLoaded(false);
    setRetryCount((prev) => prev + 1);
  };

  return (
    <View style={styles.gridItem}>
      <TouchableOpacity
        style={styles.imageContainer}
        onPress={() => imageLoaded && onViewImage(result.imageUri)}
        disabled={imageError || !imageLoaded}
      >
        {!imageLoaded && !imageError && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color="#0A76AF" size="large" />
          </View>
        )}

        {imageError ? (
          <ImagePlaceholder onRetry={handleRetry} />
        ) : (
          <>
            <Image
              key={`${result.id}-${retryCount}`}
              source={{ uri: result.imageUri }}
              style={styles.image}
              resizeMode="cover"
              onLoad={() => setImageLoaded(true)}
              onError={() => {
                console.error('Image load error:', result.imageUri);
                setImageError(true);
              }}
            />
            {imageLoaded && (
              <View style={styles.imageOverlay}>
                <EyeIcon />
              </View>
            )}
          </>
        )}
      </TouchableOpacity>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => imageLoaded && onViewImage(result.imageUri)}
          disabled={imageError || !imageLoaded}
        >
          <EyeIcon />
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.actionButton,
            downloading === result.imageUri && styles.actionButtonActive,
          ]}
          onPress={() => onDownload(result.imageUri)}
          disabled={downloading === result.imageUri || imageError || !imageLoaded}
        >
          {downloading === result.imageUri ? (
            <ActivityIndicator color="#0A76AF" size="small" />
          ) : (
            <DownloadIcon />
          )}
        </TouchableOpacity>
      </View>

      {/* Success Indicator */}
      {imageLoaded && !imageError && (
        <View style={styles.successIndicator}>
          <CheckCircleIcon />
        </View>
      )}
    </View>
  );
};

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
        {results.length > 0 ? (
          <View style={styles.grid}>
            {results.map((result) => (
              <ImageItem
                key={result.id}
                result={result}
                onViewImage={handleViewImage}
                onDownload={handleDownload}
                downloading={downloading}
              />
            ))}
          </View>
        ) : (
          <GlassPanel style={styles.emptyPanel}>
            <ActivityIndicator color="#0A76AF" size="large" />
            <Text style={styles.emptyText}>Generating images...</Text>
          </GlassPanel>
        )}
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
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 80, 80, 0.1)',
  },
  placeholderText: {
    color: '#FF5050',
    fontSize: 12,
    marginTop: 8,
    fontWeight: '500',
  },
  retryButton: {
    marginTop: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255, 80, 80, 0.2)',
    borderRadius: 6,
  },
  retryButtonText: {
    color: '#FF5050',
    fontSize: 12,
    fontWeight: '600',
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

