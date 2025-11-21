import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import MapViewComponent from 'react-native-maps';
import { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { getUserPhotos } from '../data/mockData';
import { Photo } from '../App';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Image } from 'expo-image';

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

  const region = userPhotos.length > 0 ? {
    latitude: userPhotos[0].lat,
    longitude: userPhotos[0].lng,
    latitudeDelta: 1,
    longitudeDelta: 1,
  } : {
    latitude: 37.7749,
    longitude: -122.4194,
    latitudeDelta: 0.5,
    longitudeDelta: 0.5,
  };

  return (
    <View style={styles.container}>
      <MapViewComponent style={styles.map} initialRegion={region}>
        {userPhotos.map((photo) => (
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
