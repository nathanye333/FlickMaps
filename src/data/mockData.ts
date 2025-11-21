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
    imageUrl: 'https://images.unsplash.com/photo-1562351768-f68650f3ec54?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5JTIwc2t5bGluZSUyMHN1bnNldHxlbnwxfHx8fDE3NjM1MTU5OTl8MA&ixlib=rb-4.1.0&q=80&w=1080',
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
    imageUrl: 'https://images.unsplash.com/photo-1601967272802-911f1448de2a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBjdXAlMjBjYWZlfGVufDF8fHx8MTc2MzQyNDE3NXww&ixlib=rb-4.1.0&q=80&w=1080',
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
  {
    id: 'p3',
    imageUrl: 'https://images.unsplash.com/photo-1604223190546-a43e4c7f29d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGxhbmRzY2FwZXxlbnwxfHx8fDE3NjM0MTU4NzF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    lat: 37.8651,
    lng: -119.5383,
    location: 'Yosemite National Park, CA',
    caption: 'Mountain views',
    author: 'You',
    authorAvatar: avatars.you,
    timestamp: new Date('2025-11-15T14:20:00'),
    likes: 42,
    visibility: 'personal',
    category: 'scenic',
  },
  {
    id: 'p4',
    imageUrl: 'https://images.unsplash.com/photo-1661953029179-e1b0dc900490?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWFjaCUyMG9jZWFuJTIwd2F2ZXN8ZW58MXx8fHwxNzYzNTIzNTg4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    lat: 36.9741,
    lng: -122.0308,
    location: 'Santa Cruz Beach, CA',
    caption: 'Beach vibes',
    author: 'You',
    authorAvatar: avatars.you,
    timestamp: new Date('2025-11-14T16:45:00'),
    likes: 35,
    visibility: 'personal',
    category: 'travel',
  },
  {
    id: 'p5',
    imageUrl: 'https://images.unsplash.com/photo-1567079292691-2ff16e275356?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJlZXQlMjBhcnQlMjB1cmJhbnxlbnwxfHx8fDE3NjM0Nzg4Njh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    lat: 37.7695,
    lng: -122.4470,
    location: 'Mission District, SF',
    caption: 'Street art discovery',
    author: 'You',
    authorAvatar: avatars.you,
    timestamp: new Date('2025-11-13T12:00:00'),
    likes: 29,
    visibility: 'personal',
    category: 'architecture',
  },
  {
    id: 'p6',
    imageUrl: 'https://images.unsplash.com/photo-1717158776685-d4b7c346e1a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwcmVzdGF1cmFudCUyMHBsYXRlfGVufDF8fHx8MTc2MzUzODIzM3ww&ixlib=rb-4.1.0&q=80&w=1080',
    lat: 37.7833,
    lng: -122.4167,
    location: 'Nopa, San Francisco',
    caption: 'Dinner was amazing',
    author: 'You',
    authorAvatar: avatars.you,
    timestamp: new Date('2025-11-12T19:30:00'),
    likes: 31,
    visibility: 'personal',
    category: 'food',
  },
];

// Mock data for friends' photos
export const mockFriendsPhotos: Photo[] = [
  {
    id: 'f1',
    imageUrl: 'https://images.unsplash.com/photo-1695067438561-75492f7b6a9c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcmNoaXRlY3R1cmUlMjBidWlsZGluZyUyMG1vZGVybnxlbnwxfHx8fDE3NjM0NzMzMDR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    lat: 37.7955,
    lng: -122.3937,
    location: 'Golden Gate Bridge, SF',
    caption: 'Amazing architecture',
    author: 'Sarah Chen',
    authorAvatar: avatars.sarah,
    timestamp: new Date('2025-11-19T10:20:00'),
    likes: 56,
    visibility: 'friends',
    category: 'architecture',
  },
  {
    id: 'f2',
    imageUrl: 'https://images.unsplash.com/photo-1663312790104-c16cd011b761?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXR1cmUlMjBmb3Jlc3QlMjB0cmVlc3xlbnwxfHx8fDE3NjM0NTk0OTF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    lat: 37.8717,
    lng: -122.2585,
    location: 'Redwood National Park, CA',
    caption: 'Forest therapy',
    author: 'Mike Wilson',
    authorAvatar: avatars.mike,
    timestamp: new Date('2025-11-19T09:15:00'),
    likes: 43,
    visibility: 'friends',
    category: 'scenic',
  },
  {
    id: 'f3',
    imageUrl: 'https://images.unsplash.com/photo-1580895456895-cfdf02e4c23f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5JTIwbmlnaHQlMjBsaWdodHN8ZW58MXx8fHwxNzYzNDgyMjMyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    lat: 37.7599,
    lng: -122.5071,
    location: 'San Francisco, CA',
    caption: 'City lights never get old',
    author: 'Emma Davis',
    authorAvatar: avatars.emma,
    timestamp: new Date('2025-11-18T20:45:00'),
    likes: 67,
    visibility: 'friends',
    category: 'hidden gems',
  },
  {
    id: 'f4',
    imageUrl: 'https://images.unsplash.com/photo-1704009764792-147d46a4d6da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXJrJTIwb3V0ZG9vciUyMGdhcmRlbnxlbnwxfHx8fDE3NjM1MzgyMzR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    lat: 37.7694,
    lng: -122.4862,
    location: 'Golden Gate Park, SF',
    caption: 'Park day with the pup',
    author: 'James Lee',
    authorAvatar: avatars.james,
    timestamp: new Date('2025-11-18T15:30:00'),
    likes: 38,
    visibility: 'friends',
    category: 'travel',
  },
];

