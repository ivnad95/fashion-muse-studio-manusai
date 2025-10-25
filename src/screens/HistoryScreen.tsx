import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import Svg, { Path, Polyline, Line, Rect } from 'react-native-svg';
import GlassyTitle from '../components/GlassyTitle';
import GlassPanel from '../components/GlassPanel';
import { glassStyles, COLORS } from '../styles/glassStyles';
import { useAuthStore } from '../store/authStore';
import { generationService } from '../services/generationService';

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

interface HistoryItem {
  id: string;
  date: string;
  time: string;
  count: number;
  thumbnail: string;
  results: string[];
}

/**
 * HistoryScreen - Display user's generation history
 */
export default function HistoryScreen() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const user = useAuthStore((state) => state.user);

  // Load history when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      loadHistory();
    }, [user])
  );

  // Load history from backend
  const loadHistory = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await generationService.getHistory(user.id);
      setHistory(data || []);
    } catch (error) {
      console.error('Error loading history:', error);
      Alert.alert('Error', 'Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  // Handle delete history item
  const handleDelete = async (historyId: string) => {
    Alert.alert(
      'Delete Generation',
      'Are you sure you want to delete this generation?',
      [
        { text: 'Cancel', onPress: () => {}, style: 'cancel' },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              setDeleting(historyId);
              await generationService.deleteHistory(historyId);
              setHistory((prev) => prev.filter((item) => item.id !== historyId));
              Alert.alert('Success', 'Generation deleted successfully');
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to delete generation');
            } finally {
              setDeleting(null);
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  // Handle download
  const handleDownload = async (imageUri: string) => {
    try {
      await generationService.downloadImage(imageUri, `fashion-muse-${Date.now()}.jpg`);
      Alert.alert('Success', 'Image downloaded successfully');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to download image');
    }
  };

  // Loading state
  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator color="#0A76AF" size="large" />
          <Text style={styles.loadingText}>Loading history...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Empty state
  if (history.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <GlassyTitle title="History" />
            <Text style={styles.subtitle}>Your generation history</Text>
          </View>

          <GlassPanel style={styles.emptyPanel}>
            <Text style={styles.emptyText}>No generations yet</Text>
            <Text style={styles.emptySubtext}>
              Go to Home and create your first fashion photo
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
          <GlassyTitle title="History" />
          <Text style={styles.subtitle}>
            {history.length} generation{history.length !== 1 ? 's' : ''}
          </Text>
        </View>

        {/* History Items */}
        {history.map((item) => (
          <GlassPanel key={item.id} style={styles.historyItem}>
            {/* Item Header */}
            <View style={styles.itemHeader}>
              <View>
                <Text style={styles.itemDate}>{item.date}</Text>
                <Text style={styles.itemTime}>{item.time}</Text>
              </View>
              <View style={styles.itemBadge}>
                <Text style={styles.itemBadgeText}>{item.count} images</Text>
              </View>
            </View>

            {/* Thumbnail Grid */}
            <View style={styles.thumbnailGrid}>
              {item.results.slice(0, 4).map((imageUri, index) => (
                <View key={index} style={styles.thumbnailContainer}>
                  <Image
                    source={{ uri: imageUri }}
                    style={styles.thumbnail}
                    resizeMode="cover"
                  />
                </View>
              ))}
            </View>

            {/* Actions */}
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleDownload(item.thumbnail)}
              >
                <DownloadIcon />
                <Text style={styles.actionButtonText}>Download</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.deleteButton]}
                onPress={() => handleDelete(item.id)}
                disabled={deleting === item.id}
              >
                {deleting === item.id ? (
                  <ActivityIndicator color="#FF5050" size="small" />
                ) : (
                  <TrashIcon />
                )}
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </GlassPanel>
        ))}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#C8CDD5',
    fontSize: 14,
    marginTop: 12,
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
  historyItem: {
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemDate: {
    color: '#F5F7FA',
    fontSize: 14,
    fontWeight: '600',
  },
  itemTime: {
    color: '#8A92A0',
    fontSize: 12,
    marginTop: 4,
  },
  itemBadge: {
    backgroundColor: 'rgba(10, 118, 175, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  itemBadgeText: {
    color: '#0A76AF',
    fontSize: 12,
    fontWeight: '600',
  },
  thumbnailGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  thumbnailContainer: {
    flex: 1,
    aspectRatio: 3 / 4,
    borderRadius: 8,
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  deleteButton: {
    borderColor: 'rgba(255, 80, 80, 0.2)',
  },
  actionButtonText: {
    color: '#F5F7FA',
    fontSize: 12,
    fontWeight: '600',
  },
  deleteButtonText: {
    color: '#FF5050',
    fontSize: 12,
    fontWeight: '600',
  },
});

