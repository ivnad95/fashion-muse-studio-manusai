import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, Modal, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import GlassyTitle from '../components/GlassyTitle';
import GlassPanel from '../components/GlassPanel';
import { glassStyles, COLORS } from '../styles/glassStyles';

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
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  // Mock data for demonstration
  const mockResults = [
    'https://via.placeholder.com/300x400/002857/FFFFFF?text=Result+1',
    'https://via.placeholder.com/300x400/004b93/FFFFFF?text=Result+2',
    'https://via.placeholder.com/300x400/002857/FFFFFF?text=Result+3',
    'https://via.placeholder.com/300x400/004b93/FFFFFF?text=Result+4',
  ];

  const displayImages = results.length > 0 ? results : mockResults;
  const allImagesReady = results.length > 0;

  const handleDownload = (imageUrl: string) => {
    // TODO: Implement download functionality
    console.log('Download:', imageUrl);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={glassStyles.screenContent}
        showsVerticalScrollIndicator={false}
      >
        <GlassyTitle>Results</GlassyTitle>
        
        {loading && (
          <GlassPanel style={styles.progressPanel} radius={20}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
            <Text style={styles.progressText}>{progress}% Complete</Text>
          </GlassPanel>
        )}
        
        <View style={styles.grid}>
          {displayImages.map((img, i) => (
            <GlassPanel key={i} style={styles.gridItem} radius={20}>
              <View style={styles.imageWrapper}>
                <Image
                  source={{ uri: img }}
                  style={styles.resultImage}
                  resizeMode="cover"
                />
                <View style={styles.overlay}>
                  <TouchableOpacity
                    style={styles.overlayButton}
                    onPress={() => setSelectedImage(img)}
                  >
                    <EyeIcon />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.overlayButton}
                    onPress={() => handleDownload(img)}
                  >
                    <DownloadIcon />
                  </TouchableOpacity>
                </View>
              </View>
            </GlassPanel>
          ))}
        </View>
        
        {!loading && allImagesReady && (
          <GlassPanel style={styles.successPanel} radius={20}>
            <View style={styles.successContent}>
              <CheckCircleIcon />
              <Text style={styles.successText}>Your fashion photos are ready!</Text>
            </View>
          </GlassPanel>
        )}
      </ScrollView>

      {/* Lightbox Modal */}
      <Modal
        visible={selectedImage !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedImage(null)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setSelectedImage(null)}
        >
          <View style={styles.modalContent}>
            {selectedImage && (
              <Image
                source={{ uri: selectedImage }}
                style={styles.modalImage}
                resizeMode="contain"
              />
            )}
          </View>
        </TouchableOpacity>
      </Modal>
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
  progressPanel: {
    padding: 16,
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.lightColor3,
  },
  progressText: {
    color: COLORS.silverMid,
    fontSize: 14,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 16,
  },
  gridItem: {
    width: (SCREEN_WIDTH - 56) / 2,
    aspectRatio: 3 / 4,
  },
  imageWrapper: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
  },
  resultImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    opacity: 0,
  },
  overlayButton: {
    padding: 8,
  },
  successPanel: {
    padding: 16,
  },
  successContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  successText: {
    color: '#4ADE80',
    fontSize: 14,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    height: '80%',
  },
  modalImage: {
    width: '100%',
    height: '100%',
  },
});

