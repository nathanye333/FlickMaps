import { useState, useRef, useEffect, useMemo } from 'react';
import { Camera, Users, Globe, User, Calendar, Maximize2, Minimize2, Plus, Minus, ChevronRight, ChevronLeft, Upload, MapPin, ChevronDown } from 'lucide-react';
import { Photo, MapTab } from '../App';
import { PhotoPin } from './PhotoPin';
import { TimelineScrubber } from './TimelineScrubber';
import { PhotoStackModal } from './PhotoStackModal';
import { CategorySidebar } from './CategorySidebar';
import { TrendingSidebar } from './TrendingSidebar';
import { DailyChallengeModal } from './DailyChallengeModal';
import { PhotoUploadModal, UploadedPhoto } from './PhotoUploadModal';
import { mockPersonalPhotos, mockFriendsPhotos, mockGlobalPhotos, mockDailyChallengeSubmissions, getPersonalPhotosForTab } from '../data/mockData';

export type TimelineFilter = 'daily' | 'weekly' | 'monthly' | 'yearly';

interface MapViewProps {
  onPhotoSelect: (photo: Photo) => void;
  showUploadModal?: boolean;
  onUploadModalClose?: () => void;
  selectedPhoto?: Photo | null;
  viewingUser?: string | null;
  onProfileClick?: (username: string) => void;
  activeMapTab: MapTab;
  setActiveMapTab: (tab: MapTab) => void;
  onGroupsClick?: () => void;
}

