import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView, FlatList } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Photo } from '../App';
import { mockGlobalPhotos, mockDailyChallengeSubmissions, mockFriendsChallengeSubmissions, DailyChallengeSubmission } from '../data/mockData';
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
  const [challengeFilter, setChallengeFilter] = useState<'friends' | 'global'>('friends');
  const [friendsSubmissions, setFriendsSubmissions] = useState<DailyChallengeSubmission[]>(mockFriendsChallengeSubmissions);
  const [globalSubmissions, setGlobalSubmissions] = useState<DailyChallengeSubmission[]>(mockDailyChallengeSubmissions);
  
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
  
  const currentChallengeSubmissions = challengeFilter === 'friends' ? friendsSubmissions : globalSubmissions;

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

  const handleVote = (submissionId: string) => {
    if (challengeFilter === 'friends') {
      setFriendsSubmissions(prev => prev.map(sub => {
        if (sub.id === submissionId) {
          const newHasVoted = !sub.hasVoted;
          return {
            ...sub,
            hasVoted: newHasVoted,
            votes: newHasVoted ? sub.votes + 1 : sub.votes - 1,
          };
        }
        return sub;
      }));
    } else {
      setGlobalSubmissions(prev => prev.map(sub => {
        if (sub.id === submissionId) {
          const newHasVoted = !sub.hasVoted;
          return {
            ...sub,
            hasVoted: newHasVoted,
            votes: newHasVoted ? sub.votes + 1 : sub.votes - 1,
          };
        }
        return sub;
      }));
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
            <View style={styles.challengeHeader}>
              <View>
                <Text style={styles.challengeTitle}>Golden Hour Moments</Text>
                <Text style={styles.challengeDescription}>
                  Daily challenge photos ranked by votes
                </Text>
              </View>
              <View style={styles.challengeFilterButtons}>
                <Pressable
                  onPress={() => setChallengeFilter('friends')}
                  style={[
                    styles.challengeFilterButton,
                    challengeFilter === 'friends' && styles.challengeFilterButtonActive
                  ]}
                >
                  <Ionicons 
                    name="people" 
                    size={16} 
                    color={challengeFilter === 'friends' ? 'white' : '#6b7280'} 
                  />
                  <Text style={[
                    styles.challengeFilterText,
                    challengeFilter === 'friends' && styles.challengeFilterTextActive
                  ]}>
                    Friends
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => setChallengeFilter('global')}
                  style={[
                    styles.challengeFilterButton,
                    challengeFilter === 'global' && styles.challengeFilterButtonActive
                  ]}
                >
                  <Ionicons 
                    name="globe" 
                    size={16} 
                    color={challengeFilter === 'global' ? 'white' : '#6b7280'} 
                  />
                  <Text style={[
                    styles.challengeFilterText,
                    challengeFilter === 'global' && styles.challengeFilterTextActive
                  ]}>
                    Global
                  </Text>
                </Pressable>
              </View>
            </View>
            
            <View style={styles.submissionsGrid}>
              {currentChallengeSubmissions
                .sort((a, b) => b.votes - a.votes)
                .map((submission, index) => (
                  <Pressable
                    key={submission.id}
                    onPress={() => handlePhotoPress(submission.photo)}
                    style={[
                      styles.submissionItem,
                      submission.hasVoted && styles.submissionItemVoted,
                      index === 0 && styles.submissionItemWinner
                    ]}
                  >
                    {index === 0 && (
                      <View style={styles.winnerBadge}>
                        <Ionicons name="trophy" size={12} color="white" />
                        <Text style={styles.winnerBadgeText}>Leading</Text>
                      </View>
                    )}
                    
                    <Image 
                      source={{ uri: submission.photo.imageUrl }} 
                      style={styles.submissionImage} 
                      contentFit="cover" 
                    />
                    
                    <View style={styles.submissionOverlay}>
                      <View style={styles.submissionInfo}>
                        <View style={styles.submissionAuthor}>
                          <Image
                            source={{ uri: submission.photo.authorAvatar }}
                            style={styles.submissionAvatar}
                            contentFit="cover"
                          />
                          <Text style={styles.submissionAuthorName} numberOfLines={1}>
                            {submission.photo.author}
                          </Text>
                        </View>
                        
                        <Pressable
                          style={[
                            styles.voteButton,
                            submission.hasVoted && styles.voteButtonVoted
                          ]}
                          onPress={(e) => {
                            e.stopPropagation();
                            handleVote(submission.id);
                          }}
                        >
                          <Ionicons 
                            name={submission.hasVoted ? "heart" : "heart-outline"} 
                            size={14} 
                            color="white"
                          />
                          <Text style={[
                            styles.voteCount,
                            submission.hasVoted && styles.voteCountVoted
                          ]}>
                            {submission.votes}
                          </Text>
                        </Pressable>
                      </View>
                    </View>
                  </Pressable>
                ))}
            </View>
            
            {currentChallengeSubmissions.length === 0 && (
              <View style={styles.emptyState}>
                <Ionicons name="camera" size={64} color="#d1d5db" />
                <Text style={styles.emptyStateText}>
                  No submissions yet. Be the first to participate!
                </Text>
              </View>
            )}
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
    padding: 16,
  },
  challengeHeader: {
    marginBottom: 20,
  },
  challengeTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  challengeDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  challengeFilterButtons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  challengeFilterButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  challengeFilterButtonActive: {
    backgroundColor: '#fb923c',
    borderColor: '#fb923c',
  },
  challengeFilterText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  challengeFilterTextActive: {
    color: 'white',
  },
  submissionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  submissionItem: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    backgroundColor: '#f3f4f6',
    position: 'relative',
  },
  submissionItemVoted: {
    borderColor: '#06b6d4',
    shadowColor: '#06b6d4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  submissionItemWinner: {
    borderWidth: 2,
    borderColor: '#f97316',
  },
  winnerBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: '#f97316',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  winnerBadgeText: {
    fontSize: 11,
    color: 'white',
    fontWeight: '600',
  },
  submissionImage: {
    width: '100%',
    height: '100%',
  },
  submissionOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  submissionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  submissionAuthor: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  submissionAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: 'white',
  },
  submissionAuthorName: {
    fontSize: 11,
    color: 'white',
    fontWeight: '500',
    flex: 1,
  },
  voteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  voteButtonVoted: {
    backgroundColor: '#06b6d4',
  },
  voteCount: {
    fontSize: 11,
    color: 'white',
    fontWeight: '600',
  },
  voteCountVoted: {
    color: 'white',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 16,
    textAlign: 'center',
  },
});
