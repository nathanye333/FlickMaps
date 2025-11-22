import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView, FlatList } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Photo } from '../App';
import { mockGlobalPhotos, mockDailyChallengeSubmissions } from '../data/mockData';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ExploreScreenProps {
  onPhotoSelect?: (photo: Photo) => void;
  onProfileClick?: (username: string) => void;
  onChallengeClick?: () => void;
  navigation?: any;
  route?: any;
}

export function ExploreScreen({ onPhotoSelect, onProfileClick, onChallengeClick, navigation, route }: ExploreScreenProps) {
  const nav = useNavigation();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'trending' | 'challenges'>('trending');
  
  const trendingPhotos = [...mockGlobalPhotos].sort((a, b) => b.likes - a.likes).slice(0, 12);
  
  const userLat = 37.7749;
  const userLng = -122.4194;
  const nearbyPhotos = [...mockGlobalPhotos]
    .filter(photo => {
      const latDiff = Math.abs(photo.lat - userLat);
      const lngDiff = Math.abs(photo.lng - userLng);
      return latDiff < 0.7 && lngDiff < 0.7;
    })
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 6);
  
  const challengeSubmissions = mockDailyChallengeSubmissions;

  const handlePhotoPress = (photo: Photo) => {
    if (onPhotoSelect) {
      onPhotoSelect(photo);
    } else {
      nav.navigate('PhotoDetails' as never, { photo } as never);
    }
  };

  const renderPhoto = ({ item }: { item: Photo }) => (
    <Pressable
      onPress={() => handlePhotoPress(item)}
      style={styles.photoItem}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.photoImage} contentFit="cover" />
      
      {/* Profile Picture in Top-Left Corner - curved square style */}
      <View style={styles.avatarContainer}>
        <Pressable
          onPress={(e) => {
            e.stopPropagation();
            onProfileClick && onProfileClick(item.author);
          }}
          style={styles.photoAvatar}
        >
          <Image source={{ uri: item.authorAvatar }} style={styles.avatarImage} contentFit="cover" />
        </Pressable>
      </View>
      
      {/* Likes at bottom right */}
      {item.likes > 0 && (
        <View style={styles.photoStats}>
          <Ionicons name="heart" size={14} color="white" />
          <Text style={styles.photoLikes}>{item.likes}</Text>
        </View>
      )}
    </Pressable>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingTop: insets.top }}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Explore</Text>
        
        {/* Tab Switcher */}
        <View style={styles.tabSwitcher}>
          <Pressable
            onPress={() => setActiveTab('trending')}
            style={[styles.tab, activeTab === 'trending' && styles.tabActive]}
          >
            <Ionicons 
              name="trending-up" 
              size={16} 
              color={activeTab === 'trending' ? 'white' : '#4b5563'} 
            />
            <Text style={[styles.tabText, activeTab === 'trending' && styles.tabTextActive]}>
              Trending
            </Text>
          </Pressable>
          
          <Pressable
            onPress={() => setActiveTab('challenges')}
            style={[styles.tab, activeTab === 'challenges' && styles.tabActiveChallenge]}
          >
            <Ionicons 
              name="camera" 
              size={16} 
              color={activeTab === 'challenges' ? 'white' : '#4b5563'} 
            />
            <Text style={[styles.tabText, activeTab === 'challenges' && styles.tabTextActive]}>
              Challenges
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {activeTab === 'trending' ? (
          <>
            {/* Trending Near You */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="location" size={20} color="#06b6d4" />
                <Text style={styles.sectionTitle}>Trending Near You</Text>
              </View>
              
              <FlatList
                data={nearbyPhotos}
                renderItem={renderPhoto}
                numColumns={2}
                scrollEnabled={false}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.photoGrid}
              />
            </View>

            {/* Global Trending */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="globe" size={20} color="#06b6d4" />
                <Text style={styles.sectionTitle}>Global Trending</Text>
              </View>
              
              <FlatList
                data={trendingPhotos}
                renderItem={renderPhoto}
                numColumns={2}
                scrollEnabled={false}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.photoGrid}
              />
            </View>
          </>
        ) : (
          <View style={styles.challengesSection}>
            <Text style={styles.challengeTitle}>Golden Hour Moments</Text>
            <Text style={styles.challengeDescription}>
              Global daily challenge photos ranked by likes
            </Text>
            <FlatList
              data={mockDailyChallengeSubmissions
                .map(submission => submission.photo)
                .sort((a, b) => b.likes - a.likes)}
              renderItem={renderPhoto}
              numColumns={2}
              scrollEnabled={false}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.photoGrid}
            />
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  tabSwitcher: {
    flexDirection: 'row',
    gap: 8,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
  },
  tabActive: {
    backgroundColor: '#06b6d4',
  },
  tabActiveChallenge: {
    backgroundColor: '#fb923c',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4b5563',
  },
  tabTextActive: {
    color: 'white',
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  photoGrid: {
    gap: 12,
  },
  photoItem: {
    flex: 1,
    aspectRatio: 1,
    margin: 4,
    borderRadius: 12, // Curved square - matching PhotoStackModal
    overflow: 'hidden',
    backgroundColor: '#f3f4f6',
  },
  photoImage: {
    width: '100%',
    height: '100%',
  },
  avatarContainer: {
    position: 'absolute',
    top: 8,
    left: 8,
    zIndex: 10,
  },
  photoAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'white',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  photoStats: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  photoLikes: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  challengesSection: {
    padding: 24,
    alignItems: 'center',
  },
  challengeTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  challengeDescription: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  challengeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#06b6d4',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  challengeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
