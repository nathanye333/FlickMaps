import React, { useState } from 'react';
import { View, Text, Pressable, Modal, StyleSheet, TextInput, ScrollView, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { friendships } from '../data/mockData';

interface CreateGroupModalProps {
  visible: boolean;
  onClose: () => void;
  onCreateGroup: (name: string, selectedFriends: string[]) => void;
}

// Mock friend data with avatars
const mockFriends = [
  { username: 'Sarah Chen', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop' },
  { username: 'Mike Wilson', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop' },
  { username: 'Emma Davis', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop' },
  { username: 'James Lee', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop' },
];

export function CreateGroupModal({ visible, onClose, onCreateGroup }: CreateGroupModalProps) {
  const [groupName, setGroupName] = useState('');
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);

  const handleToggleFriend = (username: string) => {
    setSelectedFriends(prev => 
      prev.includes(username) 
        ? prev.filter(f => f !== username)
        : [...prev, username]
    );
  };

  const handleCreate = () => {
    if (!groupName.trim()) {
      return;
    }
    onCreateGroup(groupName.trim(), selectedFriends);
    setGroupName('');
    setSelectedFriends([]);
    onClose();
  };

  const handleClose = () => {
    setGroupName('');
    setSelectedFriends([]);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <Pressable style={styles.overlay} onPress={handleClose}>
        <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
          {/* Handle Bar */}
          <View style={styles.handleBarContainer}>
            <View style={styles.handleBar} />
          </View>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerText}>Create Group</Text>
            <Pressable onPress={handleClose} style={styles.closeButton}>
              <Ionicons name="close" size={20} color="#4b5563" />
            </Pressable>
          </View>

          {/* Group Name Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Group Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter group name"
              placeholderTextColor="#9ca3af"
              value={groupName}
              onChangeText={setGroupName}
              maxLength={50}
            />
          </View>

          {/* Friends Selection */}
          <View style={styles.friendsContainer}>
            <Text style={styles.label}>Select Friends</Text>
            <Text style={styles.subLabel}>{selectedFriends.length} selected</Text>
          </View>

          <ScrollView style={styles.friendsList} showsVerticalScrollIndicator={false}>
            {mockFriends.map((friend) => {
              const isSelected = selectedFriends.includes(friend.username);
              return (
                <Pressable
                  key={friend.username}
                  onPress={() => handleToggleFriend(friend.username)}
                  style={[styles.friendItem, isSelected && styles.friendItemSelected]}
                >
                  <Image source={{ uri: friend.avatar }} style={styles.friendAvatar} />
                  <Text style={styles.friendName}>{friend.username}</Text>
                  <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                    {isSelected && <Ionicons name="checkmark" size={16} color="white" />}
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* Create Button */}
          <Pressable
            onPress={handleCreate}
            style={[styles.createButton, !groupName.trim() && styles.createButtonDisabled]}
            disabled={!groupName.trim()}
          >
            <Text style={styles.createButtonText}>Create Group</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 32,
    paddingTop: 16,
    paddingHorizontal: 16,
    maxHeight: '90%',
    maxWidth: 448,
    width: '100%',
    alignSelf: 'center',
  },
  handleBarContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  handleBar: {
    width: 48,
    height: 4,
    backgroundColor: '#d1d5db',
    borderRadius: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  headerText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  subLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#f9fafb',
  },
  friendsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  friendsList: {
    maxHeight: 300,
    marginBottom: 24,
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#f9fafb',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  friendItemSelected: {
    backgroundColor: '#ecfeff',
    borderColor: '#06b6d4',
  },
  friendAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  friendName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#d1d5db',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  checkboxSelected: {
    backgroundColor: '#06b6d4',
    borderColor: '#06b6d4',
  },
  createButton: {
    backgroundColor: '#06b6d4',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  createButtonDisabled: {
    backgroundColor: '#d1d5db',
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

