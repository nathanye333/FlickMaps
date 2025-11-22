import React, { useState } from 'react';
import { View, Text, Pressable, Modal, StyleSheet, Alert, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { AppContext } from '../../App';

interface PhotoUploadModalProps {
  onClose: () => void;
  onPhotosUploaded?: (photos: UploadedPhoto[]) => void;
  visible: boolean;
}

export interface UploadedPhoto {
  imageUrl: string;
  lat: number;
  lng: number;
  timestamp: Date;
  fileName: string;
}

export function PhotoUploadModal({ onClose, onPhotosUploaded, visible }: PhotoUploadModalProps) {
  const context = React.useContext(AppContext);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [processingStatus, setProcessingStatus] = useState<{ [key: string]: 'processing' | 'success' | 'error' }>({});
  const [errorMessages, setErrorMessages] = useState<{ [key: string]: string }>({});
  const [submitToDailyChallenge, setSubmitToDailyChallenge] = useState(false);
  const [visibility, setVisibility] = useState<'personal' | 'friends' | 'public'>('friends');

  const pickImages = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Please grant photo library access');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets) {
      const uris = result.assets.map(asset => asset.uri);
      setSelectedImages(uris);
      
      // Process each image
      const location = await Location.getCurrentPositionAsync({});
      const photos: UploadedPhoto[] = [];
      
      for (const uri of uris) {
        const photo: UploadedPhoto = {
          imageUrl: uri,
          lat: location.coords.latitude,
          lng: location.coords.longitude,
          timestamp: new Date(),
          fileName: uri.split('/').pop() || 'photo.jpg',
        };
        photos.push(photo);
        setProcessingStatus(prev => ({ ...prev, [uri]: 'success' }));
      }
      
      if (onPhotosUploaded) {
        onPhotosUploaded(photos);
      }
    }
  };

  const handleUpload = () => {
    if (selectedImages.length === 0) {
      Alert.alert('No photos', 'Please select photos to upload');
      return;
    }
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Upload Photos</Text>
            <Pressable onPress={onClose}>
              <Ionicons name="close" size={24} color="#111827" />
            </Pressable>
          </View>

          <View style={styles.content}>
            <Text style={styles.infoText}>
              Select photos with GPS data to upload to your map
            </Text>

            <Pressable onPress={pickImages} style={styles.pickButton}>
              <Ionicons name="images" size={24} color="#06b6d4" />
              <Text style={styles.pickButtonText}>Pick Photos</Text>
            </Pressable>

            {selectedImages.length > 0 && (
              <ScrollView style={styles.imageList}>
                {selectedImages.map((uri, index) => (
                  <View key={index} style={styles.imageItem}>
                    <Image source={{ uri }} style={styles.thumbnail} />
                    <View style={styles.imageInfo}>
                      <Text style={styles.imageName}>{uri.split('/').pop()}</Text>
                      {processingStatus[uri] === 'success' && (
                        <Ionicons name="checkmark-circle" size={20} color="#10b981" />
                      )}
                    </View>
                  </View>
                ))}
              </ScrollView>
            )}

            {/* Visibility Options */}
            {selectedImages.length > 0 && (
              <View style={styles.visibilitySection}>
                <Text style={styles.visibilityLabel}>Who can see these photos?</Text>
                <View style={styles.visibilityOptions}>
                  <Pressable
                    onPress={() => setVisibility('personal')}
                    style={[styles.visibilityButton, visibility === 'personal' && styles.visibilityButtonActive]}
                  >
                    <Text style={[styles.visibilityButtonText, visibility === 'personal' && styles.visibilityButtonTextActive]}>Just Me</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => setVisibility('friends')}
                    style={[styles.visibilityButton, visibility === 'friends' && styles.visibilityButtonActive]}
                  >
                    <Text style={[styles.visibilityButtonText, visibility === 'friends' && styles.visibilityButtonTextActive]}>Friends</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => setVisibility('public')}
                    style={[styles.visibilityButton, visibility === 'public' && styles.visibilityButtonActive]}
                  >
                    <Text style={[styles.visibilityButtonText, visibility === 'public' && styles.visibilityButtonTextActive]}>Public</Text>
                  </Pressable>
                </View>
              </View>
            )}

            {/* Daily Challenge Submission */}
            {context?.isDailyChallengeActive && selectedImages.length > 0 && (
              <View style={styles.dailyChallengeSection}>
                <Pressable
                  onPress={() => setSubmitToDailyChallenge(!submitToDailyChallenge)}
                  style={[styles.dailyChallengeOption, submitToDailyChallenge && styles.dailyChallengeOptionActive]}
                >
                  <View style={[styles.dailyChallengeCheckbox, submitToDailyChallenge && styles.dailyChallengeCheckboxActive]}>
                    {submitToDailyChallenge && (
                      <Ionicons name="checkmark" size={16} color="white" />
                    )}
                  </View>
                  <Text style={styles.dailyChallengeText}>Submit to Daily Challenge</Text>
                </Pressable>
              </View>
            )}
          </View>

          <View style={styles.footer}>
            <Pressable onPress={onClose} style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </Pressable>
            <Pressable onPress={handleUpload} style={styles.uploadButton}>
              <Text style={styles.uploadButtonText}>Upload</Text>
            </Pressable>
          </View>
        </View>
      </View>
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
    padding: 16,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  content: {
    marginBottom: 16,
  },
  infoText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  pickButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    backgroundColor: '#ecfeff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#06b6d4',
    borderStyle: 'dashed',
  },
  pickButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#06b6d4',
  },
  imageList: {
    maxHeight: 200,
    marginTop: 16,
  },
  imageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 8,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    marginBottom: 8,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  imageInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  imageName: {
    fontSize: 14,
    color: '#111827',
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  uploadButton: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#06b6d4',
  },
  uploadButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  visibilitySection: {
    marginTop: 16,
    marginBottom: 8,
  },
  visibilityLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  visibilityOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  visibilityButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    backgroundColor: 'white',
    alignItems: 'center',
  },
  visibilityButtonActive: {
    borderColor: '#06b6d4',
    backgroundColor: '#ecfeff',
  },
  visibilityButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  visibilityButtonTextActive: {
    color: '#06b6d4',
  },
  dailyChallengeSection: {
    marginTop: 8,
    marginBottom: 8,
  },
  dailyChallengeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    backgroundColor: 'white',
  },
  dailyChallengeOptionActive: {
    borderColor: '#fb923c',
    backgroundColor: '#fff7ed',
  },
  dailyChallengeCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#fb923c',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dailyChallengeCheckboxActive: {
    backgroundColor: '#fb923c',
  },
  dailyChallengeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
});
