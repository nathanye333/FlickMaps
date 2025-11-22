import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView, FlatList } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { mockGroups, Group, addGroup } from '../data/mockData';
import { CreateGroupModal } from './CreateGroupModal';

interface GroupMapsScreenProps {
  onBack?: () => void;
  onGroupSelect?: (groupId: string) => void;
  onCreateGroup?: () => void;
  navigation?: any;
  route?: any;
}

export function GroupMapsScreen(props: GroupMapsScreenProps) {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [showCreateModal, setShowCreateModal] = useState(false);
  // Use a copy of mockGroups to avoid reference issues
  const [groups, setGroups] = useState([...mockGroups]);

  const handleBack = () => {
    if (props.onBack) {
      props.onBack();
    } else {
      navigation.goBack();
    }
  };

  const handleCreateGroup = (name: string, selectedFriends: string[]) => {
    const newGroup = addGroup(name, selectedFriends);
    // Check if group already exists to avoid duplicates
    setGroups(prev => {
      if (prev.some(g => g.id === newGroup.id)) {
        return prev; // Group already exists, don't add duplicate
      }
      return [...prev, newGroup];
    });
    // Navigate to the new group
    if (props.onGroupSelect) {
      props.onGroupSelect(newGroup.id);
    } else {
      navigation.navigate('GroupMapView' as never, { groupId: newGroup.id, groupName: newGroup.name } as never);
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
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Pressable onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </Pressable>
        <View style={styles.headerText}>
          <Text style={styles.title}>Group Maps</Text>
          <Text style={styles.subtitle}>Share photos and explore locations with your groups</Text>
        </View>
      </View>

      <FlatList
        data={groups}
        renderItem={renderGroup}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 100 }]}
      />

      <Pressable
        onPress={() => setShowCreateModal(true)}
        style={[styles.createButton, { 
          position: 'absolute',
          bottom: insets.bottom + 16,
          left: 16,
          right: 16,
        }]}
      >
        <Ionicons name="add" size={24} color="white" />
        <Text style={styles.createButtonText}>Create Group</Text>
      </Pressable>

      <CreateGroupModal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateGroup={handleCreateGroup}
      />
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
    padding: 16,
    backgroundColor: '#06b6d4',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
