import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView, TextInput } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

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

const mockUsers: User[] = [
  { username: 'Sarah Chen', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop', location: 'San Francisco, CA', photoCount: 24, isPublic: true },
  { username: 'Mike Wilson', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', location: 'Oakland, CA', photoCount: 18, isPublic: true },
  { username: 'Emma Davis', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop', location: 'Berkeley, CA', photoCount: 31, isPublic: true },
  { username: 'James Lee', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop', location: 'San Jose, CA', photoCount: 15, isPublic: true },
];

const mockFriendRequests: FriendRequest[] = [
  { username: 'Travel Bug', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop', location: 'San Diego, CA', photoCount: 78, timestamp: new Date('2025-11-20T14:30:00') },
  { username: 'Urban Lens', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop', location: 'Seattle, WA', photoCount: 67, timestamp: new Date('2025-11-19T10:15:00') },
];

export function FriendsScreen({ onProfileClick, navigation, route }: FriendsScreenProps) {
  const nav = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'friends' | 'requests'>('friends');
  const [friends] = useState<Set<string>>(new Set(['Sarah Chen', 'Mike Wilson', 'Emma Davis', 'James Lee']));
  const [friendRequests, setFriendRequests] = useState(mockFriendRequests);

  const filteredFriends = mockUsers.filter(user => 
    friends.has(user.username) && 
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAcceptRequest = (username: string) => {
    setFriendRequests(prev => prev.filter(req => req.username !== username));
  };

  const handleRejectRequest = (username: string) => {
    setFriendRequests(prev => prev.filter(req => req.username !== username));
  };

  const handleProfilePress = (username: string) => {
    if (onProfileClick) {
      onProfileClick(username);
    } else {
      nav.navigate('UserMap' as never, { username } as never);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Friends</Text>
        
        {/* Search */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#9ca3af" style={styles.searchIcon} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search friends..."
            style={styles.searchInput}
            placeholderTextColor="#9ca3af"
          />
        </View>

        {/* Tab Switcher */}
        <View style={styles.tabSwitcher}>
          <Pressable
            onPress={() => setActiveTab('friends')}
            style={[styles.tab, activeTab === 'friends' && styles.tabActive]}
          >
            <Text style={[styles.tabText, activeTab === 'friends' && styles.tabTextActive]}>
              Friends ({filteredFriends.length})
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setActiveTab('requests')}
            style={[styles.tab, activeTab === 'requests' && styles.tabActive]}
          >
            <Text style={[styles.tabText, activeTab === 'requests' && styles.tabTextActive]}>
              Requests ({friendRequests.length})
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {activeTab === 'friends' ? (
          <View style={styles.friendsList}>
            {filteredFriends.map((user) => (
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
            ))}
          </View>
        ) : (
          <View style={styles.requestsList}>
            {friendRequests.map((request) => (
              <View key={request.username} style={styles.requestItem}>
                <Image source={{ uri: request.avatar }} style={styles.avatar} />
                <View style={styles.requestInfo}>
                  <Text style={styles.requestName}>{request.username}</Text>
                  <Text style={styles.requestLocation}>{request.location}</Text>
                  <Text style={styles.requestPhotos}>{request.photoCount} photos</Text>
                </View>
                <View style={styles.requestActions}>
                  <Pressable
                    onPress={() => handleAcceptRequest(request.username)}
                    style={[styles.requestButton, styles.acceptButton]}
                  >
                    <Ionicons name="checkmark" size={20} color="white" />
                  </Pressable>
                  <Pressable
                    onPress={() => handleRejectRequest(request.username)}
                    style={[styles.requestButton, styles.rejectButton]}
                  >
                    <Ionicons name="close" size={20} color="white" />
                  </Pressable>
                </View>
              </View>
            ))}
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
});
