import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView, FlatList } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Photo } from '../App';
import { mockGlobalPhotos, mockDailyChallengeSubmissions } from '../data/mockData';
import { useNavigation } from '@react-navigation/native';

interface ExploreScreenProps {
  onPhotoSelect?: (photo: Photo) => void;
  onProfileClick?: (username: string) => void;
  onChallengeClick?: () => void;
  navigation?: any;
  route?: any;
}

export function ExploreScreen({ onPhotoSelect, onProfileClick, onChallengeClick, navigation, route }: ExploreScreenProps) {
  const nav = useNavigation();
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
      <Image source={{ uri: item.imageUrl }} style={styles.photoImage} />
      <View style={styles.photoOverlay}>
        <Pressable
          onPress={(e) => {
            e.stopPropagation();
            onProfileClick && onProfileClick(item.author);
          }}
          style={styles.photoAvatar}
        >
          <Image source={{ uri: item.authorAvatar }} style={styles.avatarImage} />
        </Pressable>
        <View style={styles.photoStats}>
          <Ionicons name="heart" size={14} color="white" />
          <Text style={styles.photoLikes}>{item.likes}</Text>
        </View>
      </View>
    </Pressable>
  );

  return (
    <ScrollView style={styles.container}>
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
            <Text style={styles.challengeTitle}>Daily Challenge</Text>
            <Text style={styles.challengeDescription}>
              Capture the best sunset photo today!
            </Text>
            <Pressable
              onPress={onChallengeClick}
              style={styles.challengeButton}
            >
              <Ionicons name="camera" size={20} color="white" />
              <Text style={styles.challengeButtonText}>Join Challenge</Text>
            </Pressable>
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
    borderRadius: 16,
    overflow: 'hidden',
  },
  photoImage: {
    width: '100%',
    height: '100%',
  },
  photoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 8,
    justifyContent: 'space-between',
  },
  photoAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'white',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  photoStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-end',
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
