import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import Svg, { Line } from 'react-native-svg';
import { Photo } from '../App';

interface PhotoPinProps {
  photos: Photo[];
  onClick: (photo: Photo) => void;
  photoSize: number;
  position: { x: number; y: number };
  displayPosition?: { x: number; y: number };
  showPin: boolean;
  priorityPhotoId?: string | null;
  onProfileClick?: (username: string) => void;
}

export function PhotoPin({ photos, onClick, photoSize, position, displayPosition, showPin, priorityPhotoId, onProfileClick }: PhotoPinProps) {
  // Reorder photos: priority photo first, then by likes
  let reorderedPhotos = [...photos];
  
  if (priorityPhotoId) {
    const priorityIndex = reorderedPhotos.findIndex(p => p.id === priorityPhotoId);
    if (priorityIndex !== -1) {
      const priorityPhoto = reorderedPhotos.splice(priorityIndex, 1)[0];
      reorderedPhotos = [priorityPhoto, ...reorderedPhotos];
    }
  }
  
  const sortedPhotos = reorderedPhotos.sort((a, b) => b.likes - a.likes);
  const photo = sortedPhotos[0];
  const count = sortedPhotos.length;
  
  // Get unique authors for avatar display (up to 3)
  const uniqueAuthors = Array.from(new Map(sortedPhotos.map(p => [p.author, p])).values());
  const displayAuthors = uniqueAuthors.slice(0, 3);
  const remainingCount = uniqueAuthors.length - 3;
  
  const finalPosition = displayPosition || position;

  const handleAvatarClick = (author: string) => {
    if (onProfileClick) {
      onProfileClick(author);
    }
  };

  return (
    <>
      {/* Connection line from actual location to photo */}
      {showPin && displayPosition && (
        <Svg
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        >
          <Line
            x1={position.x}
            y1={position.y}
            x2={displayPosition.x}
            y2={displayPosition.y}
            stroke="rgba(6, 182, 212, 0.4)"
            strokeWidth="2"
            strokeDasharray="4,4"
          />
        </Svg>
      )}

      {/* Photo at display position */}
      <Pressable
        onPress={() => onClick(photo)}
        style={[
          styles.photoContainer,
          {
            left: finalPosition.x,
            top: finalPosition.y,
            transform: [
              { translateX: -photoSize / 2 },
              { translateY: showPin ? -(photoSize + 8) : -photoSize / 2 }
            ],
          }
        ]}
      >
        <View style={[styles.photoWrapper, { width: photoSize, height: photoSize }]}>
          <Image
            source={{ uri: photo.imageUrl }}
            style={styles.photoImage}
            contentFit="cover"
          />
          
          {/* Author Avatars - top left corner */}
          <View style={styles.avatarsContainer}>
            {displayAuthors.map((authorPhoto, index) => (
              <Pressable
                key={index}
                onPress={() => handleAvatarClick(authorPhoto.author)}
                style={[
                  styles.avatarContainer,
                  {
                    width: Math.max(24, photoSize * 0.22),
                    height: Math.max(24, photoSize * 0.22),
                    marginLeft: index > 0 ? Math.max(2, photoSize * 0.02) : 0,
                  }
                ]}
              >
                <Image
                  source={{ uri: authorPhoto.authorAvatar }}
                  style={styles.avatar}
                  contentFit="cover"
                />
              </Pressable>
            ))}
            
            {/* Remaining authors indicator */}
            {remainingCount > 0 && (
              <View
                style={[
                  styles.avatarContainer,
                  styles.avatarRemaining,
                  {
                    width: Math.max(24, photoSize * 0.22),
                    height: Math.max(24, photoSize * 0.22),
                    marginLeft: Math.max(2, photoSize * 0.02),
                  }
                ]}
              >
                <Text style={[styles.avatarRemainingText, { fontSize: Math.max(8, photoSize * 0.08) }]}>
                  +{remainingCount}
                </Text>
              </View>
            )}
          </View>
        </View>
        
        {/* Location pin appendage at bottom center */}
        {showPin && (
          <View style={styles.pinContainer}>
            <View style={styles.pinStem} />
            <View style={styles.pinPoint} />
          </View>
        )}
        
        {/* Stack Count Indicator */}
        {count > 1 && (
          <View
            style={[
              styles.stackBadge,
              {
                minWidth: Math.max(22, photoSize * 0.2),
                minHeight: Math.max(22, photoSize * 0.2),
                fontSize: Math.max(10, photoSize * 0.1),
              }
            ]}
          >
            <Text style={[styles.stackBadgeText, { fontSize: Math.max(10, photoSize * 0.1) }]}>
              {count}
            </Text>
          </View>
        )}
      </Pressable>
    </>
  );
}

const styles = StyleSheet.create({
  photoContainer: {
    position: 'absolute',
    zIndex: 10,
  },
  photoWrapper: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  photoImage: {
    width: '100%',
    height: '100%',
  },
  avatarsContainer: {
    position: 'absolute',
    top: 4,
    left: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    borderRadius: 999,
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
  pinContainer: {
    position: 'absolute',
    left: '50%',
    top: '100%',
    transform: [{ translateX: -1 }],
    alignItems: 'center',
  },
  pinStem: {
    width: 2,
    height: 8,
    backgroundColor: '#06b6d4',
  },
  pinPoint: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#06b6d4',
    borderWidth: 1,
    borderColor: 'white',
    marginTop: -2,
  },
  stackBadge: {
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  stackBadgeText: {
    color: 'white',
    fontWeight: '600',
  },
});