export function MapView({ onPhotoSelect, showUploadModal, onUploadModalClose, selectedPhoto, viewingUser, onProfileClick, activeMapTab, setActiveMapTab, onGroupsClick }: MapViewProps) {
  const [timelineFilter, setTimelineFilter] = useState<TimelineFilter>('weekly');
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const [currentTimelineDate, setCurrentTimelineDate] = useState<Date>(new Date());
  const [timelineResetTrigger, setTimelineResetTrigger] = useState(0);
  
  // Map pan and zoom state
  const [mapOffset, setMapOffset] = useState({ x: 0, y: 0 });
  const [mapZoom, setMapZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hasDragged, setHasDragged] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [selectedStack, setSelectedStack] = useState<Photo[] | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [leftSidebarVisible, setLeftSidebarVisible] = useState(false);
  const [rightSidebarVisible, setRightSidebarVisible] = useState(false);
  const [showDailyChallengeModal, setShowDailyChallengeModal] = useState(false);
  const [challengeSubmissions, setChallengeSubmissions] = useState(mockDailyChallengeSubmissions);
  const [priorityPhotoId, setPriorityPhotoId] = useState<string | null>(null);
  const [uploadedPhotos, setUploadedPhotos] = useState<Photo[]>([]);

  const filterPhotosByTimeline = (photos: Photo[]): Photo[] => {
    const startDate = new Date(currentTimelineDate);
    const endDate = new Date(currentTimelineDate);
    
    switch (timelineFilter) {
      case 'daily':
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
        break;
      case 'weekly':
        const dayOfWeek = currentTimelineDate.getDay();
        startDate.setDate(currentTimelineDate.getDate() - dayOfWeek);
        startDate.setHours(0, 0, 0, 0);
        endDate.setDate(startDate.getDate() + 6);
        endDate.setHours(23, 59, 59, 999);
        break;
      case 'monthly':
        startDate.setDate(1);
        startDate.setHours(0, 0, 0, 0);
        endDate.setMonth(startDate.getMonth() + 1);
        endDate.setDate(0);
        endDate.setHours(23, 59, 59, 999);
        break;
      case 'yearly':
        startDate.setMonth(0, 1);
        startDate.setHours(0, 0, 0, 0);
        endDate.setMonth(11, 31);
        endDate.setHours(23, 59, 59, 999);
        break;
    }
    
    return photos.filter(photo => 
      photo.timestamp >= startDate && photo.timestamp <= endDate
    );
  };

  const filterPhotosByCategory = (photos: Photo[]): Photo[] => {
    if (selectedCategory === 'All') {
      return photos;
    }
    return photos.filter(photo => 
      photo.category?.toLowerCase() === selectedCategory.toLowerCase()
    );
  };

  const getPhotosForTab = (): Photo[] => {
    let photos: Photo[] = [];
    switch (activeMapTab) {
      case 'personal':
        photos = mockPersonalPhotos;
        break;
      case 'friends':
        // Include both friends' photos AND your photos with 'friends' or 'public' visibility
        photos = [...mockFriendsPhotos, ...getPersonalPhotosForTab('friends')];
        break;
      case 'global':
        // Include both global photos AND your photos with 'public' visibility
        photos = [...mockGlobalPhotos, ...getPersonalPhotosForTab('global')];
        break;
    }
    // Apply both timeline and category filters
    return filterPhotosByCategory(filterPhotosByTimeline(photos));
  };

  const getAllPhotosForTab = (): Photo[] => {
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
  };

  const photos = useMemo(() => getPhotosForTab(), [activeMapTab, currentTimelineDate, timelineFilter, selectedCategory]);
  const allPhotos = useMemo(() => getAllPhotosForTab(), [activeMapTab]);

  // Base coordinate system constants
  const BASE_SCALE = 10000; // pixels per degree at zoom level 1
  
  // Reference point for the map (arbitrary, but consistent)
  const mapCenter = useMemo(() => {
    if (photos.length === 0) return { lat: 37.7749, lng: -122.4194 }; // San Francisco
    
    const lats = photos.map(p => p.lat);
    const lngs = photos.map(p => p.lng);
    return {
      lat: (Math.min(...lats) + Math.max(...lats)) / 2,
      lng: (Math.min(...lngs) + Math.max(...lngs)) / 2
    };
  }, [photos]);

  // Calculate adaptive photo size based on zoom
  const photoSize = useMemo(() => {
    if (!mapContainerRef.current) return 120;
    
    const containerWidth = mapContainerRef.current.clientWidth;
    const containerHeight = mapContainerRef.current.clientHeight;
    const maxDimension = Math.min(containerWidth, containerHeight);
    
    const baseSize = 120; // Base photo size
    const zoomFactor = Math.pow(mapZoom, 1.5); // Exponential growth
    const calculatedSize = baseSize * zoomFactor;
    
    // Cap at 80% of screen to ensure photos never exceed viewport
    const maxSize = maxDimension * 0.8;
    
    return Math.max(100, Math.min(maxSize, calculatedSize));
  }, [mapZoom]);

  // Convert lat/lng to screen coordinates
  const latLngToScreen = (lat: number, lng: number, containerWidth: number, containerHeight: number) => {
    if (photos.length === 0) {
      return { x: containerWidth / 2, y: containerHeight / 2 };
    }

    // Get bounds of all photos
    const lats = photos.map(p => p.lat);
    const lngs = photos.map(p => p.lng);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    // Calculate center of bounds
    const centerLat = (minLat + maxLat) / 2;
    const centerLng = (minLng + maxLng) / 2;

    // Calculate range with padding
    const latRange = Math.max(maxLat - minLat, 0.001);
    const lngRange = Math.max(maxLng - minLng, 0.001);
    
    // Determine scale to fit all photos with padding
    const padding = 150; // pixels
    const scaleX = (containerWidth - padding * 2) / lngRange;
    const scaleY = (containerHeight - padding * 2) / latRange;
    const baseScale = Math.min(scaleX, scaleY);

    // Apply zoom
    const scale = baseScale * mapZoom;

    // Convert to screen coordinates centered on container
    const x = containerWidth / 2 + (lng - centerLng) * scale + mapOffset.x;
    const y = containerHeight / 2 - (lat - centerLat) * scale + mapOffset.y;

    return { x, y };
  };

  // Group photos and layout - memoized to prevent loops
  const photoPositions = useMemo(() => {
    if (!mapContainerRef.current || photos.length === 0) return [];
    
    const containerWidth = mapContainerRef.current.clientWidth;
    const containerHeight = mapContainerRef.current.clientHeight;

    // Calculate the grouping threshold based on current zoom level
    // At higher zoom, we want a tighter GPS threshold
    // The threshold should represent: what GPS distance equals "overlapping photos" at current zoom?
    
    // Get the current scale
    const lats = photos.map(p => p.lat);
    const lngs = photos.map(p => p.lng);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    const centerLat = (minLat + maxLat) / 2;
    const centerLng = (minLng + maxLng) / 2;
    const latRange = Math.max(maxLat - minLat, 0.001);
    const lngRange = Math.max(maxLng - minLng, 0.001);
    const padding = 150;
    const scaleX = (containerWidth - padding * 2) / lngRange;
    const scaleY = (containerHeight - padding * 2) / latRange;
    const baseScale = Math.min(scaleX, scaleY);
    const currentScale = baseScale * mapZoom;

    // Calculate what GPS distance corresponds to photoSize * 0.7 pixels at current zoom
    // This ensures photos only stack when they would visually overlap
    const overlapPixels = photoSize * 0.3; // Reduced from 0.7 to 0.3 for less overlap
    const gpsThreshold = overlapPixels / currentScale;

    // Convert all photos to screen positions
    const screenPositions = photos.map(photo => {
      const pos = latLngToScreen(photo.lat, photo.lng, containerWidth, containerHeight);
      return { photo, ...pos };
    });

    // Group by GPS distance (which accounts for zoom level)
    const groups: PhotoPosition[] = [];
    const used = new Set<number>();

    screenPositions.forEach((pos, index) => {
      if (used.has(index)) return;

      const group: Photo[] = [pos.photo];
      used.add(index);

      // Find overlapping photos based on GPS threshold
      screenPositions.forEach((otherPos, otherIndex) => {
        if (used.has(otherIndex)) return;

        const latDiff = Math.abs(pos.photo.lat - otherPos.photo.lat);
        const lngDiff = Math.abs(pos.photo.lng - otherPos.photo.lng);
        
        // Group if both lat and lng differences are within threshold
        if (latDiff < gpsThreshold && lngDiff < gpsThreshold) {
          group.push(otherPos.photo);
          used.add(otherIndex);
        }
      });

      groups.push({
        x: pos.x,
        y: pos.y,
        photos: group,
        photoSize,
        showPin: false
      });
    });

    // Smart layout: adjust photo positions to avoid overlap when possible
    const layouted = groups.map(group => ({
      ...group,
      displayPosition: { x: group.x, y: group.y }
    }));

    // Don't apply force-directed layout - respect GPS positions
    // Force layout is disabled to keep photos at their true locations
    
    // Keep all photos within screen bounds
    const halfPhotoSize = photoSize / 2;
    const margin = 20; // Extra margin from edges
    
    layouted.forEach(item => {
      const pos = item.displayPosition!;
      
      // Clamp position to keep entire photo visible
      const clampedX = Math.max(halfPhotoSize + margin, Math.min(containerWidth - halfPhotoSize - margin, pos.x));
      const clampedY = Math.max(halfPhotoSize + margin, Math.min(containerHeight - halfPhotoSize - margin, pos.y));
      
      item.displayPosition = { x: clampedX, y: clampedY };
    });

    // Mark photos that moved significantly
    layouted.forEach(item => {
      const dx = item.displayPosition!.x - item.x;
      const dy = item.displayPosition!.y - item.y;
      const moved = Math.sqrt(dx * dx + dy * dy) > 10;
      item.showPin = moved;
    });
    
    return layouted;
  }, [photos, photoSize, mapOffset.x, mapOffset.y, mapZoom]);

  // Reset map position when photos change
  useEffect(() => {
    setMapOffset({ x: 0, y: 0 });
    setMapZoom(1);
  }, [activeMapTab, currentTimelineDate]);

  // Zoom to selected photo when coming from photo details
  useEffect(() => {
    if (selectedPhoto && photos.some(p => p.id === selectedPhoto.id)) {
      // Determine the correct tab based on photo visibility
      if (selectedPhoto.visibility === 'personal') {
        setActiveMapTab('personal');
      } else if (selectedPhoto.visibility === 'friends') {
        setActiveMapTab('friends');
      } else if (selectedPhoto.visibility === 'public') {
        setActiveMapTab('global');
      }
      
      zoomToPhoto(selectedPhoto);
    } else if (selectedPhoto) {
      // Photo not visible in current timeline - adjust timeline to show it
      adjustTimelineForPhoto(selectedPhoto);
    }
  }, [selectedPhoto]);

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    // Only toggle if the user didn't drag
    if (!hasDragged) {
      setIsMapExpanded(!isMapExpanded);
    }
  };

  const handleTimelineChange = (currentDate: Date) => {
    setCurrentTimelineDate(currentDate);
  };

  const handleTabChange = (tab: MapTab) => {
    setActiveMapTab(tab);
    setTimelineResetTrigger(prev => prev + 1);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    setIsDragging(true);
    setDragStart({ x: e.clientX - mapOffset.x, y: e.clientY - mapOffset.y });
    setHasDragged(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) {
      setMapOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
      setHasDragged(true);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setMapZoom(prev => Math.min(10, Math.max(0.5, prev * delta)));
  };

  const handleZoomIn = () => {
    setMapZoom(prev => Math.min(10, prev * 1.3));
  };

  const handleZoomOut = () => {
    setMapZoom(prev => Math.max(0.5, prev / 1.3));
  };

  // Function to zoom and pan to a specific photo
  const zoomToPhoto = (photo: Photo) => {
    if (!mapContainerRef.current) return;

    // Set this photo as priority to reorder the stack
    setPriorityPhotoId(photo.id);

    const containerWidth = mapContainerRef.current.clientWidth;
    const containerHeight = mapContainerRef.current.clientHeight;

    // Get bounds of all photos to calculate the base scale for initial map
    const lats = photos.map(p => p.lat);
    const lngs = photos.map(p => p.lng);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    const centerLat = (minLat + maxLat) / 2;
    const centerLng = (minLng + maxLng) / 2;
    const latRange = Math.max(maxLat - minLat, 0.001);
    const lngRange = Math.max(maxLng - minLng, 0.001);
    
    const padding = 150;
    const scaleX = (containerWidth - padding * 2) / lngRange;
    const scaleY = (containerHeight - padding * 2) / latRange;
    const baseScale = Math.min(scaleX, scaleY);

    // Zoom in VERY aggressively so only this photo is visible
    // This essentially means that photos at other locations will be off-screen
    const targetZoom = 6; // Much higher zoom level
    setMapZoom(targetZoom);

    // Calculate offset to center the photo
    const scale = baseScale * targetZoom;
    const offsetX = -(photo.lng - centerLng) * scale;
    const offsetY = (photo.lat - centerLat) * scale;

    setMapOffset({ x: offsetX, y: offsetY });
  };

  // Adjust timeline to show a specific photo
  const adjustTimelineForPhoto = (photo: Photo) => {
    // Set timeline date to the photo's timestamp
    setCurrentTimelineDate(new Date(photo.timestamp));
    
    // Determine the best timeline filter based on how old the photo is
    const now = new Date();
    const photoDate = new Date(photo.timestamp);
    const daysDiff = Math.abs((now.getTime() - photoDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff < 1) {
      setTimelineFilter('daily');
    } else if (daysDiff < 7) {
      setTimelineFilter('weekly');
    } else if (daysDiff < 30) {
      setTimelineFilter('monthly');
    } else {
      setTimelineFilter('yearly');
    }
    
    // After timeline adjustment, the photo should be visible, so zoom to it
    // We need to wait for photos to update, so use a timeout
    setTimeout(() => {
      zoomToPhoto(photo);
    }, 100);
  };

  const handleVote = (submissionId: string) => {
    setChallengeSubmissions(prev => 
      prev.map(submission => ({
        ...submission,
        votes: submission.id === submissionId ? submission.votes + 1 : submission.votes,
        hasVoted: submission.id === submissionId ? true : submission.hasVoted
      }))
    );
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
      category: 'uploaded'
    }));
    
    // Add to uploaded photos state
    setUploadedPhotos(prev => [...prev, ...newPhotos]);
  };

  // Mock reverse geocoding function - returns location name based on coordinates
  const getLocationName = (lat: number, lng: number): string => {
    // Mock data for common locations
    const locations = [
      { lat: 37.7749, lng: -122.4194, name: 'San Francisco, California, USA' },
      { lat: 40.7128, lng: -74.0060, name: 'New York City, New York, USA' },
      { lat: 51.5074, lng: -0.1278, name: 'London, United Kingdom' },
      { lat: 48.8566, lng: 2.3522, name: 'Paris, France' },
      { lat: 35.6762, lng: 139.6503, name: 'Tokyo, Japan' },
      { lat: -33.8688, lng: 151.2093, name: 'Sydney, Australia' },
      { lat: 41.9028, lng: 12.4964, name: 'Rome, Italy' },
      { lat: 52.5200, lng: 13.4050, name: 'Berlin, Germany' },
      { lat: 40.4168, lng: -3.7038, name: 'Madrid, Spain' },
      { lat: 34.0522, lng: -118.2437, name: 'Los Angeles, California, USA' },
    ];

    // Find closest location
    let closest = locations[0];
    let minDist = Math.sqrt(
      Math.pow(lat - closest.lat, 2) + Math.pow(lng - closest.lng, 2)
    );

    locations.forEach(loc => {
      const dist = Math.sqrt(
        Math.pow(lat - loc.lat, 2) + Math.pow(lng - loc.lng, 2)
      );
      if (dist < minDist) {
        minDist = dist;
        closest = loc;
      }
    });

    return closest.name;
  };

  // Calculate the current center of the map view
  const currentMapCenter = useMemo(() => {
    if (!mapContainerRef.current || photos.length === 0) {
      return { lat: 37.7749, lng: -122.4194 };
    }

    const containerWidth = mapContainerRef.current.clientWidth;
    const containerHeight = mapContainerRef.current.clientHeight;

    // Get bounds of all photos
    const lats = photos.map(p => p.lat);
    const lngs = photos.map(p => p.lng);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    const centerLat = (minLat + maxLat) / 2;
    const centerLng = (minLng + maxLng) / 2;

    // Calculate how the offset affects the center
    const latRange = Math.max(maxLat - minLat, 0.001);
    const lngRange = Math.max(maxLng - minLng, 0.001);
    const padding = 150;
    const scaleX = (containerWidth - padding * 2) / lngRange;
    const scaleY = (containerHeight - padding * 2) / latRange;
    const baseScale = Math.min(scaleX, scaleY);
    const scale = baseScale * mapZoom;

    // Convert offset back to lat/lng
    const offsetLat = -mapOffset.y / scale;
    const offsetLng = mapOffset.x / scale;

    return {
      lat: centerLat + offsetLat,
      lng: centerLng + offsetLng
    };
  }, [photos, mapOffset, mapZoom]);

  const locationName = useMemo(() => {
    return getLocationName(currentMapCenter.lat, currentMapCenter.lng);
  }, [currentMapCenter]);

  return (
    <div className="h-full relative bg-gray-100 flex flex-col">
      {/* Map Container - takes remaining space */}
      <div className="flex-1 relative">
        {/* Map Background */}
        <div 
          ref={mapContainerRef}
          onClick={handleMapClick}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          className={`w-full h-full relative bg-cover bg-center overflow-hidden ${
            isDragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
          style={{
            backgroundImage: 'linear-gradient(to bottom, #e0f2fe, #f0f9ff)',
          }}
        >
          {/* Map Grid Pattern */}
          <div 
            className="absolute inset-0 opacity-10 pointer-events-none" 
            style={{
              backgroundImage: `
                linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
              `,
              backgroundSize: `${40 * mapZoom}px ${40 * mapZoom}px`,
              backgroundPosition: `${mapOffset.x}px ${mapOffset.y}px`
            }} 
          />

          {/* Location Display at Top */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-30 pointer-events-none">
            <div className="flex flex-col items-center">
              <span className="text-sm text-gray-900">{locationName.split(',')[0]}</span>
              <span className="text-[10px] text-gray-600">
                {currentMapCenter.lat.toFixed(4)}°, {currentMapCenter.lng.toFixed(4)}°\n              </span>
            </div>
          </div>

          {/* Visibility Filter Chips - Top Center Below Location */}
          <div className="absolute top-16 left-1/2 transform -translate-x-1/2 z-30 pointer-events-auto flex items-center gap-2">
            <div className="flex items-center gap-2 bg-white/95 backdrop-blur-sm rounded-full px-3 py-2 shadow-lg">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleTabChange('personal');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
                  activeMapTab === 'personal'
                    ? 'bg-cyan-500 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span className="text-xs">Personal</span>
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleTabChange('friends');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
                  activeMapTab === 'friends'
                    ? 'bg-cyan-500 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span className="text-xs">Friends</span>
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleTabChange('global');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
                  activeMapTab === 'global'
                    ? 'bg-cyan-500 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span className="text-xs">Global</span>
              </button>
            </div>
            
            {/* Groups Button */}
            {onGroupsClick && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onGroupsClick();
                }}
                className="w-10 h-10 bg-white/95 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-cyan-50 hover:shadow-xl transition-all group"
                title="Group Maps"
              >
                <div className="text-lg">👥</div>
              </button>
            )}
          </div>

          {/* Photo Pins */}
          {photoPositions.map((position, index) => (
            <PhotoPin
              key={`photo-${index}`}
              photos={position.photos}
              onClick={(photo) => {
                // If it's a stack, show modal; otherwise open photo directly
                if (position.photos.length > 1) {
                  setSelectedStack(position.photos);
                } else {
                  onPhotoSelect(photo);
                }
              }}
              photoSize={position.photoSize || 48}
              position={position}
              displayPosition={position.displayPosition}
              showPin={position.showPin || false}
              priorityPhotoId={priorityPhotoId}
              onProfileClick={onProfileClick}
            />
          ))}

          {/* Zoom Controls - positioned at bottom right, hidden when sidebars are visible */}
          {!leftSidebarVisible && !rightSidebarVisible && (
            <div 
              className="absolute right-4 flex flex-col gap-2 z-10 transition-all duration-300"
              style={{ bottom: '150px' }}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleZoomIn();
                }}
                className="w-10 h-10 bg-white/90 rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-all"
              >
                <Plus className="w-5 h-5 text-gray-700" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleZoomOut();
                }}
                className="w-10 h-10 bg-white/90 rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-all"
              >
                <Minus className="w-5 h-5 text-gray-700" />
              </button>
            </div>
          )}

          {/* Map Attribution */}
          {/* Removed to make more space for the map */}
        </div>
      </div>

      {/* Info Banner for Friends Tab */}
      {activeMapTab === 'friends' && !isMapExpanded && !leftSidebarVisible && (
        <button 
          className="absolute left-4 z-40 w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 shadow-lg flex items-center justify-center group hover:scale-110 transition-all"
          style={{ top: '20px' }}
          onClick={(e) => {
            e.stopPropagation();
            // Handle daily challenge click
            setShowDailyChallengeModal(true);
          }}
        >
          <Camera className="w-6 h-6 text-white" />
          <div className="absolute top-0 right-0 w-4 h-4 rounded-full bg-cyan-500 border-2 border-white flex items-center justify-center">
            <span className="text-[10px] text-white">!</span>
          </div>
          
          {/* Tooltip on hover */}
          <div className="absolute left-full ml-2 px-3 py-2 bg-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
            <p className="text-xs text-gray-900">Daily Challenge</p>
            <p className="text-[10px] text-gray-500">Golden Hour Glow</p>
          </div>
        </button>
      )}

      {/* Daily Challenge for Global Tab */}
      {activeMapTab === 'global' && !isMapExpanded && !leftSidebarVisible && (
        <button 
          className="absolute left-4 z-40 w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 shadow-lg flex items-center justify-center group hover:scale-110 transition-all"
          style={{ top: '20px' }}
          onClick={(e) => {
            e.stopPropagation();
            setShowDailyChallengeModal(true);
          }}
        >
          <Camera className="w-6 h-6 text-white" />
          <div className="absolute top-0 right-0 w-4 h-4 rounded-full bg-cyan-500 border-2 border-white flex items-center justify-center">
            <span className="text-[10px] text-white">!</span>
          </div>
          
          {/* Tooltip on hover */}
          <div className="absolute left-full ml-2 px-3 py-2 bg-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
            <p className="text-xs text-gray-900">Daily Challenge</p>
            <p className="text-[10px] text-gray-500">Golden Hour Glow</p>
          </div>
        </button>
      )}

      {/* Category Sidebar for All Tabs */}
      {!isMapExpanded && (
        <>
          {/* Left edge trigger zone */}
          <div
            className="absolute left-0 z-20 w-16 hover:bg-transparent"
            style={{ top: '220px', bottom: 0 }}
            onMouseEnter={() => setLeftSidebarVisible(true)}
            onClick={() => setLeftSidebarVisible(true)}
          />
          
          {/* Left peek tab */}
          {!leftSidebarVisible && (
            <div
              className="absolute left-0 z-20 w-8 h-16 bg-white/90 rounded-r-xl shadow-lg flex items-center justify-center cursor-pointer hover:w-10 transition-all"
              style={{ top: '50%', transform: 'translateY(-50%)' }}
              onClick={() => setLeftSidebarVisible(true)}
            >
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </div>
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
          {/* Right edge trigger zone */}
          <div
            className="absolute right-0 z-20 w-16 hover:bg-transparent"
            style={{ top: '128px', bottom: 0 }}
            onMouseEnter={() => setRightSidebarVisible(true)}
            onClick={() => setRightSidebarVisible(true)}
          />
          
          {/* Right peek tab */}
          {!rightSidebarVisible && (
            <div
              className="absolute right-0 z-20 w-8 h-16 bg-white/90 rounded-l-xl shadow-lg flex items-center justify-center cursor-pointer hover:w-10 transition-all"
              style={{ top: '50%', transform: 'translateY(-50%)' }}
              onClick={() => setRightSidebarVisible(true)}
            >
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </div>
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
          onPhotoSelect={onPhotoSelect}
        />
      )}

      {/* Daily Challenge Modal */}
      {showDailyChallengeModal && (
        <DailyChallengeModal
          onClose={() => setShowDailyChallengeModal(false)}
          submissions={challengeSubmissions}
          onVote={handleVote}
          challengeTitle="Golden Hour Glow"
          challengeDescription="Capture the perfect golden hour moment with warm, glowing light"
          endsIn="in 4 hours"
        />
      )}

      {/* Photo Upload Modal */}
      {showUploadModal && onUploadModalClose && (
        <PhotoUploadModal
          onClose={onUploadModalClose}
          onPhotosUploaded={handlePhotosUploaded}
        />
      )}
      
      {/* Timeline and Filters - Fixed at bottom above BottomNav */}
      <div className="absolute bottom-[10px] left-0 right-0 pointer-events-none">
        {/* Timeline Scrubber */}
        <div className="px-4 pointer-events-auto">
          <TimelineScrubber 
            photos={allPhotos}
            filter={timelineFilter}
            onTimeChange={handleTimelineChange}
            resetTrigger={timelineResetTrigger}
          />
        </div>
        
        {/* Timeline Filter Buttons */}
        <div className="relative flex items-center px-4 pointer-events-auto" onClick={(e) => e.stopPropagation()}>
          {/* Calendar icon - left side */}
          <div className="absolute left-4">
            <Calendar className="w-3.5 h-3.5 text-gray-700" />
          </div>
          
          {/* Centered filter buttons */}
          <div className="flex gap-2 justify-center flex-1">
            {(['daily', 'weekly', 'monthly', 'yearly'] as TimelineFilter[]).map((filter) => (
              <button
                key={filter}
                onClick={(e) => {
                  e.stopPropagation();
                  setTimelineFilter(filter);
                }}
                className={`px-2.5 py-0.5 rounded-full text-[10px] whitespace-nowrap transition-all ${
                  timelineFilter === filter
                    ? 'bg-cyan-500 text-white shadow-lg'
                    : 'bg-white/90 text-gray-700 shadow-md backdrop-blur-sm'
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
          
          {/* Photo count - right side */}
          <div className="absolute right-4 flex items-center gap-1 text-[10px] text-gray-700">
            <span>{photos.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
}