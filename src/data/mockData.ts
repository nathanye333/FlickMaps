import { Photo } from '../App';

// Avatar URLs for users
const avatars = {
  you: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
  sarah: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
  mike: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
  emma: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
  james: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
  photographer: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
  nature: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
  urban: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop',
  foodie: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop',
  art: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop',
};

// Mock data for personal photos
export const mockPersonalPhotos: Photo[] = [
  {
    id: 'p1',
    imageUrl: 'https://images.unsplash.com/photo-1562351768-f68650f3ec54?w=400',
    lat: 37.7749,
    lng: -122.4194,
    location: 'San Francisco, CA',
    caption: 'Golden hour over the city',
    author: 'You',
    authorAvatar: avatars.you,
    timestamp: new Date('2025-11-18T18:30:00'),
    likes: 24,
    visibility: 'personal',
    category: 'scenic',
  },
  {
    id: 'p2',
    imageUrl: 'https://images.unsplash.com/photo-1601967272802-911f1448de2a?w=400',
    lat: 37.7899,
    lng: -122.4085,
    location: 'Blue Bottle Coffee, SF',
    caption: 'Perfect morning coffee spot',
    author: 'You',
    authorAvatar: avatars.you,
    timestamp: new Date('2025-11-17T08:15:00'),
    likes: 18,
    visibility: 'personal',
    category: 'food',
  },
];

export const mockFriendsPhotos: Photo[] = [
  {
    id: 'f1',
    imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400',
    lat: 37.7849,
    lng: -122.4094,
    location: 'Mission District, SF',
    caption: 'Street art',
    author: 'Sarah Chen',
    authorAvatar: avatars.sarah,
    timestamp: new Date('2025-11-19T14:00:00'),
    likes: 32,
    visibility: 'friends',
    category: 'art',
  },
];

export const mockGlobalPhotos: Photo[] = [
  {
    id: 'g1',
    imageUrl: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400',
    lat: 48.8566,
    lng: 2.3522,
    location: 'Paris, France',
    caption: 'Eiffel Tower',
    author: 'Photography Pro',
    authorAvatar: avatars.photographer,
    timestamp: new Date('2025-11-20T12:00:00'),
    likes: 156,
    visibility: 'public',
    category: 'travel',
  },
];

export const mockDailyChallengeSubmissions: any[] = [];

export const friendships = new Set([
  'Sarah Chen',
  'Mike Wilson',
  'Emma Davis',
  'James Lee'
]);

export const isFriend = (username: string): boolean => {
  return friendships.has(username);
};

export const getUserPhotos = (username: string): Photo[] => {
  if (username === 'You') {
    return mockPersonalPhotos;
  }
  return mockFriendsPhotos.filter(p => p.author === username);
};

export const updatePhotoVisibility = (photoId: string, newVisibility: 'personal' | 'friends' | 'public'): void => {
  const photo = mockPersonalPhotos.find(p => p.id === photoId);
  if (photo) {
    photo.visibility = newVisibility;
  }
};

export const getPersonalPhotosForTab = (tab: 'personal' | 'friends' | 'global'): Photo[] => {
  switch (tab) {
    case 'friends':
      return mockPersonalPhotos.filter(p => p.visibility === 'friends' || p.visibility === 'public');
    case 'global':
      return mockPersonalPhotos.filter(p => p.visibility === 'public');
    default:
      return mockPersonalPhotos;
  }
};
