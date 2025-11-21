import { useState } from 'react';
import { ChevronLeft, ChevronRight, TrendingUp, MapPin } from 'lucide-react';
import { Photo } from '../App';

interface TrendingSidebarProps {
  photos: Photo[];
  onPhotoClick: (photo: Photo) => void;
  isMapExpanded: boolean;
  isVisible: boolean;
  onVisibilityChange: (visible: boolean) => void;
}

export function TrendingSidebar({ photos, onPhotoClick, isMapExpanded, isVisible, onVisibilityChange }: TrendingSidebarProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Filter photos within a certain radius (mock logic - in reality would use geolocation)
  const nearbyPhotos = photos.slice(0, 8);

  return (
    <>
      {/* Backdrop to close sidebar */}
      {isVisible && (
        <div
          className="absolute inset-0 z-20 bg-black/10 transition-opacity duration-300"
          onClick={() => onVisibilityChange(false)}
        />
      )}
      
      <div 
        className={`absolute right-0 z-30 transition-all duration-300 ease-in-out ${
          isExpanded ? 'w-72' : 'w-12'
        } ${
          isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        }`}
        style={{ 
          top: '50%', 
          transform: isVisible ? 'translateY(-50%)' : 'translate(100%, -50%)',
          height: '420px'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-full bg-white/95 backdrop-blur-sm shadow-lg rounded-l-2xl">
          {/* Toggle Button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-12 bg-white rounded-l-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors z-10"
          >
            {isExpanded ? (
              <ChevronRight className="w-4 h-4 text-gray-600" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            )}
          </button>

          {/* Content */}
          <div className="h-full overflow-y-auto">
            {isExpanded ? (
              <div className="p-4 space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-cyan-500" />
                  <h3 className="text-sm text-gray-900">Trending Near You</h3>
                </div>
                
                <div className="space-y-3">
                  {nearbyPhotos.length > 0 ? (
                    nearbyPhotos.map((photo) => (
                      <button
                        key={photo.id}
                        onClick={() => onPhotoClick(photo)}
                        className="w-full group"
                      >
                        <div className="relative aspect-square rounded-xl overflow-hidden mb-2">
                          <img
                            src={photo.imageUrl}
                            alt={photo.caption || 'Photo'}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="absolute bottom-2 left-2 right-2">
                              <p className="text-white text-xs line-clamp-2">
                                {photo.caption || 'View photo'}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-start gap-2 px-1">
                          <MapPin className="w-3 h-3 text-cyan-500 flex-shrink-0 mt-0.5" />
                          <div className="flex-1 text-left">
                            <p className="text-xs text-gray-600 line-clamp-1">
                              {photo.location}
                            </p>
                            <p className="text-[10px] text-gray-400">
                              {photo.timestamp.toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-400 text-sm">
                      No trending photos nearby
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <button
                  onClick={() => setIsExpanded(true)}
                  className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
                  title="Trending Near You"
                >
                  <TrendingUp className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}