import { Settings, MapPin, Camera, Heart, Flame, Trophy, Globe, Lock } from 'lucide-react';
import { mockPersonalPhotos } from '../data/mockData';
import { Photo } from '../App';
import { useState } from 'react';

interface ProfileScreenProps {
  onPhotoSelect?: (photo: Photo) => void;
  onViewOnMap?: () => void;
  onSettings?: () => void;
}

export function ProfileScreen({ onPhotoSelect, onViewOnMap, onSettings }: ProfileScreenProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [isPublicAccount, setIsPublicAccount] = useState(true);

  const stats = [
    { icon: Camera, label: 'Photos', value: '47' },
    { icon: MapPin, label: 'Places', value: '23' },
    { icon: Heart, label: 'Likes', value: '342' },
    { icon: Trophy, label: 'Challenge Points', value: '85' },
  ];

  const handleSettings = () => {
    setShowSettings(true);
  };

  return (
    <div className="h-full bg-white overflow-y-auto">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h1 className="text-2xl mb-2 text-gray-900">Your Profile</h1>
            <p className="text-gray-500">Capturing moments, one pin at a time</p>
          </div>
          <button 
            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
            onClick={handleSettings}
          >
            <Settings className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Avatar */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white text-2xl">
            You
          </div>
          <div className="flex-1">
            <h2 className="text-gray-900">Alex Johnson</h2>
            <p className="text-sm text-gray-500">@alexj</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="w-12 h-12 mx-auto mb-2 rounded-2xl bg-gradient-to-br from-cyan-50 to-blue-50 flex items-center justify-center">
                <stat.icon className="w-5 h-5 text-cyan-600" />
              </div>
              <p className="text-sm text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Photo Grid */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-900">Your Photos</h3>
          <button 
            className="text-sm text-cyan-500 hover:text-cyan-600 transition-colors"
            onClick={onViewOnMap}
          >
            View on Map
          </button>
        </div>
        
        <div className="grid grid-cols-3 gap-2">
          {mockPersonalPhotos.map((photo) => (
            <div
              key={photo.id}
              className="aspect-square rounded-2xl overflow-hidden relative group cursor-pointer"
              onClick={() => onPhotoSelect && onPhotoSelect(photo)}
            >
              <img
                src={photo.imageUrl}
                alt={photo.caption || 'Photo'}
                className="w-full h-full object-cover transition-transform group-hover:scale-110"
              />
              {photo.likes > 0 && (
                <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                  <Heart className="w-3 h-3 text-white" />
                  <span className="text-xs text-white">{photo.likes}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Achievements Section */}
      <div className="p-4 border-t border-gray-200">
        <h3 className="text-gray-900 mb-4">Achievements</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-yellow-500 flex items-center justify-center text-xl">
              🌅
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">Golden Hour Master</p>
              <p className="text-xs text-gray-500">Captured 10 photos during golden hour</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-xl">
              🗺️
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">Explorer</p>
              <p className="text-xs text-gray-500">Visited 20+ unique locations</p>
            </div>
          </div>
        </div>
      </div>

      {/* Challenge Wins Section */}
      <div className="p-4 border-t border-gray-200">
        <h3 className="text-gray-900 mb-4">Daily Challenge Wins</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-orange-50 to-pink-50 rounded-2xl border border-orange-200">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">Best Sunset (Nov 18)</p>
              <p className="text-xs text-gray-500">Won with 24 votes</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-orange-600">+25 pts</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-orange-50 to-pink-50 rounded-2xl border border-orange-200">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">Urban Explorer (Nov 15)</p>
              <p className="text-xs text-gray-500">Won with 18 votes</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-orange-600">+25 pts</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-orange-50 to-pink-50 rounded-2xl border border-orange-200">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">Food Photography (Nov 12)</p>
              <p className="text-xs text-gray-500">Won with 21 votes</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-orange-600">+25 pts</p>
            </div>
          </div>
        </div>
        
        <div className="mt-4 p-4 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl text-center">
          <p className="text-2xl mb-1">🏆</p>
          <p className="text-sm text-gray-900 mb-1">Challenge Streak</p>
          <p className="text-xs text-gray-500">7 days participating in challenges</p>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center">
          <div className="bg-white rounded-t-3xl w-full max-w-md p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl text-gray-900">Privacy Settings</h2>
              <button
                onClick={() => setShowSettings(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Account Privacy Toggle */}
              <div className="p-4 bg-gray-50 rounded-2xl">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      isPublicAccount ? 'bg-cyan-100' : 'bg-orange-100'
                    }`}>
                      {isPublicAccount ? (
                        <Globe className="w-6 h-6 text-cyan-600" />
                      ) : (
                        <Lock className="w-6 h-6 text-orange-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900">Account Privacy</p>
                      <p className="text-xs text-gray-500">
                        {isPublicAccount ? 'Public Account' : 'Private Account'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsPublicAccount(!isPublicAccount)}
                    className={`relative w-14 h-8 rounded-full transition-colors ${
                      isPublicAccount ? 'bg-cyan-500' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                      isPublicAccount ? 'translate-x-6' : 'translate-x-0'
                    }`} />
                  </button>
                </div>
                
                <div className="pl-15">
                  {isPublicAccount ? (
                    <p className="text-xs text-gray-600">
                      Anyone can add you as a friend and see your public photos
                    </p>
                  ) : (
                    <p className="text-xs text-gray-600">
                      People must send a friend request that you can approve or decline
                    </p>
                  )}
                </div>
              </div>

              {/* Info Cards */}
              <div className="p-4 bg-cyan-50 rounded-2xl border border-cyan-200">
                <div className="flex items-start gap-3">
                  <Globe className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-900 mb-1">Public Account Benefits</p>
                    <p className="text-xs text-gray-600">
                      • Instant friend connections<br />
                      • Easier to be discovered<br />
                      • Grow your network faster
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-orange-50 rounded-2xl border border-orange-200">
                <div className="flex items-start gap-3">
                  <Lock className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-900 mb-1">Private Account Benefits</p>
                    <p className="text-xs text-gray-600">
                      • Control who follows you<br />
                      • Review all friend requests<br />
                      • More privacy and security
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowSettings(false)}
              className="mt-6 w-full py-3 bg-cyan-500 text-white rounded-xl hover:bg-cyan-600 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}