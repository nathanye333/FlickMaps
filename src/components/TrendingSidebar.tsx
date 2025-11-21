import { useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Photo } from '../App';

interface TrendingSidebarProps {
  photos: Photo[];
  onPhotoClick: (photo: Photo) => void;
  isMapExpanded: boolean;
  isVisible: boolean;
  onVisibilityChange: (visible: boolean) => void;
}

const { height } = Dimensions.get('window');

export function TrendingSidebar({ photos, onPhotoClick, isMapExpanded, isVisible, onVisibilityChange }: TrendingSidebarProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Filter photos within a certain radius (mock logic - in reality would use geolocation)
  const nearbyPhotos = photos.slice(0, 8);

  // Don't render if map is expanded
  if (isMapExpanded) return null;

  return (
    <>
      {/* Backdrop to close sidebar - only when visible */}
      {isVisible && (
        <Pressable
          style={styles.backdrop}
          onPress={() => onVisibilityChange(false)}
        />
      )}
      
      {/* Right peek tab - only when not visible */}
      {!isVisible && (
        <View style={styles.peekTab}>
          <Ionicons name="chevron-back" size={16} color="#6b7280" />
        </View>
      )}
      
      {/* Sidebar - always rendered, visibility controlled by styles */}
      <View 
        style={[
          styles.sidebar,
          isExpanded ? styles.sidebarExpanded : styles.sidebarCollapsed,
          isVisible ? styles.sidebarVisible : styles.sidebarHidden,
        ]}
      >
        <View style={styles.sidebarContent}>
          {/* Toggle Button */}
          <Pressable
            style={styles.toggleButton}
            onPress={() => setIsExpanded(!isExpanded)}
          >
            <Ionicons 
              name={isExpanded ? "chevron-forward" : "chevron-back"} 
              size={16} 
              color="#6b7280" 
            />
          </Pressable>

          {/* Content */}
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {isExpanded ? (
              <View style={styles.expandedContent}>
                <View style={styles.header}>
                  <Ionicons name="trending-up" size={20} color="#06b6d4" />
                  <Text style={styles.title}>Trending Near You</Text>
                </View>
                
                <View style={styles.photosList}>
                  {nearbyPhotos.length > 0 ? (
                    nearbyPhotos.map((photo) => (
                      <Pressable
                        key={photo.id}
                        onPress={() => onPhotoClick(photo)}
                        style={styles.photoItem}
                      >
                        <View style={styles.photoImageContainer}>
                          <Image
                            source={{ uri: photo.imageUrl }}
                            style={styles.photoImage}
                            contentFit="cover"
                          />
                        </View>
                        <View style={styles.photoInfo}>
                          <Ionicons name="location" size={12} color="#06b6d4" />
                          <View style={styles.photoInfoText}>
                            <Text style={styles.photoLocation} numberOfLines={1}>
                              {photo.location}
                            </Text>
                            <Text style={styles.photoDate}>
                              {new Date(photo.timestamp).toLocaleDateString()}
                            </Text>
                          </View>
                        </View>
                      </Pressable>
                    ))
                  ) : (
                    <View style={styles.emptyState}>
                      <Text style={styles.emptyStateText}>No trending photos nearby</Text>
                    </View>
                  )}
                </View>
              </View>
            ) : (
              <View style={styles.collapsedContent}>
                <Pressable
                  style={styles.trendingButton}
                  onPress={() => setIsExpanded(true)}
                >
                  <Ionicons name="trending-up" size={16} color="white" />
                </Pressable>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    zIndex: 20,
  },
  triggerZone: {
    position: 'absolute',
    right: 0,
    top: height * 0.2,
    bottom: 0,
    width: 64,
    zIndex: 20,
  },
  peekTab: {
    position: 'absolute',
    right: 0,
    top: '50%',
    transform: [{ translateY: -32 }],
    width: 32,
    height: 64,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    zIndex: 20,
  },
  sidebar: {
    position: 'absolute',
    right: 0,
    top: '50%',
    transform: [{ translateY: -210 }],
    height: 420,
    zIndex: 30,
  },
  sidebarCollapsed: {
    width: 48,
  },
  sidebarExpanded: {
    width: 288,
  },
  sidebarVisible: {
    opacity: 1,
    transform: [{ translateX: 0 }, { translateY: -210 }],
  },
  sidebarHidden: {
    opacity: 0,
    transform: [{ translateX: 288 }, { translateY: -210 }],
  },
  sidebarContent: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  toggleButton: {
    position: 'absolute',
    left: -12,
    top: '50%',
    transform: [{ translateY: -24 }],
    width: 24,
    height: 48,
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderBottomLeftRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    zIndex: 10,
  },
  content: {
    flex: 1,
  },
  expandedContent: {
    padding: 16,
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
  },
  photosList: {
    gap: 12,
  },
  photoItem: {
    gap: 8,
  },
  photoImageContainer: {
    aspectRatio: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  photoImage: {
    width: '100%',
    height: '100%',
  },
  photoInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    paddingHorizontal: 4,
  },
  photoInfoText: {
    flex: 1,
  },
  photoLocation: {
    fontSize: 12,
    color: '#6b7280',
  },
  photoDate: {
    fontSize: 10,
    color: '#9ca3af',
    marginTop: 2,
  },
  collapsedContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trendingButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#06b6d4',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  emptyState: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    color: '#9ca3af',
  },
});
