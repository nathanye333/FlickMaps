import React, { useState } from 'react';
import { View, Text, Pressable, Modal, StyleSheet, Alert, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';

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
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [processingStatus, setProcessingStatus] = useState<{ [key: string]: 'processing' | 'success' | 'error' }>({});
  const [errorMessages, setErrorMessages] = useState<{ [key: string]: string }>({});

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
});
