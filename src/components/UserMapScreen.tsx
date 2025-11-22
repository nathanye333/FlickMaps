import React, { useMemo, useState } from 'react';
import { View, Text, Pressable, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getUserPhotos } from '../data/mockData';
import { Photo } from '../App';
import { useNavigation, useRoute } from '@react-navigation/native';
import MapView from 'react-native-maps';
import { MapMarker } from './MapMarker';

const { width } = Dimensions.get('window');

interface UserMapScreenProps {
  username?: string;
  onBack?: () => void;
  onPhotoSelect?: (photo: Photo) => void;
  onProfileClick?: (username: string) => void;
  navigation?: any;
  route?: any;
}

export function UserMapScreen(props: UserMapScreenProps) {
  const navigation = useNavigation();
  const route = useRoute();
  const username = (route.params as any)?.username || props.username || 'You';
  
  const userPhotos = getUserPhotos(username);

  const handleBack = () => {
    if (props.onBack) {
      props.onBack();
    } else {
      navigation.goBack();
    }
  };

  const handlePhotoPress = (photo: Photo) => {
    if (props.onPhotoSelect) {
      props.onPhotoSelect(photo);
    } else {
      navigation.navigate('PhotoDetails' as never, { photo } as never);
    }
  };


  const [region, setRegion] = useState(() => {
    if (userPhotos.length > 0) {
      return {
        latitude: userPhotos[0].lat,
        longitude: userPhotos[0].lng,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
    }
    return {
      latitude: 37.7749,
      longitude: -122.4194,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    };
  });

  // Calculate adaptive marker base size based on zoom level (same logic as MapView)
  // Referencing Leaflet implementation: Base size 100px, Stack 110px (1.1x), Selected 130px (1.3x)
  // Note: This returns the BASE size only. Stack and selection factors are applied in MapMarker to match Leaflet's exact logic.
  const calculateMarkerSize = (latitudeDelta: number, nearbyCount: number = 0): number => {
    const zoomFactor = Math.max(0.001, Math.min(0.15, latitudeDelta));
    const normalizedZoom = Math.log(zoomFactor / 0.001) / Math.log(0.15 / 0.001);
    // Start with 100px base (matching Leaflet), adapt down when zoomed out
    const baseSize = 70 + (1 - normalizedZoom) * 30; // Range 70-100px (matching Leaflet's 100px base when zoomed in)
    const densityFactor = Math.max(0.75, 1 - (nearbyCount * 0.03));
    // Return base size only - stack and selection factors applied in MapMarker
    const finalSize = Math.max(50, Math.min(100, baseSize * densityFactor));
    return Math.round(finalSize);
  };

  // Adaptive clustering
  const photoGroups = useMemo(() => {
    if (userPhotos.length === 0) return [];
    
    const groups = new Map<string, Photo[]>();
    const estimatedBaseSize = calculateMarkerSize(region.latitudeDelta, 0);
    const estimatedMarkerSize = Math.min(estimatedBaseSize * 1.3, 130); // Max possible size
    const screenWidthDegrees = region.longitudeDelta;
    const pixelsPerDegree = width / screenWidthDegrees;
    const markerSizeInDegrees = estimatedMarkerSize / pixelsPerDegree;
    const zoomFactor = Math.max(0.001, Math.min(0.15, region.latitudeDelta));
    const normalizedZoom = Math.log(zoomFactor / 0.001) / Math.log(0.15 / 0.001);
    const baseThreshold = 0.0005;
    const zoomAdjustedThreshold = baseThreshold * (1 + normalizedZoom * 3);
    const sizeBasedThreshold = markerSizeInDegrees * 1.5;
    const finalThreshold = Math.max(0.0002, Math.min(0.005, Math.max(zoomAdjustedThreshold, sizeBasedThreshold)));
    
    userPhotos.forEach(photo => {
      let bestGroup: [string, Photo[]] | null = null;
      let minDistance = Infinity;
      
      for (const [key, group] of groups.entries()) {
        const [lat, lng] = key.split(',').map(Number);
        const distance = Math.sqrt(Math.pow(photo.lat - lat, 2) + Math.pow(photo.lng - lng, 2));
        if (distance < finalThreshold && distance < minDistance) {
          minDistance = distance;
          bestGroup = [key, group];
        }
      }
      
      if (bestGroup) {
        bestGroup[1].push(photo);
      } else {
        groups.set(`${photo.lat},${photo.lng}`, [photo]);
      }
    });
    
    const groupArray = Array.from(groups.entries());
    return groupArray.map(([key, groupPhotos]) => {
      const [lat, lng] = key.split(',').map(Number);
      const nearbyCount = groupArray.filter(([otherKey]) => {
        if (otherKey === key) return false;
        const [otherLat, otherLng] = otherKey.split(',').map(Number);
        const distance = Math.sqrt(Math.pow(lat - otherLat, 2) + Math.pow(lng - otherLng, 2));
        return distance < finalThreshold * 3;
      }).length;
      
      // Pass base size only - MapMarker will apply stack and selection factors like Leaflet
      const size = calculateMarkerSize(region.latitudeDelta, nearbyCount);
      
      return {
        key,
        photos: groupPhotos,
        lat: groupPhotos[0].lat,
        lng: groupPhotos[0].lng,
        size,
      };
    });
  }, [userPhotos, region.latitudeDelta, region.longitudeDelta]);

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

      <Pressable onPress={handleBack} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#111827" />
      </Pressable>

      <View style={styles.header}>
        <Text style={styles.title}>{username}'s Map</Text>
        <Text style={styles.subtitle}>{userPhotos.length} photos</Text>
      </View>
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
});
