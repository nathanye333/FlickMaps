import React, { useMemo, useState } from 'react';
import { View, Text, Pressable, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Photo } from '../App';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MapView from 'react-native-maps';
import { MapMarker } from './MapMarker';
import { PhotoStackModal } from './PhotoStackModal';
import { CameraOptionsModal } from './CameraOptionsModal';
import { PhotoUploadModal, UploadedPhoto } from './PhotoUploadModal';
import { getGroupPhotos, getGroupById } from '../data/mockData';

const { width, height } = Dimensions.get('window');

interface GroupMapViewProps {
  groupId?: string;
  groupName?: string;
  onBack?: () => void;
  onPhotoSelect?: (photo: Photo) => void;
  onProfileClick?: (username: string) => void;
  navigation?: any;
  route?: any;
}

export function GroupMapView(props: GroupMapViewProps) {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const groupId = (route.params as any)?.groupId || props.groupId || '';
  const group = getGroupById(groupId);
  const groupName = group?.name || (route.params as any)?.groupName || props.groupName || 'Group';
  
  // Get photos for this group
  const groupPhotos = useMemo(() => {
    return getGroupPhotos(groupId);
  }, [groupId]);

  const handleBack = () => {
    if (props.onBack) {
      props.onBack();
    } else {
      navigation.goBack();
    }
  };

  const [selectedStack, setSelectedStack] = useState<Photo[] | null>(null);
  const [showCameraOptions, setShowCameraOptions] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const [region, setRegion] = useState(() => {
    if (groupPhotos.length > 0) {
      // Calculate center of all photos
      const avgLat = groupPhotos.reduce((sum, p) => sum + p.lat, 0) / groupPhotos.length;
      const avgLng = groupPhotos.reduce((sum, p) => sum + p.lng, 0) / groupPhotos.length;
      
      // Calculate bounds
      const lats = groupPhotos.map(p => p.lat);
      const lngs = groupPhotos.map(p => p.lng);
      const latDelta = Math.max(...lats) - Math.min(...lats);
      const lngDelta = Math.max(...lngs) - Math.min(...lngs);
      
      return {
        latitude: avgLat,
        longitude: avgLng,
        latitudeDelta: Math.max(latDelta * 1.5, 0.0922),
        longitudeDelta: Math.max(lngDelta * 1.5, 0.0421),
      };
    }
    return {
      latitude: 48.8566,
      longitude: 2.3522,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    };
  });

  // Calculate adaptive marker size - photos get larger when zoomed in, smaller when zoomed out
  const calculateMarkerSize = (latitudeDelta: number, nearbyCount: number = 0, photoCount: number = 1): number => {
    const zoomFactor = Math.max(0.001, Math.min(0.15, latitudeDelta));
    const normalizedZoom = Math.log(zoomFactor / 0.001) / Math.log(0.15 / 0.001);
    // Adaptive photos: 80px (zoomed out) to 200px (zoomed in) - a little bigger
    const baseSize = 80 + (1 - normalizedZoom) * 120;
    const densityFactor = Math.max(0.85, 1 - (nearbyCount * 0.02));
    const finalSize = Math.max(50, Math.min(220, baseSize * densityFactor));
    return Math.round(finalSize);
  };

  // Stacking: detect if photos are overlapping in pixels on screen
  // Use pixel-based overlap detection instead of degrees threshold
  const photoGroups = useMemo(() => {
    if (groupPhotos.length === 0) return [];
    
    const groups = new Map<string, Photo[]>();
    
    // Calculate the marker size in pixels
    const estimatedSize = calculateMarkerSize(region.latitudeDelta, 0, 1);
    
    // Calculate pixels per degree for both lat and lng
    const screenWidthDegrees = region.longitudeDelta;
    const screenHeightDegrees = region.latitudeDelta;
    const pixelsPerDegreeLng = width / screenWidthDegrees;
    const pixelsPerDegreeLat = height / screenHeightDegrees;
    
    // Photos should stack if they would overlap in pixels on screen
    // Use a fraction of the marker size to detect overlap (e.g., 80% overlap threshold)
    const overlapThresholdPixels = estimatedSize * 0.8;
    
    // Group photos that would visually overlap in pixels
    groupPhotos.forEach(photo => {
      let bestGroup: [string, Photo[]] | null = null;
      let minDistancePixels = Infinity;
      
      // Find the closest existing group within pixel overlap threshold
      for (const [key, group] of groups.entries()) {
        const [lat, lng] = key.split(',').map(Number);
        
        // Calculate distance in degrees
        const latDiff = photo.lat - lat;
        const lngDiff = photo.lng - lng;
        
        // Convert to pixels on screen
        const latDiffPixels = Math.abs(latDiff * pixelsPerDegreeLat);
        const lngDiffPixels = Math.abs(lngDiff * pixelsPerDegreeLng);
        
        // Calculate pixel distance (Euclidean distance in pixel space)
        const distancePixels = Math.sqrt(
          Math.pow(latDiffPixels, 2) + Math.pow(lngDiffPixels, 2)
        );
        
        // If photos would overlap in pixels, add to this group
        if (distancePixels < overlapThresholdPixels && distancePixels < minDistancePixels) {
          minDistancePixels = distancePixels;
          bestGroup = [key, group];
        }
      }
      
      if (bestGroup) {
        // Add photo to existing stack - only one photo will be shown on top
        bestGroup[1].push(photo);
      } else {
        // Create new group
        groups.set(`${photo.lat},${photo.lng}`, [photo]);
      }
    });
    
    // Calculate sizes for each group
    const groupArray = Array.from(groups.entries());
    
    return groupArray.map(([key, groupPhotos]) => {
      const [lat, lng] = key.split(',').map(Number);
      
      // Count nearby groups for slight size adjustment using pixel distance
      const nearbyCount = groupArray.filter(([otherKey]) => {
        if (otherKey === key) return false;
        const [otherLat, otherLng] = otherKey.split(',').map(Number);
        const latDiffPixels = Math.abs((lat - otherLat) * pixelsPerDegreeLat);
        const lngDiffPixels = Math.abs((lng - otherLng) * pixelsPerDegreeLng);
        const distancePixels = Math.sqrt(
          Math.pow(latDiffPixels, 2) + Math.pow(lngDiffPixels, 2)
        );
        return distancePixels < overlapThresholdPixels * 2;
      }).length;
      
      // Calculate adaptive size based on zoom
      // When stacked, show only the top photo - no special size for stacks
      const size = calculateMarkerSize(region.latitudeDelta, nearbyCount, 1);
      
      return {
        key,
        photos: groupPhotos,
        lat: groupPhotos[0].lat,
        lng: groupPhotos[0].lng,
        size,
      };
    });
  }, [groupPhotos, region.latitudeDelta, region.longitudeDelta, width, height]);

  const handlePhotoPress = (photo: Photo) => {
    // Find the group this photo belongs to
    const group = photoGroups.find(g => g.photos.some(p => p.id === photo.id));
    if (group) {
      if (group.photos.length > 1) {
        // If stacked, open the stack modal
        setSelectedStack(group.photos);
      } else if (props.onPhotoSelect) {
        props.onPhotoSelect(group.photos[0]);
      } else {
        (navigation as any).navigate('PhotoDetails', { photo: group.photos[0] });
      }
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={region}
        region={region}
        onRegionChangeComplete={setRegion}
        showsUserLocation={false}
        showsMyLocationButton={false}
        showsCompass={false}
        toolbarEnabled={false}
      >
        {photoGroups.map((group) => (
          <MapMarker
            key={group.key}
            photo={group.photos[0]}
            photos={group.photos.length > 1 ? group.photos : undefined}
            onPress={handlePhotoPress}
            onProfileClick={props.onProfileClick}
            size={group.size}
          />
        ))}
      </MapView>

      <Pressable onPress={handleBack} style={[styles.backButton, { top: insets.top + 16 }]}>
        <Ionicons name="arrow-back" size={24} color="#111827" />
      </Pressable>

      <View style={[styles.header, { top: insets.top + 16 }]}>
        <Text style={styles.title}>{groupName}</Text>
        <Text style={styles.subtitle}>{groupPhotos.length} photos</Text>
      </View>

      {/* Camera Button */}
      <Pressable
        onPress={() => setShowCameraOptions(true)}
        style={[styles.cameraButton, { bottom: insets.bottom + 80 }]}
      >
        <Ionicons name="camera" size={24} color="white" />
      </Pressable>

      {/* Photo Stack Modal */}
      {selectedStack && (
        <PhotoStackModal
          photos={selectedStack}
          onClose={() => setSelectedStack(null)}
          onPhotoSelect={(photo) => {
            setSelectedStack(null);
            if (props.onPhotoSelect) {
              props.onPhotoSelect(photo);
            } else {
              (navigation as any).navigate('PhotoDetails', { photo });
            }
          }}
        />
      )}

      {/* Camera Options Modal */}
      <CameraOptionsModal
        visible={showCameraOptions}
        onTakePhoto={() => {
          setShowCameraOptions(false);
          // Navigate to capture screen
          (navigation as any).navigate('Capture');
        }}
        onUploadPhoto={() => {
          setShowCameraOptions(false);
          setShowUploadModal(true);
        }}
        onClose={() => setShowCameraOptions(false)}
      />

      {/* Photo Upload Modal */}
      <PhotoUploadModal
        visible={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onPhotosUploaded={(photos: UploadedPhoto[]) => {
          setShowUploadModal(false);
          // Handle uploaded photos - in a real app, these would be added to the group
          console.log('Photos uploaded to group:', photos);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  header: {
    position: 'absolute',
    top: 16,
    left: 64,
    right: 16,
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  cameraButton: {
    position: 'absolute',
    right: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#06b6d4',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
});
