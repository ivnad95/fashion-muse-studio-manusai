import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Polyline, Line, Rect } from 'react-native-svg';
import GlassyTitle from '../components/GlassyTitle';
import GlassPanel from '../components/GlassPanel';
import { glassStyles, COLORS } from '../styles/glassStyles';

// Icons
const GridIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
    <Rect x="1" y="1" width="6" height="6" />
    <Rect x="1" y="13" width="6" height="6" />
    <Rect x="13" y="1" width="6" height="6" />
    <Rect x="13" y="13" width="6" height="6" />
  </Svg>
);

const DownloadIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
    <Path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <Path d="M7 10l5 5 5-5" />
    <Path d="M12 15V3" />
  </Svg>
);

const TrashIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF5050" strokeWidth="2">
    <Polyline points="3 6 5 6 21 6" />
    <Path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <Line x1="10" y1="11" x2="10" y2="17" />
    <Line x1="14" y1="11" x2="14" y2="17" />
  </Svg>
);

interface Generation {
  id: string;
  imageUrls: string[];
  prompt: string;
  style: string | null;
  aspectRatio: string;
  createdAt: string;
}

/**
 * HistoryScreen - Display user's generation history
 */
export default function HistoryScreen() {
  const [history, setHistory] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Mock data for demonstration
  const mockHistory: Generation[] = [
    {
      id: '1',
      imageUrls: [
        'https://via.placeholder.com/300x400/002857/FFFFFF?text=Gen+1-1',
        'https://via.placeholder.com/300x400/004b93/FFFFFF?text=Gen+1-2',
        'https://via.placeholder.com/300x400/002857/FFFFFF?text=Gen+1-3',
        'https://via.placeholder.com/300x400/004b93/FFFFFF?text=Gen+1-4',
      ],
      prompt: 'Fashion photoshoot in urban setting',
      style: 'Urban',
      aspectRatio: 'portrait',
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      imageUrls: [
        'https://via.placeholder.com/300x400/002857/FFFFFF?text=Gen+2-1',
        'https://via.placeholder.com/300x400/004b93/FFFFFF?text=Gen+2-2',
      ],
      prompt: 'Professional studio fashion shoot',
      style: 'Studio',
      aspectRatio: 'portrait',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
  ];

  useEffect(() => {
    // TODO: Check authentication status
    setIsAuthenticated(true);
    
    // TODO: Fetch history from API
    setTimeout(() => {
      setHistory(mockHistory);
      setLoading(false);
    }, 1000);
  }, []);

  const handleDelete = (generationId: string) => {
    Alert.alert(
      'Delete Generation',
      'Are you sure you want to delete this generation?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setHistory(history.filter((gen) => gen.id !== generationId));
          },
        },
      ]
    );
  };

  const handleDownload = (imageUrl: string) => {
    // TODO: Implement download functionality
    console.log('Download:', imageUrl);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={glassStyles.screenContent}>
          <GlassyTitle>History</GlassyTitle>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.silverMid} />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={glassStyles.screenContent}>
          <GlassyTitle>History</GlassyTitle>
          <GlassPanel style={styles.messagePanel} radius={20}>
            <Text style={styles.messageText}>
              Please sign in to view your generation history.
            </Text>
          </GlassPanel>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={glassStyles.screenContent}
        showsVerticalScrollIndicator={false}
      >
        <GlassyTitle>History</GlassyTitle>
        
        {error && (
          <GlassPanel style={styles.errorPanel} radius={20}>
            <Text style={styles.errorText}>{error}</Text>
          </GlassPanel>
        )}
        
        {history.length === 0 ? (
          <GlassPanel style={styles.messagePanel} radius={20}>
            <Text style={styles.messageText}>No generations found.</Text>
          </GlassPanel>
        ) : (
          <View style={styles.historyList}>
            {history.map((generation) => (
              <GlassPanel key={generation.id} style={styles.generationCard} radius={24}>
                <View style={styles.imageGrid}>
                  {generation.imageUrls.map((url, index) => (
                    <View key={index} style={styles.imageGridItem}>
                      <Image
                        source={{ uri: url }}
                        style={styles.historyImage}
                        resizeMode="cover"
                      />
                      <View style={styles.imageOverlay}>
                        <TouchableOpacity
                          style={styles.imageButton}
                          onPress={() => {}}
                        >
                          <GridIcon />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.imageButton}
                          onPress={() => handleDownload(url)}
                        >
                          <DownloadIcon />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </View>
                
                <View style={styles.generationInfo}>
                  <View style={styles.infoLeft}>
                    <Text style={styles.dateText}>
                      {new Date(generation.createdAt).toLocaleString()}
                    </Text>
                    <Text style={styles.promptText}>{generation.prompt}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDelete(generation.id)}
                  >
                    <TrashIcon />
                  </TouchableOpacity>
                </View>
              </GlassPanel>
            ))}
          </View>
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
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
  },
  messagePanel: {
    padding: 24,
  },
  messageText: {
    color: '#9CA3AF',
    textAlign: 'center',
    fontSize: 14,
  },
  errorPanel: {
    padding: 16,
    marginBottom: 16,
  },
  errorText: {
    color: '#F87171',
    textAlign: 'center',
    fontSize: 14,
  },
  historyList: {
    gap: 24,
  },
  generationCard: {
    padding: 16,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 16,
  },
  imageGridItem: {
    width: '47%',
    aspectRatio: 3 / 4,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  historyImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    opacity: 0,
  },
  imageButton: {
    padding: 8,
  },
  generationInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLeft: {
    flex: 1,
  },
  dateText: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 4,
  },
  promptText: {
    color: '#9CA3AF',
    fontSize: 12,
  },
  deleteButton: {
    padding: 8,
  },
});

