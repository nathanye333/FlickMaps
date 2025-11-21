import { ArrowLeft, Users, Settings, MapPin } from 'lucide-react';
import { useState, useRef } from 'react';
import { Photo } from '../App';
import { PhotoPin } from './PhotoPin';

interface GroupMapViewProps {
  groupId: string;
  groupName: string;
  onBack: () => void;
  onPhotoSelect: (photo: Photo) => void;
  onProfileClick?: (username: string) => void;
}

export function GroupMapView({ groupId, groupName, onBack, onPhotoSelect, onProfileClick }: GroupMapViewProps) {
  const [mapOffset, setMapOffset] = useState({ x: 0, y: 0 });
  const [mapZoom, setMapZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Mock group photos - in a real app, this would be fetched based on groupId
  const groupPhotos: Photo[] = [
    {
      id: 'group-1',
      imageUrl: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400',
      lat: 48.8566,
      lng: 2.3522,
      location: 'Paris, France',
      caption: 'Eiffel Tower at sunset',
      author: 'Sarah Chen',
      authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      timestamp: new Date('2025-11-15'),
      likes: 24,
      visibility: 'friends',
      category: 'Travel'
    },
    {
      id: 'group-2',
      imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400',
      lat: 48.8606,
      lng: 2.3376,
      location: 'Louvre, Paris',
      caption: 'Museum day',
      author: 'Mike Wilson',
      authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      timestamp: new Date('2025-11-16'),
      likes: 18,
      visibility: 'friends',
      category: 'Art'
    },
    {
      id: 'group-3',
      imageUrl: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=400',
      lat: 48.8530,
      lng: 2.3499,
      location: 'Notre-Dame, Paris',
      caption: 'Historic architecture',
      author: 'Emma Davis',
      authorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
      timestamp: new Date('2025-11-17'),
      likes: 31,
      visibility: 'friends',
      category: 'Architecture'
    },
  ];

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - mapOffset.x,
      y: e.clientY - mapOffset.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setMapOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-white via-white to-transparent pb-8">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={onBack}
                className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-gray-900">{groupName}</h1>
                <p className="text-xs text-gray-500">{groupPhotos.length} photos</p>
              </div>
            </div>
            
            <button className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all">
              <Settings className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div 
        ref={mapContainerRef}
        className="flex-1 relative overflow-hidden bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 cursor-move"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Map Background Pattern */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(14, 165, 233, 0.05) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(14, 165, 233, 0.05) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            transform: `translate(${mapOffset.x}px, ${mapOffset.y}px) scale(${mapZoom})`,
          }}
        />

        {/* Photo Pins */}
        <div
          className="absolute inset-0"
          style={{
            transform: `translate(${mapOffset.x}px, ${mapOffset.y}px) scale(${mapZoom})`,
            transformOrigin: '0 0'
          }}
        >
          {groupPhotos.map((photo, index) => {
            const x = 50 + (index * 120);
            const y = 150 + (index % 2 === 0 ? 0 : 100);
            
            return (
              <div
                key={photo.id}
                className="absolute"
                style={{
                  left: `${x}px`,
                  top: `${y}px`,
                }}
              >
                <PhotoPin
                  photo={photo}
                  onClick={() => onPhotoSelect(photo)}
                  onAuthorClick={() => onProfileClick && onProfileClick(photo.author)}
                  size="large"
                  showAuthor={true}
                />
              </div>
            );
          })}
        </div>

        {/* Map Controls */}
        <div className="absolute bottom-6 right-4 z-40 flex flex-col gap-2">
          <button
            onClick={() => setMapZoom(prev => Math.min(prev + 0.2, 3))}
            className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <span className="text-xl text-gray-600">+</span>
          </button>
          <button
            onClick={() => setMapZoom(prev => Math.max(prev - 0.2, 0.5))}
            className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <span className="text-xl text-gray-600">-</span>
          </button>
        </div>
      </div>

      {/* Group Members Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {groupPhotos.slice(0, 5).map((photo, idx) => (
                <img
                  key={idx}
                  src={photo.authorAvatar}
                  alt={photo.author}
                  className="w-8 h-8 rounded-full border-2 border-white object-cover"
                />
              ))}
            </div>
            <div>
              <p className="text-sm text-gray-900">5 members</p>
              <p className="text-xs text-gray-500">Active group</p>
            </div>
          </div>
          
          <button className="px-4 py-2 bg-cyan-500 text-white rounded-xl hover:bg-cyan-600 transition-colors flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span className="text-sm">Invite</span>
          </button>
        </div>
      </div>
    </div>
  );
}
