import { View, Text, Pressable, StyleSheet, Modal, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Photo } from '../App';

interface PhotoStackModalProps {
  photos: Photo[];
  onClose: () => void;
  onPhotoSelect: (photo: Photo) => void;
}

const { width } = Dimensions.get('window');

export function PhotoStackModal({ photos, onClose, onPhotoSelect }: PhotoStackModalProps) {
  return (
    <Modal
      visible={true}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.modal} onPress={(e) => e.stopPropagation()}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerText}>
              {photos.length} Photos at this location
            </Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={20} color="#6b7280" />
            </Pressable>
          </View>

          {/* Photo Grid */}
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.grid}>
              {photos.map((photo, index) => (
                <Pressable
                  key={photo.id}
                  onPress={() => {
                    onPhotoSelect(photo);
                    onClose();
                  }}
                  style={styles.photoItem}
                >
                  <Image
                    source={{ uri: photo.imageUrl }}
                    style={styles.photoImage}
                    contentFit="cover"
                  />
                  
                  {/* Profile Picture in Top-Left Corner */}
                  <View style={styles.avatarContainer}>
                    <Image
                      source={{ uri: photo.authorAvatar }}
                      style={styles.avatar}
                      contentFit="cover"
                    />
                  </View>
                  
                  {/* Caption overlay */}
                  <View style={styles.overlay}>
                    <Text style={styles.caption} numberOfLines={2}>
                      {photo.caption || `Photo ${index + 1}`}
                    </Text>
                    <Text style={styles.date}>
                      {new Date(photo.timestamp).toLocaleDateString()}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </View>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: 24,
    maxWidth: width * 0.9,
    maxHeight: '80%',
    width: '100%',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerText: {
    fontSize: 18,
    color: '#111827',
    fontWeight: '600',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    maxHeight: '80%',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
  },
  photoItem: {
    width: (width * 0.9 - 44) / 2,
    aspectRatio: 1,
    borderRadius: 12,
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
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  caption: {
    color: 'white',
    fontSize: 14,
    marginBottom: 4,
  },
  date: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
  },
});
