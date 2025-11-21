import { Camera, TrendingUp, Trophy, MapPin, Heart, User as UserIcon } from 'lucide-react';
import { Photo } from '../App';
import { mockGlobalPhotos, mockDailyChallengeSubmissions } from '../data/mockData';
import { useState } from 'react';

interface ExploreScreenProps {
  onPhotoSelect: (photo: Photo) => void;
  onProfileClick?: (username: string) => void;
  onChallengeClick?: () => void;
}

export function ExploreScreen({ onPhotoSelect, onProfileClick, onChallengeClick }: ExploreScreenProps) {
  const [activeTab, setActiveTab] = useState<'trending' | 'challenges'>('trending');
  
  // Get trending photos (sorted by likes)
  const trendingPhotos = [...mockGlobalPhotos].sort((a, b) => b.likes - a.likes).slice(0, 12);
  
  // Get nearby trending photos (photos near SF area - within approx 50 miles)
  const userLat = 37.7749; // User's location (SF)
  const userLng = -122.4194;
  const nearbyPhotos = [...mockGlobalPhotos]
    .filter(photo => {
      const latDiff = Math.abs(photo.lat - userLat);
      const lngDiff = Math.abs(photo.lng - userLng);
      // Rough distance calculation - within ~50 miles
      return latDiff < 0.7 && lngDiff < 0.7;
    })
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 6);
  
  // Get challenge submissions
  const challengeSubmissions = mockDailyChallengeSubmissions;

  return (
    <div className="h-full bg-white overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="p-4">
          <h1 className="text-2xl text-gray-900 mb-4">Explore</h1>
          
          {/* Tab Switcher */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('trending')}
              className={`flex-1 py-2.5 rounded-xl transition-all ${
                activeTab === 'trending'
                  ? 'bg-cyan-500 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">Trending</span>
              </div>
            </button>
            
            <button
              onClick={() => setActiveTab('challenges')}
              className={`flex-1 py-2.5 rounded-xl transition-all ${
                activeTab === 'challenges'
                  ? 'bg-gradient-to-br from-orange-400 to-pink-500 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Camera className="w-4 h-4" />
                <span className="text-sm">Challenges</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {activeTab === 'trending' ? (
          <>
            {/* Trending Near You Section */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-cyan-500" />
                <h2 className="text-gray-900">Trending Near You</h2>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {nearbyPhotos.map((photo) => (
                  <div
                    key={photo.id}
                    onClick={() => onPhotoSelect(photo)}
                    className="group relative cursor-pointer"
                  >
                    <div className="aspect-square rounded-2xl overflow-hidden relative">
                      <img
                        src={photo.imageUrl}
                        alt={photo.caption || 'Photo'}
                        className="w-full h-full object-cover transition-transform group-hover:scale-110"
                      />
                      
                      {/* Author avatar in top-left */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onProfileClick) onProfileClick(photo.author);
                        }}
                        className="absolute top-2 left-2 w-8 h-8 rounded-full overflow-hidden border-2 border-white shadow-lg hover:scale-110 transition-transform"
                      >
                        <img
                          src={photo.authorAvatar}
                          alt={photo.author}
                          className="w-full h-full object-cover"
                        />
                      </button>
                      
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                      
                      {/* Info */}
                      <div className="absolute bottom-2 left-2 right-2">
                        <div className="flex items-center gap-1 mb-1">
                          <MapPin className="w-3 h-3 text-white" />
                          <p className="text-xs text-white line-clamp-1">
                            {photo.location.split(',')[0]}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="w-3 h-3 text-white fill-white" />
                          <span className="text-xs text-white">{photo.likes}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Trending Worldwide Section */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-cyan-500" />
                <h2 className="text-gray-900">Trending Worldwide</h2>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {trendingPhotos.map((photo) => (
                  <div
                    key={photo.id}
                    onClick={() => onPhotoSelect(photo)}
                    className="group relative cursor-pointer"
                  >
                    <div className="aspect-square rounded-2xl overflow-hidden relative">
                      <img
                        src={photo.imageUrl}
                        alt={photo.caption || 'Photo'}
                        className="w-full h-full object-cover transition-transform group-hover:scale-110"
                      />
                      
                      {/* Author avatar in top-left */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onProfileClick) onProfileClick(photo.author);
                        }}
                        className="absolute top-2 left-2 w-8 h-8 rounded-full overflow-hidden border-2 border-white shadow-lg hover:scale-110 transition-transform"
                      >
                        <img
                          src={photo.authorAvatar}
                          alt={photo.author}
                          className="w-full h-full object-cover"
                        />
                      </button>
                      
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                      
                      {/* Info */}
                      <div className="absolute bottom-2 left-2 right-2">
                        <div className="flex items-center gap-1 mb-1">
                          <MapPin className="w-3 h-3 text-white" />
                          <p className="text-xs text-white line-clamp-1">
                            {photo.location.split(',')[0]}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="w-3 h-3 text-white fill-white" />
                          <span className="text-xs text-white">{photo.likes}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Daily Challenge Section */}
            <div className="mb-6">
              <div className="p-4 bg-gradient-to-br from-orange-50 to-pink-50 rounded-2xl border border-orange-200 mb-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-gray-900">Today's Challenge</h3>
                    <p className="text-sm text-gray-600">Golden Hour Glow</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Ends in</p>
                    <p className="text-sm text-orange-600">4h 32m</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Capture the warm, magical light during golden hour. The best photo wins 25 challenge points!
                </p>
                <button
                  onClick={onChallengeClick}
                  className="w-full py-2.5 bg-gradient-to-r from-orange-400 to-pink-500 text-white rounded-xl hover:shadow-lg transition-shadow"
                >
                  Submit Your Photo
                </button>
              </div>

              {/* Challenge Submissions */}
              <div>
                <h3 className="text-gray-900 mb-3">Recent Submissions</h3>
                <div className="space-y-3">
                  {challengeSubmissions.map((submission) => (
                    <div
                      key={submission.id}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl"
                    >
                      {/* Photo thumbnail */}
                      <button
                        onClick={() => {
                          const photo = mockGlobalPhotos.find(p => p.id === submission.id);
                          if (photo) onPhotoSelect(photo);
                        }}
                        className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0"
                      >
                        <img
                          src={submission.photo.imageUrl}
                          alt={submission.photo.author}
                          className="w-full h-full object-cover"
                        />
                      </button>
                      
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <button
                          onClick={() => {
                            if (onProfileClick) onProfileClick(submission.photo.author);
                          }}
                          className="flex items-center gap-2 mb-1 hover:text-cyan-600 transition-colors"
                        >
                          <img
                            src={submission.photo.authorAvatar}
                            alt={submission.photo.author}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                          <span className="text-sm text-gray-900 truncate">{submission.photo.author}</span>
                        </button>
                        <p className="text-xs text-gray-500">
                          {submission.photo.timestamp.toLocaleDateString()}
                        </p>
                      </div>
                      
                      {/* Vote button */}
                      <button
                        disabled={submission.hasVoted}
                        className={`px-4 py-2 rounded-xl transition-all ${
                          submission.hasVoted
                            ? 'bg-gray-200 text-gray-500'
                            : 'bg-cyan-500 text-white hover:bg-cyan-600'
                        }`}
                      >
                        <div className="flex items-center gap-1">
                          <Trophy className="w-4 h-4" />
                          <span className="text-sm">{submission.votes}</span>
                        </div>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}