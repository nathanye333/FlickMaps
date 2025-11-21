import React, { useState, useMemo, useRef, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, Modal, Dimensions } from 'react-native';
import MapViewComponent from 'react-native-maps';
import { Marker } from 'react-native-maps';
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
    latitudeDelta: 0.5,
    longitudeDelta: 0.5,
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

  // Group photos by location to avoid too many markers
  const photoGroups = useMemo(() => {
    const groups = new Map<string, Photo[]>();
    const threshold = 0.001; // ~100m
    
    photos.forEach(photo => {
      let found = false;
      for (const [key, group] of groups.entries()) {
        const [lat, lng] = key.split(',').map(Number);
        if (Math.abs(photo.lat - lat) < threshold && Math.abs(photo.lng - lng) < threshold) {
          group.push(photo);
          found = true;
          break;
        }
      }
      if (!found) {
        groups.set(`${photo.lat},${photo.lng}`, [photo]);
      }
    });
    
    return Array.from(groups.entries()).map(([key, groupPhotos]) => ({
      key,
      photos: groupPhotos,
      lat: groupPhotos[0].lat,
      lng: groupPhotos[0].lng,
    }));
  }, [photos]);

  useEffect(() => {
    if (selectedPhoto && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: selectedPhoto.lat,
        longitude: selectedPhoto.lng,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      }, 1000);
    }
  }, [selectedPhoto]);

  const handleMarkerPress = (group: typeof photoGroups[0]) => {
    const photo = group.photos[0];
    // If it's a stack, show modal; otherwise open photo directly
    if (group.photos.length > 1) {
      setSelectedStack(group.photos);
    } else if (props.onPhotoSelect) {
      props.onPhotoSelect(photo);
    } else {
      navigation.navigate('PhotoDetails' as never, { photo } as never);
    }
  };

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
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: photo.lat,
        longitude: photo.lng,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      }, 1000);
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
    setRegion(prev => ({
      ...prev,
      latitudeDelta: Math.max(0.01, prev.latitudeDelta * 0.7),
      longitudeDelta: Math.max(0.01, prev.longitudeDelta * 0.7),
    }));
  };

  const handleZoomOut = () => {
    setRegion(prev => ({
      ...prev,
      latitudeDelta: Math.min(10, prev.latitudeDelta * 1.3),
      longitudeDelta: Math.min(10, prev.longitudeDelta * 1.3),
    }));
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

  return (
    <View style={styles.container}>
      <MapViewComponent
        ref={mapRef}
        style={styles.map}
        initialRegion={region}
        onRegionChangeComplete={setRegion}
      >
        {photoGroups.map((group) => (
          <Marker
            key={group.key}
            coordinate={{ latitude: group.lat, longitude: group.lng }}
            onPress={() => handleMarkerPress(group)}
          >
            <View style={styles.markerContainer}>
              <Image
                source={{ uri: group.photos[0].imageUrl }}
                style={styles.markerImage}
                contentFit="cover"
              />
              {group.photos.length > 1 && (
                <View style={styles.markerBadge}>
                  <Text style={styles.markerBadgeText}>{group.photos.length}</Text>
                </View>
              )}
            </View>
          </Marker>
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

