import { ArrowLeft, User, Users, UserPlus } from 'lucide-react';
import { Photo } from '../App';
import { getUserPhotos, isFriend } from '../data/mockData';
import { useState, useRef, useEffect, useMemo } from 'react';
import { PhotoPin } from './PhotoPin';
import { PhotoStackModal } from './PhotoStackModal';
import { Plus, Minus } from 'lucide-react';

interface UserMapScreenProps {
  username: string;
  onBack: () => void;
  onPhotoSelect: (photo: Photo) => void;
  onProfileClick: (username: string) => void;
}

interface PhotoPosition {
  x: number;
  y: number;
  photos: Photo[];
  displayPosition?: { x: number, y: number };
  photoSize?: number;
  showPin?: boolean;
}

export function UserMapScreen({ username, onBack, onPhotoSelect, onProfileClick }: UserMapScreenProps) {
  const userPhotos = getUserPhotos(username);
  const isFriended = isFriend(username);
  const isOwnProfile = username === 'You';

  // Get user avatar from photos
  const userAvatar = userPhotos.length > 0 ? userPhotos[0].authorAvatar : '';

  // Map state
  const [mapOffset, setMapOffset] = useState({ x: 0, y: 0 });
  const [mapZoom, setMapZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hasDragged, setHasDragged] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [selectedStack, setSelectedStack] = useState<Photo[] | null>(null);

  // Calculate adaptive photo size based on zoom
  const photoSize = useMemo(() => {
    if (!mapContainerRef.current) return 120;
    
    const containerWidth = mapContainerRef.current.clientWidth;
    const containerHeight = mapContainerRef.current.clientHeight;
    const maxDimension = Math.min(containerWidth, containerHeight);
    
    const baseSize = 120;
    const zoomFactor = Math.pow(mapZoom, 1.5);
    const calculatedSize = baseSize * zoomFactor;
    
    const maxSize = maxDimension * 0.8;
    
    return Math.max(100, Math.min(maxSize, calculatedSize));
  }, [mapZoom]);

  // Convert lat/lng to screen coordinates
  const latLngToScreen = (lat: number, lng: number, containerWidth: number, containerHeight: number) => {
    if (userPhotos.length === 0) {
      return { x: containerWidth / 2, y: containerHeight / 2 };
    }

    const lats = userPhotos.map(p => p.lat);
    const lngs = userPhotos.map(p => p.lng);
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

    const scale = baseScale * mapZoom;

    const x = containerWidth / 2 + (lng - centerLng) * scale + mapOffset.x;
    const y = containerHeight / 2 - (lat - centerLat) * scale + mapOffset.y;

    return { x, y };
  };

  // Group photos and layout
  const photoPositions = useMemo(() => {
    if (!mapContainerRef.current || userPhotos.length === 0) return [];
    
    const containerWidth = mapContainerRef.current.clientWidth;
    const containerHeight = mapContainerRef.current.clientHeight;

    const lats = userPhotos.map(p => p.lat);
    const lngs = userPhotos.map(p => p.lng);
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

    const overlapPixels = photoSize * 0.3;
    const gpsThreshold = overlapPixels / currentScale;

    const screenPositions = userPhotos.map(photo => {
      const pos = latLngToScreen(photo.lat, photo.lng, containerWidth, containerHeight);
      return { photo, ...pos };
    });

    const groups: PhotoPosition[] = [];
    const used = new Set<number>();

    screenPositions.forEach((pos, index) => {
      if (used.has(index)) return;

      const group: Photo[] = [pos.photo];
      used.add(index);

      screenPositions.forEach((otherPos, otherIndex) => {
        if (used.has(otherIndex)) return;

        const latDiff = Math.abs(pos.photo.lat - otherPos.photo.lat);
        const lngDiff = Math.abs(pos.photo.lng - otherPos.photo.lng);
        
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

    const layouted = groups.map(group => ({
      ...group,
      displayPosition: { x: group.x, y: group.y }
    }));

    const halfPhotoSize = photoSize / 2;
    const margin = 20;
    
    layouted.forEach(item => {
      const pos = item.displayPosition!;
      
      const clampedX = Math.max(halfPhotoSize + margin, Math.min(containerWidth - halfPhotoSize - margin, pos.x));
      const clampedY = Math.max(halfPhotoSize + margin, Math.min(containerHeight - halfPhotoSize - margin, pos.y));
      
      item.displayPosition = { x: clampedX, y: clampedY };
    });

    layouted.forEach(item => {
      const dx = item.displayPosition!.x - item.x;
      const dy = item.displayPosition!.y - item.y;
      const moved = Math.sqrt(dx * dx + dy * dy) > 10;
      item.showPin = moved;
    });
    
    return layouted;
  }, [userPhotos, photoSize, mapOffset.x, mapOffset.y, mapZoom]);

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

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 z-50">
        <button
          onClick={() => {
            onBack();
            // Clear the selected stack when going back
            setSelectedStack(null);
          }}
          className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center overflow-hidden">
            {userAvatar ? (
              <img src={userAvatar} alt={username} className="w-full h-full object-cover" />
            ) : (
              <User className="w-5 h-5 text-white" />
            )}
          </div>
          
          <div className="flex-1">
            <h1 className="text-gray-900">{username}</h1>
            <p className="text-xs text-gray-500">
              {isFriended ? (
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  Friend
                </span>
              ) : isOwnProfile ? (
                <span>Your Map</span>
              ) : (
                <span>Public Photos</span>
              )}
            </p>
          </div>

          {!isOwnProfile && !isFriended && (
            <button 
              className="px-4 py-2 bg-cyan-500 text-white rounded-xl text-sm hover:bg-cyan-600 transition-colors flex items-center gap-2"
              onClick={() => alert('Friend request sent!')}
            >
              <UserPlus className="w-4 h-4" />
              Add Friend
            </button>
          )}
        </div>
      </div>

      {/* User Stats */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-around">
        <div className="text-center">
          <p className="text-gray-900">{userPhotos.length}</p>
          <p className="text-xs text-gray-500">Photos</p>
        </div>
        <div className="text-center">
          <p className="text-gray-900">{userPhotos.reduce((sum, p) => sum + p.likes, 0)}</p>
          <p className="text-xs text-gray-500">Likes</p>
        </div>
        <div className="text-center">
          <p className="text-gray-900">{new Set(userPhotos.map(p => p.category)).size}</p>
          <p className="text-xs text-gray-500">Categories</p>
        </div>
      </div>

      {/* Info message if no photos or limited access */}
      {userPhotos.length === 0 && (
        <div className="flex-1 flex items-center justify-center px-6 text-center">
          <div>
            <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-900 mb-2">No Photos Available</p>
            <p className="text-sm text-gray-500">
              {isFriended 
                ? `${username} hasn't shared any photos yet.`
                : `Add ${username} as a friend to see more photos!`
              }
            </p>
          </div>
        </div>
      )}

      {/* Map with user's photos */}
      {userPhotos.length > 0 && (
        <div className="flex-1 relative overflow-hidden">
          {/* Map Background */}
          <div
            ref={mapContainerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
            className={`w-full h-full relative bg-cover bg-center overflow-hidden ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
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

            {/* Photo Pins */}
            {photoPositions.map((position, index) => (
              <PhotoPin
                key={`photo-${index}`}
                photos={position.photos}
                onClick={(photo) => {
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
                priorityPhotoId={null}
                onProfileClick={onProfileClick}
              />
            ))}

            {/* Zoom Controls */}
            <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
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

            {/* Map Attribution */}
            <div className="absolute bottom-4 left-4 text-xs text-gray-400 bg-white/80 px-2 py-1 rounded pointer-events-none">
              {username}'s Map
            </div>

            {/* Info Banner */}
            <div className="absolute top-4 left-4 bg-white/90 px-3 py-2 rounded-xl shadow-sm pointer-events-none">
              <p className="text-xs text-gray-600">
                {userPhotos.length} {isFriended ? 'friend & public' : 'public'} {userPhotos.length === 1 ? 'photo' : 'photos'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Photo Stack Modal */}
      {selectedStack && (
        <PhotoStackModal
          photos={selectedStack}
          onClose={() => setSelectedStack(null)}
          onPhotoSelect={onPhotoSelect}
        />
      )}
    </div>
  );
}