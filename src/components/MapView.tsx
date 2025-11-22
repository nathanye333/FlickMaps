import React, { useState, useMemo, useRef, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, Modal, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Photo, MapTab } from '../App';
import { mockPersonalPhotos, mockFriendsPhotos, mockGlobalPhotos, getPersonalPhotosForTab } from '../data/mockData';
import { AppContext } from '../../App';
import { useNavigation } from '@react-navigation/native';
import { Image } from 'expo-image';
import { TimelineScrubber } from './TimelineScrubber';
import { CategorySidebar } from './CategorySidebar';
import { TrendingSidebar } from './TrendingSidebar';
import { PhotoStackModal } from './PhotoStackModal';
import { DailyChallengeModal } from './DailyChallengeModal';
import { PhotoUploadModal, UploadedPhoto } from './PhotoUploadModal';
import { PhotoPin } from './PhotoPin';
import MapViewComponent from 'react-native-maps';
import { MapMarker } from './MapMarker';

const { width, height } = Dimensions.get('window');

export type TimelineFilter = 'daily' | 'weekly' | 'monthly' | 'yearly';

interface MapViewProps {
  onPhotoSelect?: (photo: Photo) => void;
  showUploadModal?: boolean;
  onUploadModalClose?: () => void;
  selectedPhoto?: Photo | null;
  viewingUser?: string | null;
  onProfileClick?: (username: string) => void;
  activeMapTab?: MapTab;
  setActiveMapTab?: (tab: MapTab) => void;
  onGroupsClick?: () => void;
  navigation?: any;
  route?: any;
}

