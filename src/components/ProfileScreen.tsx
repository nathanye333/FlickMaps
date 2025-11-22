import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView, FlatList } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { mockPersonalPhotos } from '../data/mockData';
import { Photo } from '../App';
import { useNavigation } from '@react-navigation/native';

interface ProfileScreenProps {
  onPhotoSelect?: (photo: Photo) => void;
  onViewOnMap?: () => void;
  onSettings?: () => void;
  navigation?: any;
  route?: any;
}

const stats = [
  { icon: 'camera' as const, label: 'Photos', value: '47' },
  { icon: 'location' as const, label: 'Places', value: '23' },
  { icon: 'heart' as const, label: 'Likes', value: '342' },
  { icon: 'trophy' as const, label: 'Challenge Points', value: '85' },
];

export function ProfileScreen({ onPhotoSelect, onViewOnMap, onSettings, navigation, route }: ProfileScreenProps) {
  const nav = useNavigation();
  const [showSettings, setShowSettings] = useState(false);

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
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>Your Profile</Text>
            <Text style={styles.subtitle}>Capturing moments, one pin at a time</Text>
          </View>
          <Pressable 
            style={styles.settingsButton}
            onPress={() => onSettings && onSettings()}
          >
            <Ionicons name="settings" size={20} color="#4b5563" />
          </Pressable>
        </View>

        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>You</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>Alex Johnson</Text>
            <Text style={styles.userHandle}>@alexj</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          {stats.map((stat) => (
            <View key={stat.label} style={styles.statItem}>
              <View style={styles.statIconContainer}>
                <Ionicons name={stat.icon} size={20} color="#06b6d4" />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Photo Grid */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Photos</Text>
          <Pressable onPress={onViewOnMap}>
            <Text style={styles.viewOnMapText}>View on Map</Text>
          </Pressable>
        </View>
        
        <FlatList
          data={mockPersonalPhotos}
          renderItem={renderPhoto}
          numColumns={3}
          scrollEnabled={false}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.photoGrid}
        />
      </View>

      {/* Achievements Section */}
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
});
