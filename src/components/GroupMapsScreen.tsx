import { ArrowLeft, Plus, Users as UsersIcon } from 'lucide-react';
import { useState } from 'react';

interface Group {
  id: string;
  name: string;
  memberCount: number;
  members: {
    username: string;
    avatar: string;
  }[];
  mapPreview: string;
  lastUpdated: string;
  photoCount: number;
}

interface GroupMapsScreenProps {
  onBack: () => void;
  onGroupSelect: (groupId: string) => void;
  onCreateGroup: () => void;
}

export function GroupMapsScreen({ onBack, onGroupSelect, onCreateGroup }: GroupMapsScreenProps) {
  // Mock groups data
  const groups: Group[] = [
    {
      id: 'europe-trip',
      name: 'Europe Trip',
      memberCount: 5,
      members: [
        { username: 'Sarah Chen', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop' },
        { username: 'Mike Wilson', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop' },
        { username: 'Emma Davis', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop' },
      ],
      mapPreview: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=400&fit=crop',
      lastUpdated: '2 days ago',
      photoCount: 47
    },
    {
      id: 'photography-club',
      name: 'Photography Club',
      memberCount: 12,
      members: [
        { username: 'Photography Pro', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop' },
        { username: 'Nature Explorer', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop' },
        { username: 'Urban Lens', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop' },
      ],
      mapPreview: 'https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?w=400&h=400&fit=crop',
      lastUpdated: '5 hours ago',
      photoCount: 124
    },
    {
      id: 'family',
      name: 'Family',
      memberCount: 8,
      members: [
        { username: 'Emma Davis', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop' },
        { username: 'James Lee', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop' },
        { username: 'Sarah Chen', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop' },
      ],
      mapPreview: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&h=400&fit=crop',
      lastUpdated: '1 week ago',
      photoCount: 89
    },
    {
      id: 'bay-area-explorers',
      name: 'Bay Area Explorers',
      memberCount: 15,
      members: [
        { username: 'Foodie Adventures', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop' },
        { username: 'Art Hunter', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop' },
        { username: 'Travel Bug', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop' },
      ],
      mapPreview: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
      lastUpdated: '3 days ago',
      photoCount: 67
    },
  ];

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <h1 className="text-2xl text-gray-900">Group Maps</h1>
          </div>
          
          <p className="text-sm text-gray-500">
            Share photos and explore locations with your groups
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 gap-3">
          {/* Create New Group Card */}
          <button
            onClick={onCreateGroup}
            className="aspect-square rounded-2xl border-2 border-dashed border-gray-300 hover:border-cyan-500 hover:bg-cyan-50 transition-all flex flex-col items-center justify-center gap-2 group"
          >
            <div className="w-14 h-14 rounded-full bg-gray-100 group-hover:bg-cyan-100 flex items-center justify-center transition-colors">
              <Plus className="w-7 h-7 text-gray-400 group-hover:text-cyan-600 transition-colors" />
            </div>
            <p className="text-sm text-gray-600 group-hover:text-cyan-600 transition-colors">
              Create Group
            </p>
          </button>

          {/* Group Cards */}
          {groups.map((group) => (
            <button
              key={group.id}
              onClick={() => onGroupSelect(group.id)}
              className="aspect-square rounded-2xl overflow-hidden relative group hover:shadow-lg transition-all"
            >
              {/* Map Preview with Blur Overlay */}
              <div className="absolute inset-0">
                <img
                  src={group.mapPreview}
                  alt={group.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              </div>

              {/* Content */}
              <div className="absolute inset-0 p-3 flex flex-col justify-between">
                {/* Top: Photo Count Badge */}
                <div className="flex justify-end">
                  <div className="bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                    <span className="text-xs text-gray-900">{group.photoCount}</span>
                    <span className="text-xs text-gray-500">photos</span>
                  </div>
                </div>

                {/* Bottom: Group Info */}
                <div>
                  <h3 className="text-white text-left mb-1 line-clamp-2">
                    {group.name}
                  </h3>
                  
                  {/* Member Avatars */}
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex -space-x-2">
                      {group.members.slice(0, 3).map((member, idx) => (
                        <img
                          key={idx}
                          src={member.avatar}
                          alt={member.username}
                          className="w-6 h-6 rounded-full border-2 border-white object-cover"
                        />
                      ))}
                      {group.memberCount > 3 && (
                        <div className="w-6 h-6 rounded-full border-2 border-white bg-cyan-500 flex items-center justify-center">
                          <span className="text-xs text-white">+{group.memberCount - 3}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Last Updated */}
                  <p className="text-xs text-white/80">
                    Updated {group.lastUpdated}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
