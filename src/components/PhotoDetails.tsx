import { X, Heart, MessageCircle, Share2, MapPin, Lock, Users, Globe } from 'lucide-react';
import { Photo } from '../App';
import { useState } from 'react';

interface PhotoDetailsProps {
  photo: Photo;
  onClose: () => void;
  onViewOnMap?: () => void;
  onProfileClick?: (username: string) => void;
  onVisibilityChange?: (photoId: string, newVisibility: 'personal' | 'friends' | 'public') => void;
}

export function PhotoDetails({ photo, onClose, onViewOnMap, onProfileClick, onVisibilityChange }: PhotoDetailsProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(photo.likes);
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<Array<{ author: string; text: string }>>([]);
  const [currentVisibility, setCurrentVisibility] = useState(photo.visibility);
  const [showVisibilityMenu, setShowVisibilityMenu] = useState(false);
  
  const isOwnPhoto = photo.author === 'You';

  const handleVisibilityChange = (newVisibility: 'personal' | 'friends' | 'public') => {
    setCurrentVisibility(newVisibility);
    setShowVisibilityMenu(false);
    if (onVisibilityChange) {
      onVisibilityChange(photo.id, newVisibility);
    }
  };

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case 'personal': return <Lock className="w-4 h-4" />;
      case 'friends': return <Users className="w-4 h-4" />;
      case 'public': return <Globe className="w-4 h-4" />;
      default: return null;
    }
  };

  const getVisibilityLabel = (visibility: string) => {
    switch (visibility) {
      case 'personal': return 'Only Me';
      case 'friends': return 'Friends';
      case 'public': return 'Public';
      default: return '';
    }
  };

  const handleLike = () => {
    if (isLiked) {
      setLikeCount(likeCount - 1);
    } else {
      setLikeCount(likeCount + 1);
    }
    setIsLiked(!isLiked);
  };

  const handleComment = () => {
    setShowComments(!showComments);
  };

  const handleSubmitComment = () => {
    if (comment.trim()) {
      setComments([...comments, { author: 'You', text: comment }]);
      setComment('');
    }
  };

  const handleShare = () => {
    // Mock share functionality
    alert('Share functionality - would open native share dialog');
  };

  return (
    <div className="h-full bg-black relative flex flex-col">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center"
      >
        <X className="w-6 h-6 text-white" />
      </button>

      {/* Photo */}
      <div className="flex-1 relative">
        <img
          src={photo.imageUrl}
          alt={photo.caption || 'Photo'}
          className="w-full h-full object-cover"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/80 to-transparent" />
        
        {/* Photo Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="flex items-center gap-3 mb-3">
            <button 
              onClick={() => onProfileClick && onProfileClick(photo.author)}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center overflow-hidden hover:scale-110 transition-transform"
            >
              {photo.authorAvatar ? (
                <img src={photo.authorAvatar} alt={photo.author} className="w-full h-full object-cover" />
              ) : (
                <span className="text-sm">{photo.author[0]}</span>
              )}
            </button>
            <div className="flex-1">
              <button 
                onClick={() => onProfileClick && onProfileClick(photo.author)}
                className="text-sm hover:text-cyan-300 transition-colors"
              >
                {photo.author}
              </button>
              <p className="text-xs text-gray-300">
                {photo.timestamp.toLocaleDateString()} at {photo.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
          
          {photo.caption && (
            <p className="text-sm mb-3">{photo.caption}</p>
          )}
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-white border-t border-gray-200">
        <div className="flex items-center justify-around py-4 px-6">
          <button className="flex flex-col items-center gap-1" onClick={handleLike}>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
              isLiked ? 'bg-red-100' : 'bg-gray-100'
            }`}>
              <Heart className={`w-6 h-6 transition-colors ${
                isLiked ? 'text-red-500 fill-red-500' : 'text-gray-700'
              }`} />
            </div>
            <span className="text-xs text-gray-600">{likeCount}</span>
          </button>
          
          <button className="flex flex-col items-center gap-1" onClick={handleComment}>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
              showComments ? 'bg-cyan-100' : 'bg-gray-100'
            }`}>
              <MessageCircle className={`w-6 h-6 ${
                showComments ? 'text-cyan-600' : 'text-gray-700'
              }`} />
            </div>
            <span className="text-xs text-gray-600">Comment</span>
          </button>
          
          <button className="flex flex-col items-center gap-1" onClick={handleShare}>
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
              <Share2 className="w-6 h-6 text-gray-700" />
            </div>
            <span className="text-xs text-gray-600">Share</span>
          </button>
        </div>
      </div>

      {/* Map Snippet */}
      <div className="bg-white border-t border-gray-200">
        {showComments ? (
          <div className="p-4 max-h-64 overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm text-gray-900">Comments</h3>
              <button onClick={() => setShowComments(false)} className="text-xs text-cyan-500">
                Close
              </button>
            </div>
            
            {comments.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">No comments yet</p>
            ) : (
              <div className="space-y-3 mb-3">
                {comments.map((c, i) => (
                  <div key={i} className="flex gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white text-xs flex-shrink-0">
                      {c.author[0]}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-900">{c.author}</p>
                      <p className="text-sm text-gray-700">{c.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="flex gap-2">
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmitComment()}
                placeholder="Add a comment..."
                className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <button
                onClick={handleSubmitComment}
                className="px-4 py-2 bg-cyan-500 text-white rounded-xl text-sm hover:bg-cyan-600 transition-colors"
              >
                Post
              </button>
            </div>
          </div>
        ) : (
          <div className="p-4">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-cyan-500 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-gray-900 mb-2">Photo Location</p>
                <button
                  onClick={onViewOnMap}
                  className="w-full h-32 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl relative overflow-hidden hover:from-blue-200 hover:to-cyan-200 transition-colors"
                >
                  {/* Simplified Map View */}
                  <div className="absolute inset-0 opacity-20" style={{
                    backgroundImage: `
                      linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
                    `,
                    backgroundSize: '20px 20px'
                  }} />
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <MapPin className="w-8 h-8 text-cyan-500 fill-current drop-shadow-lg" />
                  </div>
                  <div className="absolute bottom-2 left-2 text-xs text-gray-500 bg-white/80 px-2 py-1 rounded">
                    {photo.lat.toFixed(4)}°, {photo.lng.toFixed(4)}°
                  </div>
                  <div className="absolute top-2 right-2 text-xs text-cyan-600 bg-white/90 px-2 py-1 rounded">
                    View on Map
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Visibility Controls */}
      {isOwnPhoto && (
        <div className="bg-white border-t border-gray-200 relative">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getVisibilityIcon(currentVisibility)}
                <span className="text-sm text-gray-900">
                  Visible to: <span className="text-cyan-600">{getVisibilityLabel(currentVisibility)}</span>
                </span>
              </div>
              <button
                onClick={() => setShowVisibilityMenu(!showVisibilityMenu)}
                className="px-4 py-2 bg-gray-100 rounded-xl text-sm text-gray-700 hover:bg-gray-200 transition-colors"
              >
                Change
              </button>
            </div>
          </div>
          
          {/* Visibility Dropdown Menu */}
          {showVisibilityMenu && (
            <>
              {/* Backdrop */}
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowVisibilityMenu(false)}
              />
              
              {/* Menu */}
              <div className="absolute bottom-full left-4 right-4 mb-2 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50">
                <button
                  onClick={() => handleVisibilityChange('personal')}
                  className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors ${
                    currentVisibility === 'personal' ? 'bg-cyan-50' : ''
                  }`}
                >
                  <Lock className="w-5 h-5 text-gray-700" />
                  <div className="flex-1 text-left">
                    <p className="text-sm text-gray-900">Only Me</p>
                    <p className="text-xs text-gray-500">Only you can see this photo</p>
                  </div>
                  {currentVisibility === 'personal' && (
                    <div className="w-2 h-2 rounded-full bg-cyan-500" />
                  )}
                </button>
                
                <button
                  onClick={() => handleVisibilityChange('friends')}
                  className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors border-t border-gray-100 ${
                    currentVisibility === 'friends' ? 'bg-cyan-50' : ''
                  }`}
                >
                  <Users className="w-5 h-5 text-gray-700" />
                  <div className="flex-1 text-left">
                    <p className="text-sm text-gray-900">Friends</p>
                    <p className="text-xs text-gray-500">Your friends can see this photo</p>
                  </div>
                  {currentVisibility === 'friends' && (
                    <div className="w-2 h-2 rounded-full bg-cyan-500" />
                  )}
                </button>
                
                <button
                  onClick={() => handleVisibilityChange('public')}
                  className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors border-t border-gray-100 ${
                    currentVisibility === 'public' ? 'bg-cyan-50' : ''
                  }`}
                >
                  <Globe className="w-5 h-5 text-gray-700" />
                  <div className="flex-1 text-left">
                    <p className="text-sm text-gray-900">Public</p>
                    <p className="text-xs text-gray-500">Everyone can see this photo</p>
                  </div>
                  {currentVisibility === 'public' && (
                    <div className="w-2 h-2 rounded-full bg-cyan-500" />
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}