import React, { useState, useMemo } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView, TextInput } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as mockData from '../data/mockData';

// Helper to get user profile data
const getUserProfileData = (username: string) => {
  return mockData.getUserProfile ? mockData.getUserProfile(username) : null;
};

interface User {
  username: string;
  avatar: string;
  location: string;
  photoCount: number;
  isPublic: boolean;
}

interface FriendRequest {
  username: string;
  avatar: string;
  location: string;
  photoCount: number;
  timestamp: Date;
}

interface FriendsScreenProps {
  onPhotoSelect?: (photo: any) => void;
  onProfileClick?: (username: string) => void;
  onChallengeClick?: () => void;
  navigation?: any;
  route?: any;
}

// All users in the system (for search)
const mockAllUsers: User[] = [
  { username: 'Sarah Chen', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop', location: 'San Francisco, CA', photoCount: 24, isPublic: true },
  { username: 'Mike Wilson', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', location: 'Oakland, CA', photoCount: 18, isPublic: true },
  { username: 'Emma Davis', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop', location: 'Berkeley, CA', photoCount: 31, isPublic: true },
  { username: 'James Lee', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop', location: 'San Jose, CA', photoCount: 15, isPublic: true },
  { username: 'Travel Bug', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop', location: 'San Diego, CA', photoCount: 78, isPublic: true },
  { username: 'Urban Lens', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop', location: 'Seattle, WA', photoCount: 67, isPublic: true },
  { username: 'Photography Pro', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop', location: 'Los Angeles, CA', photoCount: 92, isPublic: true },
  { username: 'Nature Lover', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop', location: 'Portland, OR', photoCount: 45, isPublic: true },
  { username: 'City Explorer', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop', location: 'New York, NY', photoCount: 123, isPublic: true },
  { username: 'Art Enthusiast', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop', location: 'Chicago, IL', photoCount: 56, isPublic: true },
];

const mockUsers: User[] = mockAllUsers.filter(user => mockData.isFriend(user.username));

const mockFriendRequests: FriendRequest[] = [
  { username: 'Travel Bug', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop', location: 'San Diego, CA', photoCount: 78, timestamp: new Date('2025-11-20T14:30:00') },
  { username: 'Urban Lens', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop', location: 'Seattle, WA', photoCount: 67, timestamp: new Date('2025-11-19T10:15:00') },
];

export function FriendsScreen({ onProfileClick, navigation, route }: FriendsScreenProps) {
  const nav = useNavigation();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'friends' | 'requests' | 'search'>('friends');
  const [friendRequests, setFriendRequests] = useState(mockFriendRequests);
  const [friendsList, setFriendsList] = useState<Set<string>>(new Set(Array.from(mockData.friendships)));

  // Filter friends for friends tab
  const filteredFriends = useMemo(() => {
    if (activeTab !== 'friends') return [];
    return mockAllUsers.filter(user => 
      mockData.isFriend(user.username) && 
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, activeTab]);

  // Filter search results (all users matching query, excluding current user)
  const searchResults = useMemo(() => {
    if (activeTab !== 'search' || !searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return mockAllUsers.filter(user => 
      user.username.toLowerCase().includes(query) &&
      user.username !== 'You'
    );
  }, [searchQuery, activeTab]);

  const handleAcceptRequest = (username: string) => {
    if (mockData.addFriend) {
      mockData.addFriend(username);
    }
    setFriendRequests(prev => prev.filter(req => req.username !== username));
    setFriendsList(new Set(Array.from(mockData.friendships)));
  };

  const handleRejectRequest = (username: string) => {
    setFriendRequests(prev => prev.filter(req => req.username !== username));
  };

  const handleSendFriendRequest = (username: string) => {
    const profile = getUserProfileData(username);
    const isPublic = profile?.isPublic ?? false;
    
    if (mockData.sendFriendRequest) {
      mockData.sendFriendRequest(username);
    } else if (mockData.pendingFriendRequests) {
      // Fallback if function not available
      if (!mockData.isFriend || !mockData.isFriend(username)) {
        if (isPublic && mockData.addFriend) {
          // Public users are added directly
          mockData.addFriend(username);
        } else {
          // Private users need a request
          if (!mockData.pendingFriendRequests.has(username)) {
            mockData.pendingFriendRequests.add(username);
          }
        }
      }
    }
    // Force re-render by updating state
    setFriendsList(new Set(Array.from(mockData.friendships)));
  };

  const handleProfilePress = (username: string) => {
    if (onProfileClick) {
      onProfileClick(username);
    } else {
      nav.navigate('UserMap' as never, { username } as never);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingTop: insets.top }}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Friends</Text>
        
        {/* Search - Only show in search tab */}
        {activeTab === 'search' && (
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#9ca3af" style={styles.searchIcon} />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search by username..."
              style={styles.searchInput}
              placeholderTextColor="#9ca3af"
              autoFocus={activeTab === 'search'}
            />
          </View>
        )}

        {/* Tab Switcher */}
        <View style={styles.tabSwitcher}>
          <Pressable
            onPress={() => {
              setActiveTab('friends');
              setSearchQuery('');
            }}
            style={[styles.tab, activeTab === 'friends' && styles.tabActive]}
          >
            <Text style={[styles.tabText, activeTab === 'friends' && styles.tabTextActive]}>
              Friends ({filteredFriends.length})
            </Text>
          </Pressable>
          <Pressable
            onPress={() => {
              setActiveTab('requests');
              setSearchQuery('');
            }}
            style={[styles.tab, activeTab === 'requests' && styles.tabActive]}
          >
            <Text style={[styles.tabText, activeTab === 'requests' && styles.tabTextActive]}>
              Requests ({friendRequests.length})
            </Text>
          </Pressable>
          <Pressable
            onPress={() => {
              setActiveTab('search');
              setSearchQuery('');
            }}
            style={[styles.tab, activeTab === 'search' && styles.tabActive]}
          >
            <Text style={[styles.tabText, activeTab === 'search' && styles.tabTextActive]}>
              Search
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {activeTab === 'friends' ? (
          <View style={styles.friendsList}>
            {filteredFriends.length > 0 ? (
              filteredFriends.map((user) => (
                <Pressable
                  key={user.username}
                  onPress={() => handleProfilePress(user.username)}
                  style={styles.friendItem}
                >
                  <Image source={{ uri: user.avatar }} style={styles.avatar} />
                  <View style={styles.friendInfo}>
                    <Text style={styles.friendName}>{user.username}</Text>
                    <Text style={styles.friendLocation}>{user.location}</Text>
                    <Text style={styles.friendPhotos}>{user.photoCount} photos</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
                </Pressable>
              ))
            ) : (
              <Text style={styles.emptyText}>No friends found</Text>
            )}
          </View>
        ) : activeTab === 'requests' ? (
          <View style={styles.requestsList}>
            {friendRequests.length > 0 ? (
              friendRequests.map((request) => (
                <Pressable
                  key={request.username}
                  onPress={() => handleProfilePress(request.username)}
                  style={styles.requestItem}
                >
                  <Image source={{ uri: request.avatar }} style={styles.avatar} />
                  <View style={styles.requestInfo}>
                    <Text style={styles.requestName}>{request.username}</Text>
                    <Text style={styles.requestLocation}>{request.location}</Text>
                    <Text style={styles.requestPhotos}>{request.photoCount} photos</Text>
                  </View>
                  <View style={styles.requestActions}>
                    <Pressable
                      onPress={(e) => {
                        e.stopPropagation();
                        handleAcceptRequest(request.username);
                      }}
                      style={[styles.requestButton, styles.acceptButton]}
                    >
                      <Ionicons name="checkmark" size={20} color="white" />
                    </Pressable>
                    <Pressable
                      onPress={(e) => {
                        e.stopPropagation();
                        handleRejectRequest(request.username);
                      }}
                      style={[styles.requestButton, styles.rejectButton]}
                    >
                      <Ionicons name="close" size={20} color="white" />
                    </Pressable>
                  </View>
                </Pressable>
              ))
            ) : (
              <Text style={styles.emptyText}>No pending requests</Text>
            )}
          </View>
        ) : (
          <View style={styles.searchResultsList}>
            {searchResults.length > 0 ? (
              searchResults.map((user) => {
                const isAlreadyFriend = mockData.isFriend ? mockData.isFriend(user.username) : false;
                const hasRequest = mockData.hasPendingRequest 
                  ? mockData.hasPendingRequest(user.username) 
                  : (mockData.pendingFriendRequests && mockData.pendingFriendRequests.has(user.username));
                const profile = getUserProfileData(user.username);
                const isPublic = profile?.isPublic ?? user.isPublic ?? false;
                
                return (
                  <Pressable
                    key={user.username}
                    onPress={() => handleProfilePress(user.username)}
                    style={styles.friendItem}
                  >
                    <Image source={{ uri: user.avatar }} style={styles.avatar} />
                    <View style={styles.friendInfo}>
                      <Text style={styles.friendName}>{user.username}</Text>
                      <Text style={styles.friendLocation}>{user.location}</Text>
                      <Text style={styles.friendPhotos}>{user.photoCount} photos</Text>
                    </View>
                    {isAlreadyFriend ? (
                      <View style={styles.friendBadge}>
                        <Ionicons name="checkmark-circle" size={20} color="#10b981" />
                        <Text style={styles.friendBadgeText}>Friends</Text>
                      </View>
                    ) : hasRequest && isPublic ? (
                      <View style={styles.addedBadge}>
                        <Ionicons name="checkmark-circle" size={20} color="#06b6d4" />
                        <Text style={styles.addedBadgeText}>Added</Text>
                      </View>
                    ) : hasRequest ? (
                      <View style={styles.pendingBadge}>
                        <Text style={styles.pendingBadgeText}>Request Sent</Text>
                      </View>
                    ) : (
                      <Pressable
                        onPress={(e) => {
                          e.stopPropagation();
                          handleSendFriendRequest(user.username);
                        }}
                        style={styles.addButton}
                      >
                        <Ionicons name="person-add" size={20} color="white" />
                        <Text style={styles.addButtonText}>Add</Text>
                      </Pressable>
                    )}
                  </Pressable>
                );
              })
            ) : searchQuery.trim() ? (
              <Text style={styles.emptyText}>No users found</Text>
            ) : (
              <Text style={styles.emptyText}>Start typing to search for users</Text>
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
  },
  tabSwitcher: {
    flexDirection: 'row',
    gap: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
  },
  tabActive: {
    backgroundColor: '#06b6d4',
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
  friendsList: {
    gap: 12,
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  friendLocation: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 2,
  },
  friendPhotos: {
    fontSize: 12,
    color: '#9ca3af',
  },
  requestsList: {
    gap: 12,
  },
  requestItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
  },
  requestInfo: {
    flex: 1,
  },
  requestName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  requestLocation: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 2,
  },
  requestPhotos: {
    fontSize: 12,
    color: '#9ca3af',
  },
  requestActions: {
    flexDirection: 'row',
    gap: 8,
  },
  requestButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptButton: {
    backgroundColor: '#10b981',
  },
  rejectButton: {
    backgroundColor: '#ef4444',
  },
  searchResultsList: {
    gap: 12,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#06b6d4',
    borderRadius: 20,
  },
  addButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  friendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  friendBadgeText: {
    color: '#10b981',
    fontSize: 14,
    fontWeight: '500',
  },
  pendingBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  pendingBadgeText: {
    color: '#6b7280',
    fontSize: 14,
    fontWeight: '500',
  },
  addedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  addedBadgeText: {
    color: '#06b6d4',
    fontSize: 14,
    fontWeight: '500',
  },
  emptyText: {
    textAlign: 'center',
    color: '#9ca3af',
    fontSize: 16,
    marginTop: 32,
  },
});
