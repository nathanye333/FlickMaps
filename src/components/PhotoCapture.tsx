import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, TextInput, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppContext } from '../../App';

interface PhotoCaptureProps {
  onComplete: () => void;
  onCancel: () => void;
  navigation?: any;
  route?: any;
}

export function PhotoCapture({ onComplete, onCancel }: PhotoCaptureProps) {
  const insets = useSafeAreaInsets();
  const context = React.useContext(AppContext);
  const [step, setStep] = useState<'camera' | 'details'>('camera');
  const [caption, setCaption] = useState('');
  const [visibility, setVisibility] = useState<'personal' | 'friends' | 'public'>('friends');
  const [submitToDailyChallenge, setSubmitToDailyChallenge] = useState(false);
  const [facing, setFacing] = useState<'back' | 'front'>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [location, setLocation] = useState<Location.LocationObject | null>(null);

  React.useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({});
        setLocation(loc);
      }
    })();
  }, []);

  const handleCapture = async () => {
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        Alert.alert('Permission required', 'Camera permission is required to take photos');
        return;
      }
    }
    setStep('details');
  };

  const handlePost = () => {
    // In a real app, this would upload the photo
    // If submitting to daily challenge, handle that here
    if (submitToDailyChallenge && context?.setIsDailyChallengeActive) {
      // Keep daily challenge active after submission
      // In a real app, this would submit the photo to the challenge
      console.log('Submitting to daily challenge with visibility:', visibility);
    }
    onComplete();
  };

  const getLocationString = () => {
    if (location) {
      return `San Francisco, CA`; // In real app, reverse geocode
    }
    return 'Location unavailable';
  };

  if (step === 'camera') {
    return (
      <View style={styles.cameraContainer}>
        {permission?.granted ? (
          <CameraView
            style={styles.camera}
            facing={facing}
          >
            {/* Top Bar */}
            <View style={[styles.topBar, { paddingTop: Math.max(insets.top + 16, 44) }]}>
              <Pressable onPress={onCancel} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="white" />
              </Pressable>
              
              <View style={styles.locationBadge}>
                <Ionicons name="location" size={16} color="#22d3ee" />
                <Text style={styles.locationText}>{getLocationString()}</Text>
              </View>
            </View>

            {/* Capture Button */}
            <View style={styles.captureButtonContainer}>
              <Pressable
                onPress={handleCapture}
                style={styles.captureButton}
              >
                <View style={styles.captureButtonInner} />
              </Pressable>
            </View>
          </CameraView>
        ) : (
          <View style={styles.cameraPlaceholder}>
            <Ionicons name="camera" size={96} color="#4b5563" />
            <Text style={styles.placeholderText}>Camera View</Text>
            <Pressable onPress={requestPermission} style={styles.permissionButton}>
              <Text style={styles.permissionButtonText}>Grant Camera Permission</Text>
            </Pressable>
          </View>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top + 16, 44) }]}>
        <Pressable onPress={onCancel}>
          <Text style={styles.cancelText}>Cancel</Text>
        </Pressable>
        <Text style={styles.headerTitle}>New Post</Text>
        <Pressable onPress={handlePost}>
          <Text style={styles.postText}>Post</Text>
        </Pressable>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Photo Preview */}
        <View style={styles.photoPreview}>
          <Ionicons name="camera" size={64} color="#9ca3af" />
        </View>

        {/* Location */}
        <View style={styles.locationContainer}>
          <Ionicons name="location" size={20} color="#06b6d4" />
          <View style={styles.locationTextContainer}>
            <Text style={styles.locationTitle}>{getLocationString()}</Text>
            <Text style={styles.locationCoords}>
              {location ? `${location.coords.latitude.toFixed(4)}° N, ${location.coords.longitude.toFixed(4)}° W` : 'No location'}
            </Text>
          </View>
        </View>

        {/* Caption */}
        <View style={styles.section}>
          <Text style={styles.label}>Caption (optional)</Text>
          <TextInput
            value={caption}
            onChangeText={setCaption}
            placeholder="Write a caption..."
            style={styles.textInput}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        {/* Visibility */}
        <View style={styles.section}>
          <Text style={styles.label}>Who can see this?</Text>
          <View style={styles.visibilityOptions}>
            <Pressable
              onPress={() => setVisibility('personal')}
              style={[
                styles.visibilityOption,
                visibility === 'personal' && styles.visibilityOptionActive
              ]}
            >
              <Ionicons name="lock-closed" size={20} color="#4b5563" />
              <View style={styles.visibilityTextContainer}>
                <Text style={styles.visibilityTitle}>Just Me</Text>
                <Text style={styles.visibilitySubtitle}>Private to your map</Text>
              </View>
            </Pressable>

            <Pressable
              onPress={() => setVisibility('friends')}
              style={[
                styles.visibilityOption,
                visibility === 'friends' && styles.visibilityOptionActive
              ]}
            >
              <Ionicons name="people" size={20} color="#4b5563" />
              <View style={styles.visibilityTextContainer}>
                <Text style={styles.visibilityTitle}>Friends</Text>
                <Text style={styles.visibilitySubtitle}>Share with friends</Text>
              </View>
            </Pressable>

            <Pressable
              onPress={() => setVisibility('public')}
              style={[
                styles.visibilityOption,
                visibility === 'public' && styles.visibilityOptionActive
              ]}
            >
              <Ionicons name="globe" size={20} color="#4b5563" />
              <View style={styles.visibilityTextContainer}>
                <Text style={styles.visibilityTitle}>Public</Text>
                <Text style={styles.visibilitySubtitle}>Visible on global map</Text>
              </View>
            </Pressable>
          </View>
        </View>

        {/* Daily Challenge Submission */}
        {context?.isDailyChallengeActive && (
          <View style={styles.section}>
            <Pressable
              onPress={() => setSubmitToDailyChallenge(!submitToDailyChallenge)}
              style={[
                styles.dailyChallengeOption,
                submitToDailyChallenge && styles.dailyChallengeOptionActive
              ]}
            >
              <View style={styles.dailyChallengeCheckbox}>
                {submitToDailyChallenge && (
                  <Ionicons name="checkmark" size={16} color="white" />
                )}
              </View>
              <View style={styles.visibilityTextContainer}>
                <Text style={styles.visibilityTitle}>Submit to Daily Challenge</Text>
                <Text style={styles.visibilitySubtitle}>Enter this photo in today's challenge</Text>
              </View>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  cameraContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
  cameraPlaceholder: {
    flex: 1,
    backgroundColor: '#1f2937',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    color: '#6b7280',
    marginTop: 16,
  },
  permissionButton: {
    marginTop: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#06b6d4',
    borderRadius: 12,
  },
  permissionButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 10,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  locationText: {
    color: 'white',
    fontSize: 14,
  },
  captureButtonContainer: {
    position: 'absolute',
    bottom: 32,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#1f2937',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  captureButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#06b6d4',
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    zIndex: 10,
  },
  cancelText: {
    color: '#4b5563',
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  postText: {
    color: '#06b6d4',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    gap: 24,
  },
  photoPreview: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#e5e7eb',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 16,
  },
  locationTextContainer: {
    flex: 1,
  },
  locationTitle: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
  },
  locationCoords: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  section: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
    marginBottom: 8,
  },
  textInput: {
    width: '100%',
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 16,
    fontSize: 16,
    minHeight: 80,
  },
  visibilityOptions: {
    gap: 8,
  },
  visibilityOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    backgroundColor: 'white',
  },
  visibilityOptionActive: {
    borderColor: '#06b6d4',
    backgroundColor: '#ecfeff',
  },
  visibilityTextContainer: {
    flex: 1,
  },
  visibilityTitle: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
  },
  visibilitySubtitle: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  dailyChallengeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 16,
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
});
