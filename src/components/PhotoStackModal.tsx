import { X } from 'lucide-react';
import { Photo } from '../App';

interface PhotoStackModalProps {
  photos: Photo[];
  onClose: () => void;
  onPhotoSelect: (photo: Photo) => void;
}

export function PhotoStackModal({ photos, onClose, onPhotoSelect }: PhotoStackModalProps) {
  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg text-gray-900">
            {photos.length} Photos at this location
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Photo Grid */}
        <div className="p-4 overflow-y-auto max-h-[calc(80vh-80px)]">
          <div className="grid grid-cols-2 gap-3">
            {photos.map((photo, index) => (
              <button
                key={photo.id}
                onClick={() => {
                  onPhotoSelect(photo);
                  onClose();
                }}
                className="relative aspect-square rounded-xl overflow-hidden group hover:scale-[1.02] transition-transform"
              >
                <img
                  src={photo.imageUrl}
                  alt={photo.caption || `Photo ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                
                {/* Profile Picture in Top-Left Corner */}
                <div className="absolute top-2 left-2 w-8 h-8 rounded-full overflow-hidden border-2 border-white shadow-md z-10">
                  <img
                    src={photo.authorAvatar}
                    alt={photo.author}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="text-white text-sm">
                      {photo.caption || `Photo ${index + 1}`}
                    </p>
                    <p className="text-white/70 text-xs mt-1">
                      {photo.timestamp.toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}