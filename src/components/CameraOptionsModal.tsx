import React from 'react';
import { View, Text, Pressable, Modal, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CameraOptionsModalProps {
  onTakePhoto: () => void;
  onUploadPhoto: () => void;
  onClose: () => void;
  visible: boolean;
}

export function CameraOptionsModal({ onTakePhoto, onUploadPhoto, onClose, visible }: CameraOptionsModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
          {/* Handle Bar */}
          <View style={styles.handleBarContainer}>
            <View style={styles.handleBar} />
          </View>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerText}>Add Photo</Text>
            <Pressable
              onPress={onClose}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={20} color="#4b5563" />
            </Pressable>
          </View>

          {/* Options */}
          <View style={styles.optionsContainer}>
            <Pressable
              onPress={onTakePhoto}
              style={[styles.optionButton, styles.optionButtonPrimary]}
            >
              <View style={styles.optionIconContainer}>
                <Ionicons name="camera" size={24} color="white" />
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionTitle}>Take Photo</Text>
                <Text style={styles.optionSubtitle}>Capture with camera</Text>
              </View>
            </Pressable>

            <Pressable
              onPress={onUploadPhoto}
              style={[styles.optionButton, styles.optionButtonSecondary]}
            >
              <View style={[styles.optionIconContainer, styles.optionIconContainerSecondary]}>
                <Ionicons name="cloud-upload" size={24} color="#374151" />
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={[styles.optionTitle, styles.optionTitleSecondary]}>Upload from Device</Text>
                <Text style={styles.optionSubtitleSecondary}>Must have GPS & date</Text>
              </View>
            </Pressable>
          </View>
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
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 16,
    borderRadius: 16,
  },
  optionButtonPrimary: {
    backgroundColor: '#06b6d4',
  },
  optionButtonSecondary: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  optionIconContainer: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionIconContainerSecondary: {
    backgroundColor: '#f3f4f6',
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 4,
  },
  optionTitleSecondary: {
    color: '#111827',
  },
  optionSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  optionSubtitleSecondary: {
    color: '#6b7280',
  },
});