// Mock data for global/public photos
export const mockGlobalPhotos: Photo[] = [
  {
    id: 'g1',
    imageUrl: 'https://images.unsplash.com/photo-1562351768-f68650f3ec54?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5JTIwc2t5bGluZSUyMHN1bnNldHxlbnwxfHx8fDE3NjM1MTU5OTl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    lat: 37.8044,
    lng: -122.2712,
    location: 'Twin Peaks, SF',
    caption: 'Sunset from Twin Peaks',
    author: 'Photography Pro',
    authorAvatar: avatars.photographer,
    timestamp: new Date('2025-11-19T17:45:00'),
    likes: 234,
    visibility: 'public',
    category: 'scenic',
  },
  {
    id: 'g2',
    imageUrl: 'https://images.unsplash.com/photo-1604223190546-a43e4c7f29d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGxhbmRzY2FwZXxlbnwxfHx8fDE3NjM0MTU4NzF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    lat: 38.0297,
    lng: -119.0260,
    location: 'Lake Tahoe, CA',
    caption: 'Lake Tahoe magic',
    author: 'Nature Explorer',
    authorAvatar: avatars.nature,
    timestamp: new Date('2025-11-18T11:20:00'),
    likes: 189,
    visibility: 'public',
    category: 'scenic',
  },
  {
    id: 'g3',
    imageUrl: 'https://images.unsplash.com/photo-1695067438561-75492f7b6a9c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcmNoaXRlY3R1cmUlMjBidWlsZGluZyUyMG1vZGVybnxlbnwxfHx8fDE3NjM0NzMzMDR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    lat: 37.7749,
    lng: -122.4194,
    location: 'Golden Gate Bridge, SF',
    caption: 'Modern SF architecture',
    author: 'Urban Lens',
    authorAvatar: avatars.urban,
    timestamp: new Date('2025-11-17T14:00:00'),
    likes: 156,
    visibility: 'public',
    category: 'architecture',
  },
  {
    id: 'g4',
    imageUrl: 'https://images.unsplash.com/photo-1717158776685-d4b7c346e1a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwcmVzdGF1cmFudCUyMHBsYXRlfGVufDF8fHx8MTc2MzUzODIzM3ww&ixlib=rb-4.1.0&q=80&w=1080',
    lat: 37.7937,
    lng: -122.3965,
    location: 'Nopa, San Francisco',
    caption: 'Best brunch spot in town',
    author: 'Foodie Adventures',
    authorAvatar: avatars.foodie,
    timestamp: new Date('2025-11-17T10:30:00'),
    likes: 201,
    visibility: 'public',
    category: 'food',
  },
  {
    id: 'g5',
    imageUrl: 'https://images.unsplash.com/photo-1567079292691-2ff16e275356?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJlZXQlMjBhcnQlMjB1cmJhbnxlbnwxfHx8fDE3NjM0Nzg4Njh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    lat: 37.7606,
    lng: -122.4232,
    location: 'Mission District, SF',
    caption: 'Hidden gem street art',
    author: 'Art Hunter',
    authorAvatar: avatars.art,
    timestamp: new Date('2025-11-16T13:15:00'),
    likes: 178,
    visibility: 'public',
    category: 'hidden gems',
  },
];

