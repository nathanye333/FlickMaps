import { Camera, Upload, X } from 'lucide-react';

interface CameraOptionsModalProps {
  onTakePhoto: () => void;
  onUploadPhoto: () => void;
  onClose: () => void;
}

export function CameraOptionsModal({ onTakePhoto, onUploadPhoto, onClose }: CameraOptionsModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center" onClick={onClose}>
      <div 
        className="bg-white rounded-t-3xl w-full max-w-md pb-8 pt-4 px-4 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle Bar */}
        <div className="flex justify-center mb-4">
          <div className="w-12 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg text-gray-900">Add Photo</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Options */}
        <div className="space-y-3">
          <button
            onClick={onTakePhoto}
            className="w-full flex items-center gap-4 p-4 bg-gradient-to-br from-cyan-500 to-blue-500 text-white rounded-2xl hover:shadow-lg transition-all"
          >
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Camera className="w-6 h-6" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium">Take Photo</p>
              <p className="text-sm text-white/80">Capture with camera</p>
            </div>
          </button>

          <button
            onClick={onUploadPhoto}
            className="w-full flex items-center gap-4 p-4 bg-white border-2 border-gray-200 rounded-2xl hover:border-cyan-500 hover:bg-cyan-50 transition-all"
          >
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
              <Upload className="w-6 h-6 text-gray-700" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium text-gray-900">Upload from Device</p>
              <p className="text-sm text-gray-500">Must have GPS & date</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
