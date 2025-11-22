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

// Custom marker component - shows photo with profile pictures, badges, and "+ x others" like original web app
// When stacked (overlapping), shows the top photo with UI elements - click to see all photos in stack
const CustomMarkerContent = ({ photo, photos, isSelected, onProfileClick, size }: { photo: Photo; photos?: Photo[]; isSelected?: boolean; onProfileClick?: (username: string) => void; size?: number }) => {
  const allPhotos = photos || [photo];
  const photoCount = allPhotos.length;
  const isStack = photoCount > 1;
  
  // Adaptive sizing based on zoom
  // The size prop from MapView is the base size (adaptive based on zoom, 80-200px range)
  // Matching Leaflet implementation: Base size, Stack 1.1x, Selected 1.3x
  const baseSize = size || 140;
  
  // Leaflet's exact conditional logic for marker sizing:
  // if selected -> 1.3x up to max
  // else if stack -> 1.1x
  // else -> baseSize
  const markerSize = isSelected 
    ? Math.min(baseSize * 1.3, 260) 
    : isStack 
      ? Math.min(baseSize * 1.1, 240)
      : baseSize;

  // Get unique authors for avatar display (up to 3) - matching Leaflet implementation exactly
  const uniqueAuthors = Array.from(
    new Map(
      allPhotos
        .filter(p => p && p.author && p.authorAvatar)
        .map(p => [p.author, p])
    ).values()
  );
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
      
      {/* Profile Picture in Top-Left Corner - matching Leaflet implementation exactly */}
      <View style={styles.avatarsContainer}>
        {displayAuthors.map((authorPhoto, index) => {
          // Match Leaflet exactly: avatarSize = Math.max(20, markerSize * 0.22), avatarMargin = Math.max(1, markerSize * 0.015)
          const avatarSize = Math.max(20, markerSize * 0.22);
          const avatarMargin = Math.max(1, markerSize * 0.015);
          const leftPos = 2 + (index * (avatarSize + avatarMargin));
          
          return (
            <View
              key={index}
              style={[
                styles.avatarContainer,
                {
                  width: avatarSize,
                  height: avatarSize,
                  left: leftPos,
                  top: 2,
                }
              ]}
            >
              <Image
                source={{ uri: authorPhoto.authorAvatar }}
                style={styles.avatar}
                contentFit="cover"
              />
            </View>
          );
        })}
        
        {/* Remaining authors indicator - "+ x" - matching Leaflet exactly */}
        {remainingCount > 0 && (() => {
          const avatarSize = Math.max(20, markerSize * 0.22);
          const avatarMargin = Math.max(1, markerSize * 0.015);
          const leftPos = 2 + (displayAuthors.length * (avatarSize + avatarMargin));
          
          return (
            <View
              style={[
                styles.avatarContainer,
                styles.avatarRemaining,
                {
                  width: avatarSize,
                  height: avatarSize,
                  left: leftPos,
                  top: 2,
                }
              ]}
            >
              <Text style={[styles.avatarRemainingText, { fontSize: Math.max(8, markerSize * 0.08) }]}>
                +{remainingCount}
              </Text>
            </View>
          );
        })()}
      </View>
      
      {/* "and x others" text for stacks with more than 3 authors - matching Leaflet exactly */}
      {isStack && remainingCount > 0 && (
        <View style={[styles.othersTextContainer, { 
          top: Math.max(26, markerSize * 0.32),
          left: 2,
        }]}>
          <Text style={[styles.othersText, { fontSize: Math.max(7, markerSize * 0.09) }]}>
            and {remainingCount} other{remainingCount !== 1 ? 's' : ''}
          </Text>
        </View>
      )}
      
      {/* Photo count badge - bottom right corner */}
      {isStack && (
        <View style={[styles.photoCountBadge, {
          minWidth: Math.max(22, markerSize * 0.22),
          minHeight: Math.max(22, markerSize * 0.22),
          bottom: -8,
          right: -8,
        }]}>
          <Text style={[styles.photoCountText, { fontSize: Math.max(10, markerSize * 0.1) }]}>
            {photoCount}
          </Text>
        </View>
      )}
      
      {/* Triangle/arrow pointing down to exact location - stays anchored at coordinate */}
      {(() => {
        const triangleSize = Math.max(6, markerSize * 0.06);
        const triangleHeight = Math.max(8, markerSize * 0.08);
        // The Marker has anchor={{ x: 0.5, y: 1 }} which anchors the coordinate at bottom center of marker
        // The triangle's tip must point to this exact coordinate and stay fixed when map moves/zooms
        // The triangle is created with borders (width: 0, height: 0) positioned at left: '50%'
        // With width: 0, the element is centered at 50%, and borders extend equally left/right
        // This naturally centers the triangle tip on the anchor point (bottom center of marker)
        // The triangle stays anchored at the exact location coordinate regardless of map movement
        return (
          <View style={[styles.locationTriangle, {
            borderTopWidth: triangleHeight,
            borderLeftWidth: triangleSize,
            borderRightWidth: triangleSize,
            left: '50%',
            bottom: -triangleHeight, // Extends below marker, tip points to exact location coordinate
          }]} />
        );
      })()}
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
    overflow: 'visible', // Allow badge to extend beyond container
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
    borderRadius: 10, // Match container border radius minus border width
    overflow: 'hidden', // Ensure image is clipped to rounded corners
  },
  avatarsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 10,
  },
  avatarContainer: {
    position: 'absolute',
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
    bottom: -8, // Bottom right corner
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
    minHeight: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 20, // Ensure it's above other elements
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
  locationTriangle: {
    position: 'absolute',
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: 'white', // Match the photo border color
    zIndex: 5,
  },
});

