import React from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView, FlatList } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

interface Group {
  id: string;
  name: string;
  memberCount: number;
  members: { username: string; avatar: string }[];
  mapPreview: string;
  lastUpdated: string;
  photoCount: number;
}

interface GroupMapsScreenProps {
  onBack?: () => void;
  onGroupSelect?: (groupId: string) => void;
  onCreateGroup?: () => void;
  navigation?: any;
  route?: any;
}

const mockGroups: Group[] = [
  {
    id: 'europe-trip',
    name: 'Europe Trip',
    memberCount: 5,
    members: [
      { username: 'Sarah Chen', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop' },
      { username: 'Mike Wilson', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop' },
    ],
    mapPreview: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=400&fit=crop',
    lastUpdated: '2 days ago',
    photoCount: 47
  },
  {
    id: 'photography-club',
    name: 'Photography Club',
    memberCount: 12,
    members: [
      { username: 'Photography Pro', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop' },
    ],
    mapPreview: 'https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?w=400&h=400&fit=crop',
    lastUpdated: '5 hours ago',
    photoCount: 124
  },
];

export function GroupMapsScreen(props: GroupMapsScreenProps) {
  const navigation = useNavigation();

  const handleBack = () => {
    if (props.onBack) {
      props.onBack();
    } else {
      navigation.goBack();
    }
  };

  const handleGroupSelect = (groupId: string) => {
    if (props.onGroupSelect) {
      props.onGroupSelect(groupId);
    } else {
      const group = mockGroups.find(g => g.id === groupId);
      navigation.navigate('GroupMapView' as never, { groupId, groupName: group?.name || 'Group' } as never);
    }
  };

  const renderGroup = ({ item }: { item: Group }) => (
    <Pressable
      onPress={() => handleGroupSelect(item.id)}
      style={styles.groupItem}
    >
      <Image source={{ uri: item.mapPreview }} style={styles.groupPreview} />
      <View style={styles.groupInfo}>
        <Text style={styles.groupName}>{item.name}</Text>
        <Text style={styles.groupMeta}>{item.memberCount} members • {item.photoCount} photos</Text>
        <Text style={styles.groupUpdated}>Updated {item.lastUpdated}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </Pressable>
        <View style={styles.headerText}>
          <Text style={styles.title}>Group Maps</Text>
          <Text style={styles.subtitle}>Share photos and explore locations with your groups</Text>
        </View>
      </View>

      <FlatList
        data={mockGroups}
        renderItem={renderGroup}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />

      <Pressable
        onPress={props.onCreateGroup}
        style={styles.createButton}
      >
        <Ionicons name="add" size={24} color="white" />
        <Text style={styles.createButtonText}>Create Group</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  list: {
    padding: 16,
  },
  groupItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    marginBottom: 12,
  },
  groupPreview: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  groupInfo: {
    flex: 1,
  },
  groupName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  groupMeta: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 2,
  },
  groupUpdated: {
    fontSize: 12,
    color: '#9ca3af',
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    margin: 16,
    padding: 16,
    backgroundColor: '#06b6d4',
    borderRadius: 12,
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
