import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import MapViewComponent from 'react-native-maps';
import { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { Photo } from '../App';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Image } from 'expo-image';

interface GroupMapViewProps {
  groupId?: string;
  groupName?: string;
  onBack?: () => void;
  onPhotoSelect?: (photo: Photo) => void;
  onProfileClick?: (username: string) => void;
  navigation?: any;
  route?: any;
}

const mockGroupPhotos: Photo[] = [
  {
    id: 'group-1',
    imageUrl: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400',
    lat: 48.8566,
    lng: 2.3522,
    location: 'Paris, France',
    caption: 'Eiffel Tower at sunset',
    author: 'Sarah Chen',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    timestamp: new Date('2025-11-15'),
    likes: 24,
    visibility: 'friends',
    category: 'Travel'
  },
];

export function GroupMapView(props: GroupMapViewProps) {
  const navigation = useNavigation();
  const route = useRoute();
  const groupId = (route.params as any)?.groupId || props.groupId || '';
  const groupName = (route.params as any)?.groupName || props.groupName || 'Group';

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

  return (
    <View style={styles.container}>
      <MapViewComponent
        style={styles.map}
        initialRegion={{
          latitude: 48.8566,
          longitude: 2.3522,
          latitudeDelta: 0.5,
          longitudeDelta: 0.5,
        }}
      >
        {mockGroupPhotos.map((photo) => (
          <Marker
            key={photo.id}
            coordinate={{ latitude: photo.lat, longitude: photo.lng }}
            onPress={() => handlePhotoPress(photo)}
          >
            <View style={styles.markerContainer}>
              <Image source={{ uri: photo.imageUrl }} style={styles.markerImage} contentFit="cover" />
            </View>
          </Marker>
        ))}
      </MapViewComponent>

      <Pressable onPress={handleBack} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#111827" />
      </Pressable>

      <View style={styles.header}>
        <Text style={styles.title}>{groupName}</Text>
        <Text style={styles.subtitle}>{mockGroupPhotos.length} photos</Text>
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
  markerContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: 'white',
  },
  markerImage: {
    width: '100%',
    height: '100%',
  },
});