export function MapView(props: MapViewProps) {
  const navigation = useNavigation();
  const context = React.useContext(AppContext);
  const mapRef = useRef<MapViewComponent>(null);
  
  const activeMapTab = context?.activeMapTab || props.activeMapTab || 'personal';
  const setActiveMapTab = context?.setActiveMapTab || props.setActiveMapTab || (() => {});
  const selectedPhoto = context?.selectedPhoto || props.selectedPhoto;
  
  const [timelineFilter, setTimelineFilter] = useState<TimelineFilter>('weekly');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [timelineResetTrigger, setTimelineResetTrigger] = useState(0);
  const [region, setRegion] = useState({
    latitude: 37.7749,
    longitude: -122.4194,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [leftSidebarVisible, setLeftSidebarVisible] = useState(false);
  const [rightSidebarVisible, setRightSidebarVisible] = useState(false);
  const [selectedStack, setSelectedStack] = useState<Photo[] | null>(null);
  const [showDailyChallengeModal, setShowDailyChallengeModal] = useState(false);
  const [uploadedPhotos, setUploadedPhotos] = useState<Photo[]>([]);
  const [locationName, setLocationName] = useState('San Francisco, California, USA');
  const [isMapExpanded, setIsMapExpanded] = useState(false);

  const getPhotosForTab = (): Photo[] => {
    let photos: Photo[] = [];
    switch (activeMapTab) {
      case 'personal':
        photos = mockPersonalPhotos;
        break;
      case 'friends':
        photos = [...mockFriendsPhotos, ...getPersonalPhotosForTab('friends')];
        break;
      case 'global':
        photos = [...mockGlobalPhotos, ...getPersonalPhotosForTab('global')];
        break;
    }
    return filterPhotosByCategory(filterPhotosByTimeline(photos));
  };

  const filterPhotosByTimeline = (photos: Photo[]): Photo[] => {
    const filterDate = new Date(currentDate);
    const startDate = new Date(filterDate);
    const endDate = new Date(filterDate);
    
    switch (timelineFilter) {
      case 'daily':
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
        break;
      case 'weekly':
        const dayOfWeek = filterDate.getDay();
        startDate.setDate(filterDate.getDate() - dayOfWeek);
        startDate.setHours(0, 0, 0, 0);
        endDate.setDate(startDate.getDate() + 6);
        endDate.setHours(23, 59, 59, 999);
        break;
      case 'monthly':
        startDate.setDate(1);
        startDate.setHours(0, 0, 0, 0);
        endDate.setMonth(filterDate.getMonth() + 1, 0);
        endDate.setHours(23, 59, 59, 999);
        break;
      case 'yearly':
        startDate.setMonth(0, 1);
        startDate.setHours(0, 0, 0, 0);
        endDate.setMonth(11, 31);
        endDate.setHours(23, 59, 59, 999);
        break;
    }
    
    return photos.filter(photo => {
      const photoDate = new Date(photo.timestamp);
      return photoDate >= startDate && photoDate <= endDate;
    });
  };

  const filterPhotosByCategory = (photos: Photo[]): Photo[] => {
    if (selectedCategory === 'All') {
      return photos;
    }
    return photos.filter(photo => 
      photo.category?.toLowerCase() === selectedCategory.toLowerCase()
    );
  };

  const photos = useMemo(() => getPhotosForTab(), [activeMapTab, timelineFilter, selectedCategory, currentDate]);
  const allPhotos = useMemo(() => {
    switch (activeMapTab) {
      case 'personal':
        return mockPersonalPhotos;
      case 'friends':
        return mockFriendsPhotos;
      case 'global':
        return mockGlobalPhotos;
      default:
        return [];
    }
  }, [activeMapTab]);

  // Calculate adaptive marker base size based on zoom level
  // Referencing Leaflet implementation: Base size 100px, Stack 110px (1.1x), Selected 130px (1.3x)
  // When zoomed in (small delta), markers are bigger. When zoomed out (large delta), markers are smaller.
  // Note: This returns the BASE size only. Stack and selection factors are applied in MapMarker to match Leaflet's exact logic.
  const calculateMarkerSize = (latitudeDelta: number, nearbyCount: number = 0): number => {
    // Base size calculation from zoom level
    // latitudeDelta ranges from ~0.001 (very zoomed in) to ~180 (world view)
    // Leaflet had fixed 100px base, but we adapt based on zoom for better UX
    // We want: zoomed in (0.001) -> large markers (100px base), zoomed out (0.1+) -> medium markers (70px base)
    const zoomFactor = Math.max(0.001, Math.min(0.15, latitudeDelta));
    const normalizedZoom = Math.log(zoomFactor / 0.001) / Math.log(0.15 / 0.001); // 0 to 1
    // Start with 100px base (matching Leaflet), adapt down when zoomed out
    const baseSize = 70 + (1 - normalizedZoom) * 30; // Range 70-100px (matching Leaflet's 100px base when zoomed in)
    
    // Adjust for photo density to prevent overlap
    // If there are many photos nearby, make them slightly smaller to prevent overlap
    const densityFactor = Math.max(0.75, 1 - (nearbyCount * 0.03));
    
    // Return base size only - stack and selection factors applied in MapMarker
    const finalSize = Math.max(50, Math.min(100, baseSize * densityFactor));
    return Math.round(finalSize);
  };

  // Adaptive clustering based on zoom level
  // When zoomed out, cluster more aggressively. When zoomed in, allow more separation.
  // Stacks should split when user zooms in enough to differentiate distance
  const photoGroups = useMemo(() => {
    if (photos.length === 0) return [];
    
    const groups = new Map<string, Photo[]>();
    
    // Dynamic threshold based on zoom level and estimated marker size
    // When zoomed in (small delta), use smaller threshold to allow separation
    // When zoomed out (large delta), use larger threshold to cluster more
    // Estimate max size (stack + selection could be up to 130px)
    const estimatedBaseSize = calculateMarkerSize(region.latitudeDelta, 0);
    const estimatedMarkerSize = Math.min(estimatedBaseSize * 1.3, 130); // Max possible size
    
    // Convert marker size in pixels to approximate lat/lng distance
    // Approximate: 1 degree latitude ≈ 111km, screen width varies
    // For a typical screen, we want markers to cluster if they'd overlap
    // Rough conversion: marker size in pixels / screen pixels per degree
    const screenWidthDegrees = region.longitudeDelta;
    const pixelsPerDegree = width / screenWidthDegrees;
    const markerSizeInDegrees = estimatedMarkerSize / pixelsPerDegree;
    
    // Threshold should be based on marker size to prevent overlap
    // Use a factor of the marker size, adjusted by zoom
    const zoomFactor = Math.max(0.001, Math.min(0.15, region.latitudeDelta));
    const normalizedZoom = Math.log(zoomFactor / 0.001) / Math.log(0.15 / 0.001);
    
    // When zoomed out (high normalizedZoom), cluster more (larger threshold)
    // When zoomed in (low normalizedZoom), cluster less (smaller threshold)
    const baseThreshold = 0.0005; // Base ~50m
    const zoomAdjustedThreshold = baseThreshold * (1 + normalizedZoom * 3); // 0.0005 to 0.002
    
    // Also consider marker size - if markers are big, need larger threshold
    const sizeBasedThreshold = markerSizeInDegrees * 1.5; // 1.5x marker size to prevent overlap
    
    const finalThreshold = Math.max(0.0002, Math.min(0.005, Math.max(zoomAdjustedThreshold, sizeBasedThreshold)));
    
    photos.forEach(photo => {
      let bestGroup: [string, Photo[]] | null = null;
      let minDistance = Infinity;
      
      // Find the closest existing group within threshold
      for (const [key, group] of groups.entries()) {
        const [lat, lng] = key.split(',').map(Number);
        const distance = Math.sqrt(
          Math.pow(photo.lat - lat, 2) + Math.pow(photo.lng - lng, 2)
        );
        
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
    
    // Calculate sizes for each group based on zoom and nearby density
    const groupArray = Array.from(groups.entries());
    
    return groupArray.map(([key, groupPhotos]) => {
      // Count how many other groups are nearby to adjust size and prevent overlap
      const [lat, lng] = key.split(',').map(Number);
      const nearbyCount = groupArray.filter(([otherKey, otherPhotos]) => {
        if (otherKey === key) return false;
        const [otherLat, otherLng] = otherKey.split(',').map(Number);
        const distance = Math.sqrt(
          Math.pow(lat - otherLat, 2) + Math.pow(lng - otherLng, 2)
        );
        // Check within 3x threshold for density calculation
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
  }, [photos, region.latitudeDelta, region.longitudeDelta, width]);

  useEffect(() => {
    if (selectedPhoto && mapRef.current) {
      const newRegion = {
        latitude: selectedPhoto.lat,
        longitude: selectedPhoto.lng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      setRegion(newRegion);
      // Set the appropriate tab based on photo visibility
      if (selectedPhoto.visibility === 'personal') {
        setActiveMapTab('personal');
      } else if (selectedPhoto.visibility === 'friends') {
        setActiveMapTab('friends');
      } else if (selectedPhoto.visibility === 'public') {
        setActiveMapTab('global');
      }
      // Center map on photo
      setTimeout(() => {
        mapRef.current?.animateToRegion(newRegion, 300);
      }, 100);
    }
  }, [selectedPhoto]);


  const handlePhotosUploaded = (uploaded: UploadedPhoto[]) => {
    // Convert uploaded photos to Photo format
    const newPhotos: Photo[] = uploaded.map((up, index) => ({
      id: `uploaded-${Date.now()}-${index}`,
      imageUrl: up.imageUrl,
      lat: up.lat,
      lng: up.lng,
      timestamp: up.timestamp,
      author: 'You',
      authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
      caption: up.fileName,
      likes: 0,
      location: `Uploaded photo`,
      category: 'uploaded',
      visibility: 'personal' as const,
    }));
    
    // Add to uploaded photos state
    setUploadedPhotos(prev => [...prev, ...newPhotos]);
  };

  const zoomToPhoto = (photo: Photo) => {
    const newRegion = {
      latitude: photo.lat,
      longitude: photo.lng,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
    setRegion(newRegion);
    if (mapRef.current) {
      mapRef.current.animateToRegion(newRegion, 300);
    }
    if (props.onPhotoSelect) {
      props.onPhotoSelect(photo);
    }
  };

  const handleTabChange = (tab: MapTab) => {
    setActiveMapTab(tab);
  };

  const handleTimelineFilterChange = (filter: TimelineFilter) => {
    setTimelineFilter(filter);
    setTimelineResetTrigger(prev => prev + 1);
    setCurrentDate(new Date());
    setActiveMapTab(activeMapTab); // Trigger re-render
  };

  const handleTimeChange = (date: Date) => {
    setCurrentDate(date);
  };

  const handleZoomIn = () => {
    setRegion(prev => {
      const newLatitudeDelta = Math.max(0.001, prev.latitudeDelta * 0.5);
      const newLongitudeDelta = Math.max(0.001, prev.longitudeDelta * 0.5);
      const newRegion = {
        ...prev,
        latitudeDelta: newLatitudeDelta,
        longitudeDelta: newLongitudeDelta,
      };
      if (mapRef.current) {
        mapRef.current.animateToRegion(newRegion, 300);
      }
      return newRegion;
    });
  };

  const handleZoomOut = () => {
    setRegion(prev => {
      const newLatitudeDelta = Math.min(180, prev.latitudeDelta * 2);
      const newLongitudeDelta = Math.min(360, prev.longitudeDelta * 2);
      const newRegion = {
        ...prev,
        latitudeDelta: newLatitudeDelta,
        longitudeDelta: newLongitudeDelta,
      };
      if (mapRef.current) {
        mapRef.current.animateToRegion(newRegion, 300);
      }
      return newRegion;
    });
  };

  // Mock reverse geocoding
  const getLocationName = (lat: number, lng: number): string => {
    const locations = [
      { lat: 37.7749, lng: -122.4194, name: 'San Francisco, California, USA' },
      { lat: 40.7128, lng: -74.0060, name: 'New York City, New York, USA' },
      { lat: 51.5074, lng: -0.1278, name: 'London, United Kingdom' },
      { lat: 48.8566, lng: 2.3522, name: 'Paris, France' },
    ];
    let closest = locations[0];
    let minDist = Math.sqrt(Math.pow(lat - closest.lat, 2) + Math.pow(lng - closest.lng, 2));
    locations.forEach(loc => {
      const dist = Math.sqrt(Math.pow(lat - loc.lat, 2) + Math.pow(lng - loc.lng, 2));
      if (dist < minDist) {
        minDist = dist;
        closest = loc;
      }
    });
    return closest.name;
  };

  useEffect(() => {
    setLocationName(getLocationName(region.latitude, region.longitude));
  }, [region]);

  const handleMarkerPress = (photo: Photo) => {
    const group = photoGroups.find(g => g.photos.some(p => p.id === photo.id));
    if (group) {
      if (group.photos.length > 1) {
        setSelectedStack(group.photos);
      } else if (props.onPhotoSelect) {
        props.onPhotoSelect(group.photos[0]);
      } else {
        navigation.navigate('PhotoDetails' as never, { photo: group.photos[0] } as never);
      }
    }
  };

  const handleRegionChange = (newRegion: { latitude: number; longitude: number; latitudeDelta: number; longitudeDelta: number }) => {
    setRegion(newRegion);
    setLocationName(getLocationName(newRegion.latitude, newRegion.longitude));
  };

  return (
    <View style={styles.container}>
      <MapViewComponent
        ref={mapRef}
        style={styles.map}
        initialRegion={region}
        region={region}
        onRegionChangeComplete={handleRegionChange}
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
            onPress={handleMarkerPress}
            isSelected={selectedPhoto?.id === group.photos[0].id || group.photos.some(p => p.id === selectedPhoto?.id)}
            onProfileClick={props.onProfileClick}
            size={group.size}
          />
        ))}
      </MapViewComponent>

      {/* Location Display at Top */}
      <View style={styles.locationDisplay}>
        <Text style={styles.locationName}>{locationName.split(',')[0]}</Text>
        <Text style={styles.locationCoords}>
          {region.latitude.toFixed(4)}°, {region.longitude.toFixed(4)}°
        </Text>
      </View>

      {/* Tab Switcher with Groups Button - Centered horizontally */}
      <View style={styles.tabContainer}>
        <View style={styles.tabButtonsContainer}>
          <View style={styles.tabButtons}>
            <Pressable
              onPress={() => handleTabChange('personal')}
              style={[styles.tab, activeMapTab === 'personal' && styles.tabActive]}
            >
              <Ionicons 
                name="person" 
                size={14} 
                color={activeMapTab === 'personal' ? 'white' : '#6b7280'} 
              />
              <Text style={[styles.tabText, activeMapTab === 'personal' && styles.tabTextActive]}>
                Personal
              </Text>
            </Pressable>
            
            <Pressable
              onPress={() => handleTabChange('friends')}
              style={[styles.tab, activeMapTab === 'friends' && styles.tabActive]}
            >
              <Ionicons 
                name="people" 
                size={14} 
                color={activeMapTab === 'friends' ? 'white' : '#6b7280'} 
              />
              <Text style={[styles.tabText, activeMapTab === 'friends' && styles.tabTextActive]}>
                Friends
              </Text>
            </Pressable>
            
            <Pressable
              onPress={() => handleTabChange('global')}
              style={[styles.tab, activeMapTab === 'global' && styles.tabActive]}
            >
              <Ionicons 
                name="globe" 
                size={14} 
                color={activeMapTab === 'global' ? 'white' : '#6b7280'} 
              />
              <Text style={[styles.tabText, activeMapTab === 'global' && styles.tabTextActive]}>
                Global
              </Text>
            </Pressable>
          </View>
          
          {/* Groups Button */}
          {props.onGroupsClick && (
            <Pressable
              onPress={props.onGroupsClick}
              style={styles.groupsButton}
            >
              <Text style={styles.groupsButtonText}>👥</Text>
            </Pressable>
          )}
        </View>
      </View>

      {/* Timeline and Filters - Fixed at bottom above BottomNav */}
      <View style={styles.timelineWrapper}>
        {/* Timeline Scrubber */}
        <View style={styles.timelineScrubberContainer}>
        <TimelineScrubber
          photos={allPhotos}
          filter={timelineFilter}
          onTimeChange={handleTimeChange}
          resetTrigger={timelineResetTrigger}
        />
        </View>
        
        {/* Timeline Filter Buttons - with calendar icon and photo count */}
        <View style={styles.timelineFilterContainer}>
          {/* Calendar icon - left side */}
          <View style={styles.timelineCalendarIcon}>
            <Ionicons name="calendar" size={14} color="#374151" />
          </View>
          
          {/* Centered filter buttons */}
          <View style={styles.timelineFilterButtons}>
            {(['daily', 'weekly', 'monthly', 'yearly'] as TimelineFilter[]).map((filter) => (
              <Pressable
                key={filter}
                onPress={() => handleTimelineFilterChange(filter)}
                style={[
                  styles.timelineFilterButton,
                  timelineFilter === filter && styles.timelineFilterButtonActive
                ]}
              >
                <Text style={[
                  styles.timelineFilterText,
                  timelineFilter === filter && styles.timelineFilterTextActive
                ]}>
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </Text>
              </Pressable>
            ))}
          </View>
          
          {/* Photo count - right side */}
          <View style={styles.timelinePhotoCount}>
            <Text style={styles.timelinePhotoCountText}>{photos.length}</Text>
          </View>
        </View>
      </View>

      {/* Note: Camera/Upload button is in BottomNav, not a floating button in MapView */}

      {/* Zoom Controls - hidden when sidebars are visible */}
      {!leftSidebarVisible && !rightSidebarVisible && (
        <View style={styles.zoomControls}>
          <Pressable
            style={styles.zoomButton}
            onPress={handleZoomIn}
          >
            <Ionicons name="add" size={20} color="#374151" />
          </Pressable>
          <Pressable
            style={styles.zoomButton}
            onPress={handleZoomOut}
          >
            <Ionicons name="remove" size={20} color="#374151" />
          </Pressable>
        </View>
      )}

      {/* Daily Challenge Button - Friends Tab */}
      {activeMapTab === 'friends' && !isMapExpanded && !leftSidebarVisible && (
        <Pressable
          style={styles.dailyChallengeButton}
          onPress={() => setShowDailyChallengeModal(true)}
        >
          <View style={styles.dailyChallengeButtonInner}>
            <Ionicons name="camera" size={24} color="white" />
            <View style={styles.dailyChallengeBadge}>
              <Text style={styles.dailyChallengeBadgeText}>!</Text>
            </View>
          </View>
        </Pressable>
      )}

      {/* Daily Challenge Button - Global Tab */}
      {activeMapTab === 'global' && !isMapExpanded && !leftSidebarVisible && (
        <Pressable
          style={styles.dailyChallengeButton}
          onPress={() => setShowDailyChallengeModal(true)}
        >
          <View style={styles.dailyChallengeButtonInner}>
            <Ionicons name="camera" size={24} color="white" />
            <View style={styles.dailyChallengeBadge}>
              <Text style={styles.dailyChallengeBadgeText}>!</Text>
            </View>
          </View>
        </Pressable>
      )}

      {/* Category Sidebar for All Tabs */}
      {!isMapExpanded && (
        <>
          {/* Left edge trigger zone - from original: top: 220px, bottom: 0, width: 64px */}
          {!leftSidebarVisible && (
            <Pressable
              style={styles.leftTriggerZone}
              onPress={() => setLeftSidebarVisible(true)}
            />
          )}
          
          <CategorySidebar
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            isMapExpanded={isMapExpanded}
            isVisible={leftSidebarVisible}
            onVisibilityChange={setLeftSidebarVisible}
          />
        </>
      )}

      {/* Trending Sidebar for Global Tab */}
      {activeMapTab === 'global' && !isMapExpanded && (
        <>
          {/* Right edge trigger zone - from original: top: 128px, bottom: 0, width: 64px */}
          {!rightSidebarVisible && (
            <Pressable
              style={styles.rightTriggerZone}
              onPress={() => setRightSidebarVisible(true)}
            />
          )}
          
          <TrendingSidebar
            photos={photos}
            onPhotoClick={zoomToPhoto}
            isMapExpanded={isMapExpanded}
            isVisible={rightSidebarVisible}
            onVisibilityChange={setRightSidebarVisible}
          />
        </>
      )}

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
              navigation.navigate('PhotoDetails' as never, { photo } as never);
            }
          }}
        />
      )}

      {/* Daily Challenge Modal */}
      {showDailyChallengeModal && (
        <DailyChallengeModal
          onClose={() => setShowDailyChallengeModal(false)}
          submissions={[]}
          onVote={(submissionId: string) => {
            // Handle vote
            console.log('Voted for submission:', submissionId);
          }}
          challengeTitle="Golden Hour Glow"
          challengeDescription="Capture the perfect golden hour moment with warm, glowing light"
          endsIn="in 4 hours"
        />
      )}

      {/* Photo Upload Modal */}
      {props.showUploadModal && props.onUploadModalClose && (
        <PhotoUploadModal
          onClose={props.onUploadModalClose}
          onPhotosUploaded={handlePhotosUploaded}
          visible={props.showUploadModal}
        />
      )}
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
  markerContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  markerImage: {
    width: '100%',
    height: '100%',
  },
  markerBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#06b6d4',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    borderWidth: 2,
    borderColor: 'white',
  },
  markerBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  locationDisplay: {
    position: 'absolute',
    top: 16, // top-4 in original (16px)
    left: '50%',
    transform: [{ translateX: -50 }],
    zIndex: 30,
    alignItems: 'center',
  },
  locationName: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
  },
  locationCoords: {
    fontSize: 10,
    color: '#6b7280',
  },
  tabContainer: {
    position: 'absolute',
    top: 64, // top-16 in original (64px) - below location display
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 30,
  },
  tabButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tabButtons: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 999,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    alignItems: 'center',
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
  },
  tabActive: {
    backgroundColor: '#06b6d4',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
  },
  tabTextActive: {
    color: 'white',
  },
  groupsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  groupsButtonText: {
    fontSize: 18,
  },
  timelineWrapper: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
  },
  timelineScrubberContainer: {
    paddingHorizontal: 16,
  },
  timelineFilterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 8,
    minHeight: 32,
  },
  timelineCalendarIcon: {
    position: 'absolute',
    left: 16,
  },
  timelineFilterButtons: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineFilterButton: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  timelineFilterButtonActive: {
    backgroundColor: '#06b6d4',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  timelineFilterText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#374151',
  },
  timelineFilterTextActive: {
    color: 'white',
    fontWeight: '600',
  },
  timelinePhotoCount: {
    position: 'absolute',
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timelinePhotoCountText: {
    fontSize: 10,
    color: '#374151',
  },
  zoomControls: {
    position: 'absolute',
    right: 16, // right-4 in original (16px)
    bottom: 150, // bottom: 150px in original
    flexDirection: 'column',
    gap: 8,
    zIndex: 10,
  },
  zoomButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  dailyChallengeButton: {
    position: 'absolute',
    left: 16, // left-4 in original (16px)
    top: 20, // top: 20px in original
    zIndex: 40,
  },
  dailyChallengeButtonInner: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f97316', // Orange
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  dailyChallengeBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#06b6d4',
    borderWidth: 2,
    borderColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dailyChallengeBadgeText: {
    fontSize: 10,
    color: 'white',
    fontWeight: 'bold',
  },
  leftTriggerZone: {
    position: 'absolute',
    left: 0,
    top: 220, // From original: top: '220px'
    bottom: 0,
    width: 64, // From original: w-16 (64px)
    zIndex: 20,
  },
  rightTriggerZone: {
    position: 'absolute',
    right: 0,
    top: 128, // From original: top: '128px'
    bottom: 0,
    width: 64, // From original: w-16 (64px)
    zIndex: 20,
  },
});

