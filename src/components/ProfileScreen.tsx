import React, { useState, useMemo } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView, FlatList } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { getUserPhotos, getUserStats, getUserProfile, canViewProfile } from '../data/mockData';
import { Photo } from '../App';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ProfileScreenProps {
  username?: string;
  onPhotoSelect?: (photo: Photo) => void;
  onViewOnMap?: () => void;
  onSettings?: () => void;
  navigation?: any;
  route?: any;
}

export function ProfileScreen({ username: propsUsername, onPhotoSelect, onViewOnMap, onSettings, navigation, route }: ProfileScreenProps) {
  const nav = useNavigation();
  const routeParams = useRoute();
  const insets = useSafeAreaInsets();
  const [showSettings, setShowSettings] = useState(false);
  
  // Get username from route params, props, or default to 'You'
  const username = (routeParams.params as any)?.username || propsUsername || 'You';
  const isOwnProfile = username === 'You';
  const canView = isOwnProfile || canViewProfile(username);
  const profile = getUserProfile(username);
  
  // Get photos filtered by visibility
  const userPhotos = useMemo(() => {
    if (!canView) return [];
    return getUserPhotos(username, 'You');
  }, [username, canView]);
  
  // Get stats
  const stats = useMemo(() => {
    if (!canView) return null;
    return getUserStats(username, 'You');
  }, [username, canView]);

  // Helper function to serialize photo for navigation (convert Date to ISO string)
  const serializePhotoForNavigation = (photo: Photo) => {
    return {
      ...photo,
      timestamp: photo.timestamp.toISOString(),
    };
  };

  const handlePhotoPress = (photo: Photo) => {
    if (onPhotoSelect) {
      onPhotoSelect(photo);
    } else {
      (nav as any).navigate('PhotoDetails', { photo: serializePhotoForNavigation(photo) });
    }
  };

  const renderPhoto = ({ item }: { item: Photo }) => (
    <Pressable
      onPress={() => handlePhotoPress(item)}
      style={styles.photoItem}
    >
      <Image
        source={{ uri: item.imageUrl }}
        style={styles.photoImage}
        contentFit="cover"
      />
      
      {/* Profile Picture in Top-Left Corner - curved square style */}
      <View style={styles.avatarContainer}>
        <Image
          source={{ uri: item.authorAvatar }}
          style={styles.avatarImage}
          contentFit="cover"
        />
      </View>
      
      {item.likes > 0 && (
        <View style={styles.photoLikes}>
          <Ionicons name="heart" size={12} color="white" />
          <Text style={styles.photoLikesText}>{item.likes}</Text>
        </View>
      )}
    </Pressable>
  );

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={[styles.contentContainer, { paddingTop: insets.top }]}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>{isOwnProfile ? 'Your Profile' : `${username}'s Profile`}</Text>
            <Text style={styles.subtitle}>
              {isOwnProfile ? 'Capturing moments, one pin at a time' : 'View their photo collection'}
            </Text>
          </View>
          {isOwnProfile && (
            <Pressable 
              style={styles.settingsButton}
              onPress={() => {
                if (onSettings) {
                  onSettings();
                } else {
                  nav.navigate('Settings' as never);
                }
              }}
            >
              <Ionicons name="settings" size={20} color="#4b5563" />
            </Pressable>
          )}
        </View>

        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{username === 'You' ? 'You' : username[0]}</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{username === 'You' ? 'Alex Johnson' : username}</Text>
            <Text style={styles.userHandle}>{username === 'You' ? '@alexj' : `@${username.toLowerCase().replace(/\s+/g, '')}`}</Text>
          </View>
        </View>

        {/* Stats */}
        {stats && (
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <View style={styles.statIconContainer}>
                <Ionicons name="camera" size={20} color="#06b6d4" />
              </View>
              <Text style={styles.statValue}>{stats.photoCount}</Text>
              <Text style={styles.statLabel}>Photos</Text>
            </View>
            <View style={styles.statItem}>
              <View style={styles.statIconContainer}>
                <Ionicons name="location" size={20} color="#06b6d4" />
              </View>
              <Text style={styles.statValue}>{stats.places}</Text>
              <Text style={styles.statLabel}>Places</Text>
            </View>
            <View style={styles.statItem}>
              <View style={styles.statIconContainer}>
                <Ionicons name="heart" size={20} color="#06b6d4" />
              </View>
              <Text style={styles.statValue}>{stats.likes}</Text>
              <Text style={styles.statLabel}>Likes</Text>
            </View>
            <View style={styles.statItem}>
              <View style={styles.statIconContainer}>
                <Ionicons name="trophy" size={20} color="#06b6d4" />
              </View>
              <Text style={styles.statValue}>{stats.challengePoints}</Text>
              <Text style={styles.statLabel}>Challenge Points</Text>
            </View>
          </View>
        )}
      </View>

      {/* Photo Grid */}
      {canView ? (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{isOwnProfile ? 'Your Photos' : `${username}'s Photos`}</Text>
            {onViewOnMap && (
              <Pressable onPress={onViewOnMap}>
                <Text style={styles.viewOnMapText}>View on Map</Text>
              </Pressable>
            )}
          </View>
          
          {userPhotos.length > 0 ? (
            <FlatList
              data={userPhotos}
              renderItem={renderPhoto}
              numColumns={3}
              scrollEnabled={false}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.photoGrid}
            />
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="camera-outline" size={48} color="#d1d5db" />
              <Text style={styles.emptyStateText}>No photos to display</Text>
            </View>
          )}
        </View>
      ) : (
        <View style={styles.privateSection}>
          <Ionicons name="lock-closed" size={64} color="#9ca3af" />
          <Text style={styles.privateTitle}>Private Profile</Text>
          <Text style={styles.privateMessage}>
            {username}'s profile is private. Send a friend request to view their photos.
          </Text>
        </View>
      )}

      {/* Achievements Section - Only show for own profile */}
      {isOwnProfile && (
        <>
          <View style={[styles.section, styles.achievementsSection]}>
            <Text style={styles.sectionTitle}>Achievements</Text>
            <View style={styles.achievementsList}>
              <View style={[styles.achievementItem, styles.achievementOrange]}>
                <View style={[styles.achievementIcon, styles.achievementIconOrange]}>
                  <Text style={styles.achievementEmoji}>🌅</Text>
                </View>
                <View style={styles.achievementContent}>
                  <Text style={styles.achievementTitle}>Golden Hour Master</Text>
                  <Text style={styles.achievementDescription}>Captured 10 photos during golden hour</Text>
                </View>
              </View>
              
              <View style={[styles.achievementItem, styles.achievementBlue]}>
                <View style={[styles.achievementIcon, styles.achievementIconBlue]}>
                  <Text style={styles.achievementEmoji}>🗺️</Text>
                </View>
                <View style={styles.achievementContent}>
                  <Text style={styles.achievementTitle}>Explorer</Text>
                  <Text style={styles.achievementDescription}>Visited 20+ unique locations</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Challenge Wins Section */}
          <View style={[styles.section, styles.challengesSection]}>
            <Text style={styles.sectionTitle}>Daily Challenge Wins</Text>
            <View style={styles.challengesList}>
              <View style={[styles.challengeItem, styles.challengeItemBorder]}>
                <View style={styles.challengeIcon}>
                  <Ionicons name="trophy" size={24} color="white" />
                </View>
                <View style={styles.challengeContent}>
                  <Text style={styles.challengeTitle}>Best Sunset (Nov 18)</Text>
                  <Text style={styles.challengeDescription}>Won with 24 votes</Text>
                </View>
                <View style={styles.challengePoints}>
                  <Text style={styles.challengePointsText}>+25 pts</Text>
                </View>
              </View>
            </View>
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  contentContainer: {
    paddingBottom: 32,
  },
  header: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  headerTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#06b6d4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: 'white',
    fontSize: 24,
    fontWeight: '600',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  userHandle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#ecfeff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  section: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  viewOnMapText: {
    fontSize: 14,
    color: '#06b6d4',
    fontWeight: '500',
  },
  photoGrid: {
    gap: 8,
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
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 10,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  photoLikes: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  photoLikesText: {
    color: 'white',
    fontSize: 12,
  },
  achievementsSection: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  achievementsList: {
    gap: 12,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 16,
  },
  achievementOrange: {
    backgroundColor: '#fff7ed',
  },
  achievementBlue: {
    backgroundColor: '#eff6ff',
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  achievementIconOrange: {
    backgroundColor: '#fb923c',
  },
  achievementIconBlue: {
    backgroundColor: '#06b6d4',
  },
  achievementEmoji: {
    fontSize: 24,
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  achievementDescription: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  challengesSection: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  challengesList: {
    gap: 12,
  },
  challengeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 16,
    backgroundColor: '#fff7ed',
  },
  challengeItemBorder: {
    borderWidth: 1,
    borderColor: '#fed7aa',
  },
  challengeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fb923c',
    alignItems: 'center',
    justifyContent: 'center',
  },
  challengeContent: {
    flex: 1,
  },
  challengeTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  challengeDescription: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  challengePoints: {
    alignItems: 'flex-end',
  },
  challengePointsText: {
    fontSize: 14,
    color: '#ea580c',
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 12,
  },
  privateSection: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 48,
    marginTop: 32,
  },
  privateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  privateMessage: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
});
