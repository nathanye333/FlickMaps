import { useState } from 'react';
import { X, Camera, MapPin, Globe, Users, Lock } from 'lucide-react';

interface PhotoCaptureProps {
  onComplete: () => void;
  onCancel: () => void;
}

export function PhotoCapture({ onComplete, onCancel }: PhotoCaptureProps) {
  const [step, setStep] = useState<'camera' | 'details'>('camera');
  const [caption, setCaption] = useState('');
  const [visibility, setVisibility] = useState<'personal' | 'friends' | 'public'>('friends');

  const handleCapture = () => {
    setStep('details');
  };

  const handlePost = () => {
    // In a real app, this would upload the photo
    onComplete();
  };

  if (step === 'camera') {
    return (
      <div className="h-full bg-black relative">
        {/* Camera View (Simulated) */}
        <div className="h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
          <div className="text-center">
            <Camera className="w-24 h-24 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500">Camera View</p>
          </div>
        </div>

        {/* Top Bar */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 bg-gradient-to-b from-black/50 to-transparent">
          <button onClick={onCancel} className="w-10 h-10 rounded-full bg-black/30 flex items-center justify-center">
            <X className="w-6 h-6 text-white" />
          </button>
          
          <div className="flex items-center gap-2 bg-black/50 rounded-full px-3 py-2">
            <MapPin className="w-4 h-4 text-cyan-400" />
            <span className="text-white text-sm">San Francisco, CA</span>
          </div>
        </div>

        {/* Capture Button */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center">
          <button
            onClick={handleCapture}
            className="w-20 h-20 rounded-full bg-white shadow-xl flex items-center justify-center border-4 border-gray-800"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <button onClick={onCancel} className="text-gray-600">
          Cancel
        </button>
        <h2 className="text-gray-900">New Post</h2>
        <button onClick={handlePost} className="text-cyan-500">
          Post
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Photo Preview */}
        <div className="w-full aspect-square bg-gradient-to-br from-gray-200 to-gray-300 rounded-3xl overflow-hidden">
          <div className="w-full h-full flex items-center justify-center">
            <Camera className="w-16 h-16 text-gray-400" />
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
          <MapPin className="w-5 h-5 text-cyan-500" />
          <div className="flex-1">
            <p className="text-sm text-gray-900">San Francisco, CA</p>
            <p className="text-xs text-gray-500">37.7749° N, 122.4194° W</p>
          </div>
        </div>

        {/* Caption */}
        <div>
          <label className="block text-sm text-gray-700 mb-2">Caption (optional)</label>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Write a caption..."
            className="w-full p-4 border border-gray-200 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-cyan-400"
            rows={3}
          />
        </div>

        {/* Visibility */}
        <div>
          <label className="block text-sm text-gray-700 mb-3">Who can see this?</label>
          <div className="space-y-2">
            <button
              onClick={() => setVisibility('personal')}
              className={`w-full flex items-center gap-3 p-4 rounded-2xl border-2 transition-all ${
                visibility === 'personal'
                  ? 'border-cyan-500 bg-cyan-50'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <Lock className="w-5 h-5 text-gray-600" />
              <div className="flex-1 text-left">
                <p className="text-sm text-gray-900">Just Me</p>
                <p className="text-xs text-gray-500">Private to your map</p>
              </div>
            </button>

            <button
              onClick={() => setVisibility('friends')}
              className={`w-full flex items-center gap-3 p-4 rounded-2xl border-2 transition-all ${
                visibility === 'friends'
                  ? 'border-cyan-500 bg-cyan-50'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <Users className="w-5 h-5 text-gray-600" />
              <div className="flex-1 text-left">
                <p className="text-sm text-gray-900">Friends</p>
                <p className="text-xs text-gray-500">Share with friends</p>
              </div>
            </button>

            <button
              onClick={() => setVisibility('public')}
              className={`w-full flex items-center gap-3 p-4 rounded-2xl border-2 transition-all ${
                visibility === 'public'
                  ? 'border-cyan-500 bg-cyan-50'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <Globe className="w-5 h-5 text-gray-600" />
              <div className="flex-1 text-left">
                <p className="text-sm text-gray-900">Public</p>
                <p className="text-xs text-gray-500">Visible on global map</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
