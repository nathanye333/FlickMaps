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
      // Move priority photo to the front
      const priorityPhoto = reorderedPhotos.splice(priorityIndex, 1)[0];
      reorderedPhotos = [priorityPhoto, ...reorderedPhotos];
    }
  }
  
  // Sort remaining photos by likes (highest first), but keep priority photo at front
  const hasStackPriority = priorityPhotoId && photos.some(p => p.id === priorityPhotoId);
  const sortedPhotos = hasStackPriority 
    ? [reorderedPhotos[0], ...reorderedPhotos.slice(1).sort((a, b) => b.likes - a.likes)]
    : reorderedPhotos.sort((a, b) => b.likes - a.likes);
    
  const photo = sortedPhotos[0]; // Primary photo for this location
  const count = sortedPhotos.length;
  
  // Get unique authors for avatar display (up to 3)
  const uniqueAuthors = Array.from(new Map(sortedPhotos.map(p => [p.author, p])).values());
  const displayAuthors = uniqueAuthors.slice(0, 3);
  const remainingCount = uniqueAuthors.length - 3;
  
  // Use display position if provided, otherwise use actual position
  const finalPosition = displayPosition || position;

  const handleAvatarClick = (e: React.MouseEvent, author: string) => {
    e.stopPropagation();
    if (onProfileClick) {
      onProfileClick(author);
    }
  };

  return (
    <>
      {/* Connection line from actual location to photo (only if photo is offset) */}
      {showPin && displayPosition && (
        <svg 
          className="absolute pointer-events-none z-5"
          style={{
            left: 0,
            top: 0,
            width: '100%',
            height: '100%'
          }}
        >
          <line
            x1={position.x}
            y1={position.y}
            x2={displayPosition.x}
            y2={displayPosition.y}
            stroke="rgba(6, 182, 212, 0.4)"
            strokeWidth="2"
            strokeDasharray="4,4"
          />
        </svg>
      )}

      {/* Photo at display position - scales with zoom */}
      <button
        onClick={() => onClick(photo)}
        className="absolute transform -translate-x-1/2 group z-10"
        style={{ 
          left: `${finalPosition.x}px`, 
          top: `${finalPosition.y}px`,
          // Translate to align bottom of pin with location point
          transform: `translate(-50%, ${showPin ? `-${photoSize + 8}px` : `-${photoSize / 2}px`})`
        }}
      >
        {/* Photo Preview Thumbnail */}
        <div className="relative">
          <div 
            className="rounded-xl overflow-hidden border-2 border-white shadow-lg transition-all group-hover:scale-105 group-hover:shadow-xl"
            style={{ width: `${photoSize}px`, height: `${photoSize}px` }}
          >
            <img
              src={photo.imageUrl}
              alt={photo.caption || 'Photo'}
              className="w-full h-full object-cover"
            />
            
            {/* Author Avatars - top left corner, stacked horizontally */}
            <div 
              className="absolute top-0 left-0 flex items-center"
              style={{ 
                margin: `${Math.max(4, photoSize * 0.04)}px`,
                gap: `${Math.max(2, photoSize * 0.02)}px`
              }}
            >
              {displayAuthors.map((authorPhoto, index) => (
                <div 
                  key={index}
                  className="rounded-full border-2 border-white shadow-md overflow-hidden bg-white flex items-center justify-center"
                  style={{ 
                    width: `${Math.max(24, photoSize * 0.22)}px`, 
                    height: `${Math.max(24, photoSize * 0.22)}px`,
                  }}
                >
                  <img
                    src={authorPhoto.authorAvatar}
                    alt={authorPhoto.author}
                    className="w-full h-full object-cover"
                    onClick={(e) => handleAvatarClick(e, authorPhoto.author)}
                  />
                </div>
              ))}
              
              {/* Remaining authors indicator */}
              {remainingCount > 0 && (
                <div 
                  className="rounded-full border-2 border-white shadow-md bg-gray-100 flex items-center justify-center"
                  style={{ 
                    width: `${Math.max(24, photoSize * 0.22)}px`, 
                    height: `${Math.max(24, photoSize * 0.22)}px`,
                    fontSize: `${Math.max(8, photoSize * 0.08)}px`
                  }}
                >
                  <span className="text-gray-700">+{remainingCount}</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Location pin appendage at bottom center of photo */}
          <div className="absolute left-1/2 -translate-x-1/2" style={{ top: '100%' }}>
            {/* Pin stem */}
            <div 
              className="w-0.5 bg-cyan-500 mx-auto"
              style={{ height: '8px' }}
            />
            {/* Pin point */}
            <div className="w-2 h-2 rounded-full bg-cyan-500 border border-white -mt-0.5 mx-auto" />
          </div>
          
          {/* Stack Count Indicator */}
          {count > 1 && (
            <div 
              className="absolute -top-2 -right-2 bg-cyan-500 rounded-full border-2 border-white flex items-center justify-center shadow-lg"
              style={{ 
                minWidth: `${Math.max(22, photoSize * 0.2)}px`,
                minHeight: `${Math.max(22, photoSize * 0.2)}px`,
                fontSize: `${Math.max(10, photoSize * 0.1)}px`,
                fontWeight: 600,
                padding: '2px 6px'
              }}
            >
              <span className="text-white">{count}</span>
            </div>
          )}
        </div>
      </button>
    </>
  );
}