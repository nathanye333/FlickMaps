import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Image } from 'expo-image';
import { Marker } from 'react-native-maps';
import { Photo } from '../App';

interface MapMarkerProps {
  photo: Photo;
  photos?: Photo[];
  onPress: (photo: Photo) => void;
  isSelected?: boolean;
  onProfileClick?: (username: string) => void;
  size?: number; // Adaptive size based on zoom and density
}

// Custom marker component that looks like a post - rounded square with profile picture on top left
const CustomMarkerContent = ({ photo, photos, isSelected, onProfileClick, size }: { photo: Photo; photos?: Photo[]; isSelected?: boolean; onProfileClick?: (username: string) => void; size?: number }) => {
  // Get unique authors for avatar display (up to 3)
  const allPhotos = photos || [photo];
  const photoCount = allPhotos.length;
  const isStack = photoCount > 1;
  
  // Matching Leaflet implementation exactly: Base 100px, Stack 110px (1.1x), Selected 130px (1.3x)
  // The size prop from MapView is the base size (adaptive based on zoom, 70-100px range)
  // Apply Leaflet's exact logic: selection takes priority, then stack, then base
  const baseSize = size || 100;
  
  // Leaflet's exact conditional logic:
  // if selected -> 130px (regardless of stack)
  // else if stack -> 110px (baseSize * 1.1, but cap at reasonable max)
  // else -> baseSize
  const markerSize = isSelected 
    ? Math.min(baseSize * 1.3, 130) 
    : isStack 
      ? Math.min(baseSize * 1.1, 110)
      : baseSize;
  
  const uniqueAuthors = Array.from(new Map(allPhotos.map(p => [p.author, p])).values());
  const displayAuthors = uniqueAuthors.slice(0, 3);
  const remainingCount = Math.max(0, uniqueAuthors.length - 3);

  return (
    <View style={[styles.markerContainer, { width: markerSize, height: markerSize }]}>
      {/* Main photo image - rounded square */}
      <Image
        source={{ uri: photo.imageUrl }}
        style={styles.markerImage}
        contentFit="cover"
      />
      
      {/* Profile Picture in Top-Left Corner - matching post styling exactly like PhotoPin */}
      <View style={styles.avatarsContainer}>
        {displayAuthors.map((authorPhoto, index) => (
          <View
            key={index}
            style={[
              styles.avatarContainer,
              {
                width: Math.max(24, markerSize * 0.22),
                height: Math.max(24, markerSize * 0.22),
                marginLeft: index > 0 ? Math.max(2, markerSize * 0.02) : 0,
              }
            ]}
          >
            <Image
              source={{ uri: authorPhoto.authorAvatar }}
              style={styles.avatar}
              contentFit="cover"
            />
          </View>
        ))}
        
        {/* Remaining authors indicator */}
        {remainingCount > 0 && (
          <View
            style={[
              styles.avatarContainer,
              styles.avatarRemaining,
              {
                width: Math.max(24, markerSize * 0.22),
                height: Math.max(24, markerSize * 0.22),
                marginLeft: Math.max(2, markerSize * 0.02),
              }
            ]}
          >
            <Text style={[styles.avatarRemainingText, { fontSize: Math.max(8, markerSize * 0.08) }]}>
              +{remainingCount}
            </Text>
          </View>
        )}
      </View>
      
      {/* "and x others" text for stacks with more than 3 authors */}
      {isStack && remainingCount > 0 && (
        <View style={[styles.othersTextContainer, { 
          top: Math.max(28, markerSize * 0.35),
          left: 2,
        }]}>
          <Text style={[styles.othersText, { fontSize: Math.max(7, markerSize * 0.09) }]}>
            and {remainingCount} other{remainingCount !== 1 ? 's' : ''}
          </Text>
        </View>
      )}
      
      {/* Photo count badge - top right */}
      {isStack && (
        <View style={styles.photoCountBadge}>
          <Text style={styles.photoCountText}>{photoCount}</Text>
        </View>
      )}
    </View>
  );
};

export function MapMarker({ photo, photos, onPress, isSelected, onProfileClick, size }: MapMarkerProps) {
  const allPhotos = photos || [photo];
  const photoCount = allPhotos.length;
  
  return (
    <Marker
      coordinate={{
        latitude: photo.lat,
        longitude: photo.lng,
      }}
      onPress={() => onPress(photo)}
      anchor={{ x: 0.5, y: 1 }}
      tracksViewChanges={false}
      zIndex={isSelected ? 1000 : photoCount > 1 ? 100 : 10}
    >
      <CustomMarkerContent 
        photo={photo} 
        photos={photos} 
        isSelected={isSelected}
        onProfileClick={onProfileClick}
        size={size}
      />
    </Marker>
  );
}

const styles = StyleSheet.create({
  markerContainer: {
    borderRadius: 12, // Curved square - matching post styling
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    backgroundColor: '#f3f4f6',
  },
  markerImage: {
    width: '100%',
    height: '100%',
  },
  avatarsContainer: {
    position: 'absolute',
    top: 2, // Closer to top left corner
    left: 2, // Closer to top left corner
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
  },
  avatarContainer: {
    borderRadius: 999, // Circular
    borderWidth: 2,
    borderColor: 'white',
    overflow: 'hidden',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  avatarRemaining: {
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarRemainingText: {
    color: '#374151',
    fontWeight: '600',
  },
  photoCountBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#06b6d4',
    borderRadius: 999,
    borderWidth: 2,
    borderColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 24,
    height: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  photoCountText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  othersTextContainer: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 3,
    maxWidth: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  othersText: {
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
  },
});