// Daily Challenge mock data
export const mockDailyChallengeSubmissions = [
  {
    id: 'dc1',
    photo: {
      id: 'dc-photo1',
      imageUrl: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      lat: 37.8199,
      lng: -122.4783,
      location: 'Marin Headlands, CA',
      caption: 'The golden hour glow through the fog was absolutely magical!',
      author: 'Sarah Chen',
      authorAvatar: avatars.sarah,
      timestamp: new Date('2025-11-19T18:15:00'),
      likes: 12,
      visibility: 'friends' as const,
    },
    votes: 8,
    hasVoted: false,
  },
  {
    id: 'dc2',
    photo: {
      id: 'dc-photo2',
      imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      lat: 37.7955,
      lng: -122.3937,
      location: 'Golden Gate Bridge Vista Point',
      caption: 'Golden hour hitting the bridge perfectly',
      author: 'Mike Wilson',
      authorAvatar: avatars.mike,
      timestamp: new Date('2025-11-19T18:20:00'),
      likes: 15,
      visibility: 'friends' as const,
    },
    votes: 12,
    hasVoted: false,
  },
  {
    id: 'dc3',
    photo: {
      id: 'dc-photo3',
      imageUrl: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      lat: 37.7694,
      lng: -122.4862,
      location: 'Ocean Beach, SF',
      caption: 'Caught the sun melting into the Pacific 🌅',
      author: 'Emma Davis',
      authorAvatar: avatars.emma,
      timestamp: new Date('2025-11-19T18:30:00'),
      likes: 9,
      visibility: 'friends' as const,
    },
    votes: 5,
    hasVoted: false,
  },
  {
    id: 'dc4',
    photo: {
      id: 'dc-photo4',
      imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      lat: 37.8044,
      lng: -122.2712,
      location: 'Twin Peaks Summit',
      caption: 'The whole city bathed in golden light',
      author: 'James Lee',
      authorAvatar: avatars.james,
      timestamp: new Date('2025-11-19T18:10:00'),
      likes: 18,
      visibility: 'friends' as const,
    },
    votes: 15,
    hasVoted: false,
  },
];

// Friendship data - users we're friends with
export const friendships = new Set([
  'Sarah Chen',
  'Mike Wilson',
  'Emma Davis',
  'James Lee',
]);

// Helper to check if we're friends with a user
export const isFriend = (username: string): boolean => {
  return friendships.has(username);
};

// Helper to get photos for a specific user based on friendship status
export const getUserPhotos = (username: string): Photo[] => {
  if (username === 'You') {
    return mockPersonalPhotos;
  }
  
  const isFriended = isFriend(username);
  const allPhotos = [...mockFriendsPhotos, ...mockGlobalPhotos];
  
  return allPhotos.filter(photo => {
    if (photo.author !== username) return false;
    
    // If we're friends, show both 'friends' and 'public' photos
    if (isFriended) {
      return photo.visibility === 'friends' || photo.visibility === 'public';
    }
    
    // If not friends, only show 'public' photos
    return photo.visibility === 'public';
  });
};

// Helper to update photo visibility
export const updatePhotoVisibility = (photoId: string, newVisibility: 'personal' | 'friends' | 'public'): void => {
  // Find the photo in all arrays
  const photoInPersonal = mockPersonalPhotos.find(p => p.id === photoId);
  const photoInFriends = mockFriendsPhotos.find(p => p.id === photoId);
  const photoInGlobal = mockGlobalPhotos.find(p => p.id === photoId);
  
  // Update the photo's visibility
  if (photoInPersonal) {
    photoInPersonal.visibility = newVisibility;
  }
  if (photoInFriends) {
    photoInFriends.visibility = newVisibility;
  }
  if (photoInGlobal) {
    photoInGlobal.visibility = newVisibility;
  }
};

// Helper to get all personal photos that should appear on friends/global maps based on visibility
export const getPersonalPhotosForTab = (tab: 'personal' | 'friends' | 'global'): Photo[] => {
  if (tab === 'personal') {
    return mockPersonalPhotos;
  }
  
  // For friends tab, include personal photos with 'friends' or 'public' visibility
  if (tab === 'friends') {
    return mockPersonalPhotos.filter(p => p.visibility === 'friends' || p.visibility === 'public');
  }
  
  // For global tab, include personal photos with 'public' visibility
  if (tab === 'global') {
    return mockPersonalPhotos.filter(p => p.visibility === 'public');
  }
  
  return [];
};