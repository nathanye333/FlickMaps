import React, { useState, useMemo, useRef, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, Modal, Dimensions, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Photo, MapTab } from '../App';
import { mockPersonalPhotos, mockFriendsPhotos, mockGlobalPhotos, getPersonalPhotosForTab, mockDailyChallengeSubmissions } from '../data/mockData';
import { AppContext } from '../../App';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Image } from 'expo-image';
import { TimelineScrubber } from './TimelineScrubber';
import { PhotoStackModal } from './PhotoStackModal';
import { DailyChallengeModal } from './DailyChallengeModal';
import { PhotoUploadModal, UploadedPhoto } from './PhotoUploadModal';
import { PhotoPin } from './PhotoPin';
import MapViewComponent from 'react-native-maps';
import { MapMarker } from './MapMarker';
import * as Location from 'expo-location';

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
  const setActiveMapTabContext = context?.setActiveMapTab;
  const setActiveMapTabProps = props.setActiveMapTab;
  const selectedPhoto = context?.selectedPhoto || props.selectedPhoto;
  
  // Local state to force re-render when tab changes
  const [localTab, setLocalTab] = useState<MapTab>(activeMapTab);
  
  // Use local tab for rendering to ensure immediate updates
  const currentTab = localTab;
  
  // Sync local tab with context/props when they change
  useEffect(() => {
    if (activeMapTab !== localTab) {
      setLocalTab(activeMapTab);
    }
  }, [activeMapTab]);

  // Sync tab state when screen comes into focus (fixes navigation stack issues)
  useFocusEffect(
    React.useCallback(() => {
      // When returning to this screen, sync the tab state
      const contextTab = context?.activeMapTab;
      const propsTab = props.activeMapTab;
      const currentContextTab = contextTab || propsTab || 'personal';
      
      if (currentContextTab !== localTab) {
        setLocalTab(currentContextTab);
      }
      // Don't reset currentDate - preserve the timeline position
      // The timeline scrubber will maintain its own state
    }, [context?.activeMapTab, props.activeMapTab, localTab])
  );
  
  const [timelineFilter, setTimelineFilter] = useState<TimelineFilter>('weekly');
  const [selectedCategory, setSelectedCategory] = useState('All');
  // Initialize to a date that matches the mock photos (November 2025)
  // This ensures photos are visible by default
  const [currentDate, setCurrentDate] = useState<Date>(() => {
    // Use the most recent photo date or current date, whichever makes sense
    // For mock data from Nov 2025, initialize to that timeframe
    const defaultDate = new Date('2025-11-20');
    return defaultDate;
  });
  const [timelineResetTrigger, setTimelineResetTrigger] = useState(0);
  const [region, setRegion] = useState({
    latitude: 37.7749,
    longitude: -122.4194,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [selectedStack, setSelectedStack] = useState<Photo[] | null>(null);
  const [showDailyChallengeModal, setShowDailyChallengeModal] = useState(false);
  const [uploadedPhotos, setUploadedPhotos] = useState<Photo[]>([]);
  const [locationName, setLocationName] = useState('San Francisco, California, USA');
  const [isMapExpanded, setIsMapExpanded] = useState(false);

  const getPhotosForTab = (): Photo[] => {
    let photos: Photo[] = [];
    switch (currentTab) {
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

  const photos = useMemo(() => getPhotosForTab(), [currentTab, timelineFilter, selectedCategory, currentDate]);
  const allPhotos = useMemo(() => {
    switch (currentTab) {
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

  // Calculate adaptive marker size based on zoom level
  // Photos get larger when zoomed in, smaller when zoomed out
  // When photos overlap (stack), only one photo is shown on top
  const calculateMarkerSize = (latitudeDelta: number, nearbyCount: number = 0, photoCount: number = 1): number => {
    // Base size calculation from zoom level
    // latitudeDelta ranges from ~0.001 (very zoomed in) to ~180 (world view)
    // When zoomed in (small delta), markers are bigger. When zoomed out (large delta), markers are smaller.
    const zoomFactor = Math.max(0.001, Math.min(0.15, latitudeDelta));
    const normalizedZoom = Math.log(zoomFactor / 0.001) / Math.log(0.15 / 0.001); // 0 to 1, where 0 = zoomed in, 1 = zoomed out
    
    // Adaptive photos: smaller when zoomed out, larger when zoomed in
    // Range: 80px (zoomed out) to 200px (zoomed in) - a little bigger
    const baseSize = 80 + (1 - normalizedZoom) * 120;
    
    // Slight adjustment for nearby photos to prevent excessive overlap
    const densityFactor = Math.max(0.85, 1 - (nearbyCount * 0.02));
    
    // No special factor for stacks - they show as a single photo
    const finalSize = Math.max(50, Math.min(220, baseSize * densityFactor));
    return Math.round(finalSize);
  };

  // Stacking: detect if photos are overlapping in pixels on screen
  // Use pixel-based overlap detection instead of degrees threshold
  const photoGroups = useMemo(() => {
    if (photos.length === 0) return [];
    
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
    photos.forEach(photo => {
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
  }, [photos, region.latitudeDelta, region.longitudeDelta, width, height]);

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
        handleTabChange('personal');
      } else if (selectedPhoto.visibility === 'friends') {
        handleTabChange('friends');
      } else if (selectedPhoto.visibility === 'public') {
        handleTabChange('global');
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
    // Update both context and props if available
    if (setActiveMapTabContext) {
      setActiveMapTabContext(tab);
    }
    if (setActiveMapTabProps) {
      setActiveMapTabProps(tab);
    }
    // Update local state to force immediate re-render
    setLocalTab(tab);
  };

  const handleTimelineFilterChange = (filter: TimelineFilter) => {
    setTimelineFilter(filter);
    setTimelineResetTrigger(prev => prev + 1);
    setCurrentDate(new Date());
    // Force re-render by updating local tab state
    setLocalTab(prev => prev);
  };

  const handleTimeChange = (date: Date) => {
    // Update the date - this is called by TimelineScrubber when user interacts
    setCurrentDate(date);
  };
  
  // Track if this is the first render to prevent timeline from overriding initial date
  const isFirstRender = useRef(true);
  
  useEffect(() => {
    // On first render, set a date that matches the photos (November 2025)
    // This ensures photos are visible by default
    if (isFirstRender.current) {
      const photoDate = new Date('2025-11-20');
      setCurrentDate(photoDate);
      isFirstRender.current = false;
    }
  }, []);

  // Handle recentering to user's current location
  const handleRecenter = async () => {
    try {
      // Request location permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Location Permission',
          'Please enable location permissions to recenter the map to your current location.',
          [{ text: 'OK' }]
        );
        return;
      }

      // Get current location
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const { latitude, longitude } = location.coords;

      // Create new region centered on user's location
      const newRegion = {
        latitude,
        longitude,
        latitudeDelta: 0.01, // Zoom level - adjust as needed
        longitudeDelta: 0.01,
      };

      // Update region state
      setRegion(newRegion);

      // Animate map to new location
      if (mapRef.current) {
        mapRef.current.animateToRegion(newRegion, 1000);
      }
    } catch (error) {
      Alert.alert(
        'Location Error',
        'Unable to get your current location. Please try again.',
        [{ text: 'OK' }]
      );
    }
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
        (navigation as any)?.navigate?.('PhotoDetails', { photo: group.photos[0] });
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

      {/* Tab Switcher with Groups Button - Tabs centered, shifted left */}
      <View style={styles.tabContainer}>
        <View style={styles.tabButtonsContainer}>
          <View style={styles.tabButtons}>
            <Pressable
              onPress={() => handleTabChange('personal')}
              style={[styles.tab, currentTab === 'personal' && styles.tabActive]}
            >
              <Ionicons 
                name="person" 
                size={14} 
                color={currentTab === 'personal' ? 'white' : '#6b7280'} 
              />
              <Text style={[styles.tabText, currentTab === 'personal' && styles.tabTextActive]}>
                Personal
              </Text>
            </Pressable>
            
            <Pressable
              onPress={() => handleTabChange('friends')}
              style={[styles.tab, currentTab === 'friends' && styles.tabActive]}
            >
              <Ionicons 
                name="people" 
                size={14} 
                color={currentTab === 'friends' ? 'white' : '#6b7280'} 
              />
              <Text style={[styles.tabText, currentTab === 'friends' && styles.tabTextActive]}>
                Friends
              </Text>
            </Pressable>
            
            <Pressable
              onPress={() => handleTabChange('global')}
              style={[styles.tab, currentTab === 'global' && styles.tabActive]}
            >
              <Ionicons 
                name="globe" 
                size={14} 
                color={currentTab === 'global' ? 'white' : '#6b7280'} 
              />
              <Text style={[styles.tabText, currentTab === 'global' && styles.tabTextActive]}>
                Global
              </Text>
            </Pressable>
          </View>
          
          {/* Groups Button */}
          <Pressable
            onPress={props.onGroupsClick || (() => {
              // Fallback: try to navigate using context or navigation
              if (navigation) {
                (navigation as any).getParent()?.navigate('GroupMaps');
              }
            })}
            style={styles.groupsButton}
          >
            <Ionicons name="people" size={20} color="#06b6d4" />
          </Pressable>
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

      {/* Zoom Controls */}
      <View style={styles.zoomControls}>
          {/* Recenter Button */}
          <Pressable
            style={styles.recenterButton}
            onPress={handleRecenter}
          >
            <Ionicons name="locate" size={22} color="#06b6d4" />
          </Pressable>
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

      {/* Daily Challenge Button - Friends Tab */}
      {currentTab === 'friends' && !isMapExpanded && (
        <Pressable
          style={styles.dailyChallengeButton}
          onPress={() => {
            setShowDailyChallengeModal(true);
            // Activate daily challenge when modal opens
            if (context?.setIsDailyChallengeActive) {
              context.setIsDailyChallengeActive(true);
            }
          }}
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
      {currentTab === 'global' && !isMapExpanded && (
        <Pressable
          style={styles.dailyChallengeButton}
          onPress={() => {
            setShowDailyChallengeModal(true);
            // Activate daily challenge when modal opens
            if (context?.setIsDailyChallengeActive) {
              context.setIsDailyChallengeActive(true);
            }
          }}
        >
          <View style={styles.dailyChallengeButtonInner}>
            <Ionicons name="camera" size={24} color="white" />
            <View style={styles.dailyChallengeBadge}>
              <Text style={styles.dailyChallengeBadgeText}>!</Text>
            </View>
          </View>
        </Pressable>
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
              (navigation as any)?.navigate?.('PhotoDetails', { photo });
            }
          }}
        />
      )}

      {/* Daily Challenge Modal */}
      {showDailyChallengeModal && (
        <DailyChallengeModal
          onClose={() => {
            setShowDailyChallengeModal(false);
            // Keep daily challenge active even when modal closes - challenge is still live
            // Don't deactivate here, only deactivate when user explicitly opts out
          }}
          submissions={mockDailyChallengeSubmissions}
          onVote={(submissionId: string) => {
            // Handle vote
            console.log('Voted for submission:', submissionId);
          }}
          challengeTitle="Golden Hour Moments"
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
    paddingHorizontal: 16,
  },
  tabButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    // Shift right by half the groups button width + gap to keep tabs visually centered
    transform: [{ translateX: 24 }], // Half of groups button width (40/2) + gap (8/2) = 20 + 4 = 24
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
    marginLeft: 8,
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
  recenterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
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
});

