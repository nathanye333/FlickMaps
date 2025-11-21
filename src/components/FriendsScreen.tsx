import { Search, UserPlus, UserCheck, Clock, Check, X as XIcon } from 'lucide-react';
import { useState } from 'react';

interface User {
  username: string;
  avatar: string;
  location: string;
  photoCount: number;
  isPublic: boolean; // public or private account
}

interface FriendRequest {
  username: string;
  avatar: string;
  location: string;
  photoCount: number;
  timestamp: Date;
}

interface FriendsScreenProps {
  onPhotoSelect?: (photo: any) => void;
  onProfileClick?: (username: string) => void;
  onChallengeClick?: () => void;
}

export function FriendsScreen({ onPhotoSelect, onProfileClick, onChallengeClick }: FriendsScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'friends' | 'requests'>('friends');
  const [friends, setFriends] = useState<Set<string>>(new Set([
    'Sarah Chen',
    'Mike Wilson',
    'Emma Davis',
    'James Lee'
  ]));
  
  // Pending outgoing friend requests (waiting for them to accept)
  const [pendingRequests, setPendingRequests] = useState<Set<string>>(new Set([
    'Art Hunter' // Example: Art Hunter has a private account, so it's pending
  ]));
  
  // Incoming friend requests (people who want to add you)
  const [incomingRequests, setIncomingRequests] = useState<FriendRequest[]>([
    {
      username: 'Travel Bug',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
      location: 'San Diego, CA',
      photoCount: 78,
      timestamp: new Date('2025-11-20T14:30:00')
    },
    {
      username: 'Urban Lens',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop',
      location: 'Seattle, WA',
      photoCount: 67,
      timestamp: new Date('2025-11-19T10:15:00')
    }
  ]);

  // Mock users data with privacy settings
  const allUsers: User[] = [
    {
      username: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      location: 'San Francisco, CA',
      photoCount: 24,
      isPublic: true
    },
    {
      username: 'Mike Wilson',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      location: 'Oakland, CA',
      photoCount: 18,
      isPublic: true
    },
    {
      username: 'Emma Davis',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
      location: 'Berkeley, CA',
      photoCount: 31,
      isPublic: true
    },
    {
      username: 'James Lee',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
      location: 'San Jose, CA',
      photoCount: 15,
      isPublic: true
    },
    {
      username: 'Photography Pro',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
      location: 'Los Angeles, CA',
      photoCount: 142,
      isPublic: true
    },
    {
      username: 'Nature Explorer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
      location: 'Portland, OR',
      photoCount: 89,
      isPublic: true
    },
    {
      username: 'Urban Lens',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop',
      location: 'Seattle, WA',
      photoCount: 67,
      isPublic: false // Private account
    },
    {
      username: 'Foodie Adventures',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop',
      location: 'San Francisco, CA',
      photoCount: 52,
      isPublic: true
    },
    {
      username: 'Art Hunter',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop',
      location: 'Oakland, CA',
      photoCount: 43,
      isPublic: false // Private account
    },
    {
      username: 'Travel Bug',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
      location: 'San Diego, CA',
      photoCount: 78,
      isPublic: false // Private account
    }
  ];

  const filteredUsers = searchQuery
    ? allUsers.filter(user => 
        user.username.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allUsers;

  const handleAddFriend = (username: string, isPublic: boolean) => {
    if (isPublic) {
      // Public account - add immediately as friend
      setFriends(prev => new Set([...prev, username]));
    } else {
      // Private account - send friend request
      setPendingRequests(prev => new Set([...prev, username]));
    }
  };

  const handleRemoveFriend = (username: string) => {
    setFriends(prev => {
      const newFriends = new Set(prev);
      newFriends.delete(username);
      return newFriends;
    });
  };

  const handleCancelRequest = (username: string) => {
    setPendingRequests(prev => {
      const newRequests = new Set(prev);
      newRequests.delete(username);
      return newRequests;
    });
  };

  const handleAcceptRequest = (username: string) => {
    setIncomingRequests(prev => prev.filter(req => req.username !== username));
    setFriends(prev => new Set([...prev, username]));
  };

  const handleDeclineRequest = (username: string) => {
    setIncomingRequests(prev => prev.filter(req => req.username !== username));
  };

  const currentFriends = filteredUsers.filter(user => friends.has(user.username));
  const suggestedUsers = filteredUsers.filter(user => 
    !friends.has(user.username) && !pendingRequests.has(user.username)
  );
  const pendingUsers = filteredUsers.filter(user => pendingRequests.has(user.username));

  const getButtonForUser = (user: User) => {
    if (friends.has(user.username)) {
      return (
        <button
          onClick={() => handleRemoveFriend(user.username)}
          className="px-4 py-2 bg-cyan-500 text-white rounded-xl hover:bg-cyan-600 transition-colors flex items-center gap-2"
        >
          <UserCheck className="w-4 h-4" />
          <span className="text-sm">Friends</span>
        </button>
      );
    }
    
    if (pendingRequests.has(user.username)) {
      return (
        <button
          onClick={() => handleCancelRequest(user.username)}
          className="px-4 py-2 bg-orange-100 text-orange-600 rounded-xl hover:bg-orange-200 transition-colors flex items-center gap-2"
        >
          <Clock className="w-4 h-4" />
          <span className="text-sm">Pending</span>
        </button>
      );
    }
    
    return (
      <button
        onClick={() => handleAddFriend(user.username, user.isPublic)}
        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors flex items-center gap-2"
      >
        <UserPlus className="w-4 h-4" />
        <span className="text-sm">Add</span>
      </button>
    );
  };

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="p-4">
          <h1 className="text-2xl text-gray-900 mb-4">Friends</h1>
          
          {/* Tab Switcher */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setActiveTab('friends')}
              className={`flex-1 py-2.5 rounded-xl transition-all ${
                activeTab === 'friends'
                  ? 'bg-cyan-500 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              <span className="text-sm">My Friends</span>
            </button>
            
            <button
              onClick={() => setActiveTab('requests')}
              className={`flex-1 py-2.5 rounded-xl transition-all relative ${
                activeTab === 'requests'
                  ? 'bg-cyan-500 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              <span className="text-sm">Requests</span>
              {incomingRequests.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {incomingRequests.length}
                </span>
              )}
            </button>
          </div>
          
          {/* Search Bar - only show in friends tab */}
          {activeTab === 'friends' && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by username..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'friends' ? (
          <>
            {/* Current Friends */}
            {currentFriends.length > 0 && (
              <div className="p-4">
                <h2 className="text-gray-900 mb-3">
                  {searchQuery ? 'Friends' : `Your Friends (${currentFriends.length})`}
                </h2>
                <div className="space-y-2">
                  {currentFriends.map((user) => (
                    <div
                      key={user.username}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors"
                    >
                      <button
                        onClick={() => onProfileClick && onProfileClick(user.username)}
                        className="flex items-center gap-3 flex-1 min-w-0"
                      >
                        <img
                          src={user.avatar}
                          alt={user.username}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        
                        <div className="flex-1 min-w-0 text-left">
                          <p className="text-gray-900 truncate">{user.username}</p>
                          <p className="text-xs text-gray-500">{user.location}</p>
                        </div>
                        
                        <div className="text-right mr-2">
                          <p className="text-sm text-gray-900">{user.photoCount}</p>
                          <p className="text-xs text-gray-500">photos</p>
                        </div>
                      </button>
                      
                      {getButtonForUser(user)}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pending Requests (Outgoing) */}
            {pendingUsers.length > 0 && (
              <div className="p-4">
                <h2 className="text-gray-900 mb-3">Pending Requests</h2>
                <div className="space-y-2">
                  {pendingUsers.map((user) => (
                    <div
                      key={user.username}
                      className="flex items-center gap-3 p-3 bg-orange-50 rounded-2xl border border-orange-200"
                    >
                      <button
                        onClick={() => onProfileClick && onProfileClick(user.username)}
                        className="flex items-center gap-3 flex-1 min-w-0"
                      >
                        <img
                          src={user.avatar}
                          alt={user.username}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        
                        <div className="flex-1 min-w-0 text-left">
                          <p className="text-gray-900 truncate">{user.username}</p>
                          <p className="text-xs text-orange-600">Private Account</p>
                        </div>
                        
                        <div className="text-right mr-2">
                          <p className="text-sm text-gray-900">{user.photoCount}</p>
                          <p className="text-xs text-gray-500">photos</p>
                        </div>
                      </button>
                      
                      {getButtonForUser(user)}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Suggested Users */}
            {suggestedUsers.length > 0 && (
              <div className="p-4">
                <h2 className="text-gray-900 mb-3">
                  {searchQuery ? 'Search Results' : 'Suggested for You'}
                </h2>
                <div className="space-y-2">
                  {suggestedUsers.map((user) => (
                    <div
                      key={user.username}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors"
                    >
                      <button
                        onClick={() => onProfileClick && onProfileClick(user.username)}
                        className="flex items-center gap-3 flex-1 min-w-0"
                      >
                        <img
                          src={user.avatar}
                          alt={user.username}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        
                        <div className="flex-1 min-w-0 text-left">
                          <p className="text-gray-900 truncate">{user.username}</p>
                          <p className="text-xs text-gray-500">
                            {user.location} • {user.isPublic ? 'Public' : 'Private'}
                          </p>
                        </div>
                        
                        <div className="text-right mr-2">
                          <p className="text-sm text-gray-900">{user.photoCount}</p>
                          <p className="text-xs text-gray-500">photos</p>
                        </div>
                      </button>
                      
                      {getButtonForUser(user)}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No Results */}
            {searchQuery && filteredUsers.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 px-4">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-600 text-center">No users found matching "{searchQuery}"</p>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Incoming Friend Requests Tab */}
            {incomingRequests.length > 0 ? (
              <div className="p-4">
                <h2 className="text-gray-900 mb-3">Friend Requests ({incomingRequests.length})</h2>
                <div className="space-y-2">
                  {incomingRequests.map((request) => (
                    <div
                      key={request.username}
                      className="flex items-center gap-3 p-3 bg-cyan-50 rounded-2xl border border-cyan-200"
                    >
                      <button
                        onClick={() => onProfileClick && onProfileClick(request.username)}
                        className="flex items-center gap-3 flex-1 min-w-0"
                      >
                        <img
                          src={request.avatar}
                          alt={request.username}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        
                        <div className="flex-1 min-w-0 text-left">
                          <p className="text-gray-900 truncate">{request.username}</p>
                          <p className="text-xs text-gray-500">{request.location}</p>
                        </div>
                      </button>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAcceptRequest(request.username)}
                          className="p-2 bg-cyan-500 text-white rounded-xl hover:bg-cyan-600 transition-colors"
                        >
                          <Check className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeclineRequest(request.username)}
                          className="p-2 bg-gray-200 text-gray-600 rounded-xl hover:bg-gray-300 transition-colors"
                        >
                          <XIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 px-4">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                  <UserPlus className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-600 text-center">No pending friend requests</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}