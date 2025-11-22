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
  {
    id: 'p3',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
    lat: 37.8024,
    lng: -122.4058,
    location: 'Golden Gate Bridge, SF',
    caption: 'Foggy morning walk',
    author: 'You',
    authorAvatar: avatars.you,
    timestamp: new Date('2025-11-16T07:00:00'),
    likes: 45,
    visibility: 'friends',
    category: 'scenic',
  },
  {
    id: 'p4',
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad99c9?w=400',
    lat: 37.7849,
    lng: -122.4094,
    location: 'Mission District, SF',
    caption: 'Dinner with friends',
    author: 'You',
    authorAvatar: avatars.you,
    timestamp: new Date('2025-11-15T19:30:00'),
    likes: 31,
    visibility: 'friends',
    category: 'food',
  },
  {
    id: 'p5',
    imageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400',
    lat: 37.8024,
    lng: -122.4058,
    location: 'Lands End, SF',
    caption: 'Sunset at the beach',
    author: 'You',
    authorAvatar: avatars.you,
    timestamp: new Date('2025-11-14T17:45:00'),
    likes: 89,
    visibility: 'public',
    category: 'scenic',
  },
  {
    id: 'p6',
    imageUrl: 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=400',
    lat: 37.7879,
    lng: -122.4075,
    location: 'Alamo Square, SF',
    caption: 'Painted Ladies',
    author: 'You',
    authorAvatar: avatars.you,
    timestamp: new Date('2025-11-13T14:20:00'),
    likes: 12,
    visibility: 'personal',
    category: 'architecture',
  },
  {
    id: 'p7',
    imageUrl: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400',
    lat: 37.7849,
    lng: -122.4094,
    location: 'Dolores Park, SF',
    caption: 'Weekend vibes',
    author: 'You',
    authorAvatar: avatars.you,
    timestamp: new Date('2025-11-12T15:00:00'),
    likes: 56,
    visibility: 'friends',
    category: 'lifestyle',
  },
  {
    id: 'p8',
    imageUrl: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400',
    lat: 37.8024,
    lng: -122.4058,
    location: 'Fisherman\'s Wharf, SF',
    caption: 'Fresh seafood',
    author: 'You',
    authorAvatar: avatars.you,
    timestamp: new Date('2025-11-11T12:30:00'),
    likes: 23,
    visibility: 'personal',
    category: 'food',
  },
  {
    id: 'p9',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    lat: 37.7879,
    lng: -122.4075,
    location: 'Castro District, SF',
    caption: 'Neighborhood exploration',
    author: 'You',
    authorAvatar: avatars.you,
    timestamp: new Date('2025-11-10T10:15:00'),
    likes: 34,
    visibility: 'friends',
    category: 'urban',
  },
  {
    id: 'p10',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400',
    lat: 37.8024,
    lng: -122.4058,
    location: 'Twin Peaks, SF',
    caption: 'City view from above',
    author: 'You',
    authorAvatar: avatars.you,
    timestamp: new Date('2025-11-09T16:00:00'),
    likes: 102,
    visibility: 'public',
    category: 'scenic',
  },
  {
    id: 'p11',
    imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400',
    lat: 37.7849,
    lng: -122.4094,
    location: 'Chinatown, SF',
    caption: 'Lunch break',
    author: 'You',
    authorAvatar: avatars.you,
    timestamp: new Date('2025-11-08T13:00:00'),
    likes: 19,
    visibility: 'personal',
    category: 'food',
  },
  {
    id: 'p12',
    imageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400',
    lat: 37.7879,
    lng: -122.4075,
    location: 'Presidio, SF',
    caption: 'Morning hike',
    author: 'You',
    authorAvatar: avatars.you,
    timestamp: new Date('2025-11-07T08:30:00'),
    likes: 67,
    visibility: 'friends',
    category: 'nature',
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
  {
    id: 'f2',
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad99c9?w=400',
    lat: 37.8024,
    lng: -122.4058,
    location: 'North Beach, SF',
    caption: 'Italian dinner',
    author: 'Sarah Chen',
    authorAvatar: avatars.sarah,
    timestamp: new Date('2025-11-18T20:00:00'),
    likes: 28,
    visibility: 'friends',
    category: 'food',
  },
  {
    id: 'f3',
    imageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400',
    lat: 37.7879,
    lng: -122.4075,
    location: 'Ocean Beach, SF',
    caption: 'Beach day',
    author: 'Sarah Chen',
    authorAvatar: avatars.sarah,
    timestamp: new Date('2025-11-17T15:30:00'),
    likes: 41,
    visibility: 'friends',
    category: 'lifestyle',
  },
  {
    id: 'f4',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    lat: 37.7849,
    lng: -122.4094,
    location: 'Hayes Valley, SF',
    caption: 'Coffee shop vibes',
    author: 'Mike Wilson',
    authorAvatar: avatars.mike,
    timestamp: new Date('2025-11-20T09:00:00'),
    likes: 35,
    visibility: 'friends',
    category: 'food',
  },
  {
    id: 'f5',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400',
    lat: 37.8024,
    lng: -122.4058,
    location: 'Crissy Field, SF',
    caption: 'Morning run',
    author: 'Mike Wilson',
    authorAvatar: avatars.mike,
    timestamp: new Date('2025-11-19T07:00:00'),
    likes: 52,
    visibility: 'friends',
    category: 'lifestyle',
  },
  {
    id: 'f6',
    imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400',
    lat: 37.7879,
    lng: -122.4075,
    location: 'Union Square, SF',
    caption: 'Shopping day',
    author: 'Mike Wilson',
    authorAvatar: avatars.mike,
    timestamp: new Date('2025-11-18T14:00:00'),
    likes: 19,
    visibility: 'friends',
    category: 'urban',
  },
  {
    id: 'f7',
    imageUrl: 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=400',
    lat: 37.7849,
    lng: -122.4094,
    location: 'Japantown, SF',
    caption: 'Ramen night',
    author: 'Emma Davis',
    authorAvatar: avatars.emma,
    timestamp: new Date('2025-11-21T19:00:00'),
    likes: 44,
    visibility: 'friends',
    category: 'food',
  },
  {
    id: 'f8',
    imageUrl: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400',
    lat: 37.8024,
    lng: -122.4058,
    location: 'Golden Gate Park, SF',
    caption: 'Botanical gardens',
    author: 'Emma Davis',
    authorAvatar: avatars.emma,
    timestamp: new Date('2025-11-20T11:00:00'),
    likes: 38,
    visibility: 'friends',
    category: 'nature',
  },
  {
    id: 'f9',
    imageUrl: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400',
    lat: 37.7879,
    lng: -122.4075,
    location: 'Marina District, SF',
    caption: 'Yacht club',
    author: 'Emma Davis',
    authorAvatar: avatars.emma,
    timestamp: new Date('2025-11-19T16:00:00'),
    likes: 27,
    visibility: 'friends',
    category: 'lifestyle',
  },
  {
    id: 'f10',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
    lat: 37.7849,
    lng: -122.4094,
    location: 'Financial District, SF',
    caption: 'Work lunch',
    author: 'James Lee',
    authorAvatar: avatars.james,
    timestamp: new Date('2025-11-22T13:00:00'),
    likes: 21,
    visibility: 'friends',
    category: 'food',
  },
  {
    id: 'f11',
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad99c9?w=400',
    lat: 37.8024,
    lng: -122.4058,
    location: 'SOMA, SF',
    caption: 'Tech meetup',
    author: 'James Lee',
    authorAvatar: avatars.james,
    timestamp: new Date('2025-11-21T18:00:00'),
    likes: 33,
    visibility: 'friends',
    category: 'urban',
  },
  {
    id: 'f12',
    imageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400',
    lat: 37.7879,
    lng: -122.4075,
    location: 'Potrero Hill, SF',
    caption: 'Neighborhood walk',
    author: 'James Lee',
    authorAvatar: avatars.james,
    timestamp: new Date('2025-11-20T10:00:00'),
    likes: 16,
    visibility: 'friends',
    category: 'urban',
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
  {
    id: 'g2',
    imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400',
    lat: 40.7128,
    lng: -74.0060,
    location: 'New York City, NY',
    caption: 'Times Square',
    author: 'Urban Explorer',
    authorAvatar: avatars.urban,
    timestamp: new Date('2025-11-21T20:00:00'),
    likes: 234,
    visibility: 'public',
    category: 'urban',
  },
  {
    id: 'g3',
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad99c9?w=400',
    lat: 51.5074,
    lng: -0.1278,
    location: 'London, UK',
    caption: 'Big Ben',
    author: 'Travel Bug',
    authorAvatar: avatars.photographer,
    timestamp: new Date('2025-11-19T15:00:00'),
    likes: 189,
    visibility: 'public',
    category: 'travel',
  },
  {
    id: 'g4',
    imageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400',
    lat: 35.6762,
    lng: 139.6503,
    location: 'Tokyo, Japan',
    caption: 'Shibuya Crossing',
    author: 'Wanderlust',
    authorAvatar: avatars.nature,
    timestamp: new Date('2025-11-22T10:00:00'),
    likes: 312,
    visibility: 'public',
    category: 'urban',
  },
  {
    id: 'g5',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    lat: -33.8688,
    lng: 151.2093,
    location: 'Sydney, Australia',
    caption: 'Opera House',
    author: 'Adventure Seeker',
    authorAvatar: avatars.photographer,
    timestamp: new Date('2025-11-18T14:00:00'),
    likes: 267,
    visibility: 'public',
    category: 'architecture',
  },
  {
    id: 'g6',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400',
    lat: 25.2048,
    lng: 55.2708,
    location: 'Dubai, UAE',
    caption: 'Burj Khalifa',
    author: 'City Lights',
    authorAvatar: avatars.urban,
    timestamp: new Date('2025-11-23T18:00:00'),
    likes: 445,
    visibility: 'public',
    category: 'architecture',
  },
  {
    id: 'g7',
    imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400',
    lat: 41.9028,
    lng: 12.4964,
    location: 'Rome, Italy',
    caption: 'Colosseum',
    author: 'History Buff',
    authorAvatar: avatars.photographer,
    timestamp: new Date('2025-11-17T11:00:00'),
    likes: 298,
    visibility: 'public',
    category: 'travel',
  },
  {
    id: 'g8',
    imageUrl: 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=400',
    lat: 28.6139,
    lng: 77.2090,
    location: 'New Delhi, India',
    caption: 'Taj Mahal',
    author: 'Cultural Explorer',
    authorAvatar: avatars.nature,
    timestamp: new Date('2025-11-16T09:00:00'),
    likes: 378,
    visibility: 'public',
    category: 'travel',
  },
  {
    id: 'g9',
    imageUrl: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400',
    lat: -22.9068,
    lng: -43.1729,
    location: 'Rio de Janeiro, Brazil',
    caption: 'Christ the Redeemer',
    author: 'Mountain Climber',
    authorAvatar: avatars.nature,
    timestamp: new Date('2025-11-15T16:00:00'),
    likes: 412,
    visibility: 'public',
    category: 'scenic',
  },
  {
    id: 'g10',
    imageUrl: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400',
    lat: 55.7558,
    lng: 37.6173,
    location: 'Moscow, Russia',
    caption: 'Red Square',
    author: 'World Traveler',
    authorAvatar: avatars.photographer,
    timestamp: new Date('2025-11-14T13:00:00'),
    likes: 201,
    visibility: 'public',
    category: 'architecture',
  },
  {
    id: 'g11',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
    lat: 37.5665,
    lng: 126.9780,
    location: 'Seoul, South Korea',
    caption: 'Gyeongbokgung Palace',
    author: 'Asian Adventures',
    authorAvatar: avatars.art,
    timestamp: new Date('2025-11-13T10:00:00'),
    likes: 289,
    visibility: 'public',
    category: 'travel',
  },
  {
    id: 'g12',
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad99c9?w=400',
    lat: 19.4326,
    lng: -99.1332,
    location: 'Mexico City, Mexico',
    caption: 'Zócalo',
    author: 'Latin Explorer',
    authorAvatar: avatars.urban,
    timestamp: new Date('2025-11-12T17:00:00'),
    likes: 156,
    visibility: 'public',
    category: 'urban',
  },
  {
    id: 'g13',
    imageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400',
    lat: 34.0522,
    lng: -118.2437,
    location: 'Los Angeles, CA',
    caption: 'Hollywood Sign',
    author: 'California Dreamer',
    authorAvatar: avatars.photographer,
    timestamp: new Date('2025-11-24T12:00:00'),
    likes: 423,
    visibility: 'public',
    category: 'scenic',
  },
  {
    id: 'g14',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    lat: 41.8781,
    lng: -87.6298,
    location: 'Chicago, IL',
    caption: 'Cloud Gate',
    author: 'Midwest Wanderer',
    authorAvatar: avatars.art,
    timestamp: new Date('2025-11-23T14:00:00'),
    likes: 267,
    visibility: 'public',
    category: 'art',
  },
  {
    id: 'g15',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400',
    lat: 25.7617,
    lng: -80.1918,
    location: 'Miami, FL',
    caption: 'South Beach',
    author: 'Beach Lover',
    authorAvatar: avatars.nature,
    timestamp: new Date('2025-11-22T16:00:00'),
    likes: 334,
    visibility: 'public',
    category: 'lifestyle',
  },
  {
    id: 'g16',
    imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400',
    lat: 45.5017,
    lng: -73.5673,
    location: 'Montreal, Canada',
    caption: 'Old Montreal',
    author: 'Canadian Explorer',
    authorAvatar: avatars.photographer,
    timestamp: new Date('2025-11-21T11:00:00'),
    likes: 198,
    visibility: 'public',
    category: 'travel',
  },
  {
    id: 'g17',
    imageUrl: 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=400',
    lat: 59.9343,
    lng: 30.3351,
    location: 'St. Petersburg, Russia',
    caption: 'Hermitage Museum',
    author: 'Art Enthusiast',
    authorAvatar: avatars.art,
    timestamp: new Date('2025-11-20T15:00:00'),
    likes: 245,
    visibility: 'public',
    category: 'art',
  },
  {
    id: 'g18',
    imageUrl: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400',
    lat: 52.5200,
    lng: 13.4050,
    location: 'Berlin, Germany',
    caption: 'Brandenburg Gate',
    author: 'European Traveler',
    authorAvatar: avatars.urban,
    timestamp: new Date('2025-11-19T13:00:00'),
    likes: 312,
    visibility: 'public',
    category: 'architecture',
  },
  {
    id: 'g19',
    imageUrl: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400',
    lat: -34.6037,
    lng: -58.3816,
    location: 'Buenos Aires, Argentina',
    caption: 'La Boca',
    author: 'South American Explorer',
    authorAvatar: avatars.art,
    timestamp: new Date('2025-11-18T16:00:00'),
    likes: 178,
    visibility: 'public',
    category: 'art',
  },
  {
    id: 'g20',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
    lat: 1.3521,
    lng: 103.8198,
    location: 'Singapore',
    caption: 'Marina Bay Sands',
    author: 'Asia Explorer',
    authorAvatar: avatars.photographer,
    timestamp: new Date('2025-11-17T19:00:00'),
    likes: 456,
    visibility: 'public',
    category: 'architecture',
  },
];

export interface DailyChallengeSubmission {
  id: string;
  photo: Photo;
  votes: number;
  hasVoted: boolean;
}

export const mockDailyChallengeSubmissions: DailyChallengeSubmission[] = [
  {
    id: 'dc1',
    photo: {
      id: 'dc-photo-1',
      imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
      lat: 37.7749,
      lng: -122.4194,
      location: 'San Francisco, CA',
      caption: 'Golden hour over the Golden Gate',
      author: 'Sarah Chen',
      authorAvatar: avatars.sarah,
      timestamp: new Date('2025-11-20T18:30:00'),
      likes: 89,
      visibility: 'public',
      category: 'scenic',
    },
    votes: 89,
    hasVoted: false,
  },
  {
    id: 'dc2',
    photo: {
      id: 'dc-photo-2',
      imageUrl: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400',
      lat: 40.7128,
      lng: -74.0060,
      location: 'New York City, NY',
      caption: 'Sunset skyline from Brooklyn Bridge',
      author: 'Mike Wilson',
      authorAvatar: avatars.mike,
      timestamp: new Date('2025-11-20T17:45:00'),
      likes: 124,
      visibility: 'public',
      category: 'urban',
    },
    votes: 124,
    hasVoted: false,
  },
  {
    id: 'dc3',
    photo: {
      id: 'dc-photo-3',
      imageUrl: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400',
      lat: 34.0522,
      lng: -118.2437,
      location: 'Los Angeles, CA',
      caption: 'Magic hour at the beach',
      author: 'Emma Davis',
      authorAvatar: avatars.emma,
      timestamp: new Date('2025-11-20T18:00:00'),
      likes: 156,
      visibility: 'public',
      category: 'nature',
    },
    votes: 156,
    hasVoted: true,
  },
  {
    id: 'dc4',
    photo: {
      id: 'dc-photo-4',
      imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400',
      lat: 25.7617,
      lng: -80.1918,
      location: 'Miami Beach, FL',
      caption: 'Golden hour waves',
      author: 'James Lee',
      authorAvatar: avatars.james,
      timestamp: new Date('2025-11-20T18:15:00'),
      likes: 98,
      visibility: 'public',
      category: 'nature',
    },
    votes: 98,
    hasVoted: false,
  },
  {
    id: 'dc5',
    photo: {
      id: 'dc-photo-5',
      imageUrl: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=400',
      lat: 39.9526,
      lng: -75.1652,
      location: 'Philadelphia, PA',
      caption: 'Warm glow on city streets',
      author: 'Photography Pro',
      authorAvatar: avatars.photographer,
      timestamp: new Date('2025-11-20T17:30:00'),
      likes: 203,
      visibility: 'public',
      category: 'urban',
    },
    votes: 203,
    hasVoted: false,
  },
  {
    id: 'dc6',
    photo: {
      id: 'dc-photo-6',
      imageUrl: 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=400',
      lat: 45.5017,
      lng: -73.5673,
      location: 'Montreal, Canada',
      caption: 'Sunset over the mountains',
      author: 'Nature Lover',
      authorAvatar: avatars.nature,
      timestamp: new Date('2025-11-20T17:00:00'),
      likes: 142,
      visibility: 'public',
      category: 'nature',
    },
    votes: 142,
    hasVoted: false,
  },
  {
    id: 'dc7',
    photo: {
      id: 'dc-photo-7',
      imageUrl: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=400',
      lat: 51.5074,
      lng: -0.1278,
      location: 'London, UK',
      caption: 'Golden hour in the park',
      author: 'Urban Explorer',
      authorAvatar: avatars.urban,
      timestamp: new Date('2025-11-20T16:45:00'),
      likes: 167,
      visibility: 'public',
      category: 'scenic',
    },
    votes: 167,
    hasVoted: false,
  },
  {
    id: 'dc8',
    photo: {
      id: 'dc-photo-8',
      imageUrl: 'https://images.unsplash.com/photo-1494500764479-0c8f2919a3d8?w=400',
      lat: 35.6762,
      lng: 139.6503,
      location: 'Tokyo, Japan',
      caption: 'Evening glow in Shibuya',
      author: 'You',
      authorAvatar: avatars.you,
      timestamp: new Date('2025-11-20T18:20:00'),
      likes: 76,
      visibility: 'public',
      category: 'urban',
    },
    votes: 76,
    hasVoted: false,
  },
];

export const friendships = new Set([
  'Sarah Chen',
  'Mike Wilson',
  'Emma Davis',
  'James Lee'
]);

// Track pending friend requests (outgoing)
export const pendingFriendRequests = new Set<string>();

// Track sent friend requests (incoming - requests sent to you)
export const incomingFriendRequests = new Set<string>();

export const isFriend = (username: string): boolean => {
  return friendships.has(username);
};

export const hasPendingRequest = (username: string): boolean => {
  return pendingFriendRequests.has(username);
};

export const addFriend = (username: string): void => {
  friendships.add(username);
  pendingFriendRequests.delete(username);
  incomingFriendRequests.delete(username);
};

export const sendFriendRequest = (username: string): void => {
  if (!isFriend(username) && !hasPendingRequest(username)) {
    const profile = getUserProfile(username);
    // If profile is public, add directly as friend (no request needed)
    if (profile && profile.isPublic) {
      addFriend(username);
    } else {
      // If private, send a request
      pendingFriendRequests.add(username);
    }
  }
};

export const acceptFriendRequest = (username: string): void => {
  addFriend(username);
  incomingFriendRequests.delete(username);
};

export const rejectFriendRequest = (username: string): void => {
  incomingFriendRequests.delete(username);
};

// User profile data with privacy settings
const userProfiles: { [username: string]: { isPublic: boolean } } = {
  'Sarah Chen': { isPublic: true },
  'Mike Wilson': { isPublic: true },
  'Emma Davis': { isPublic: false },
  'James Lee': { isPublic: true },
  'Travel Bug': { isPublic: true },
  'Urban Lens': { isPublic: false },
  'Photography Pro': { isPublic: true },
  'Nature Lover': { isPublic: true },
  'City Explorer': { isPublic: false },
  'Art Enthusiast': { isPublic: true },
};

export const getUserProfile = (username: string): { isPublic: boolean } | null => {
  return userProfiles[username] || null;
};

export const canViewProfile = (username: string): boolean => {
  if (username === 'You') return true;
  const profile = getUserProfile(username);
  if (!profile) return false;
  // Can view if public or if friend
  return profile.isPublic || isFriend(username);
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

// Group data structure
export interface Group {
  id: string;
  name: string;
  memberCount: number;
  members: { username: string; avatar: string }[];
  mapPreview: string;
  lastUpdated: string;
  photoCount: number;
}

// Mock group photos - Europe Trip group
export const mockEuropeTripPhotos: Photo[] = [
  {
    id: 'group-europe-1',
    imageUrl: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400',
    lat: 48.8566,
    lng: 2.3522,
    location: 'Paris, France',
    caption: 'Eiffel Tower at sunset',
    author: 'Sarah Chen',
    authorAvatar: avatars.sarah,
    timestamp: new Date('2025-11-15T18:00:00'),
    likes: 24,
    visibility: 'friends',
    category: 'Travel'
  },
  {
    id: 'group-europe-2',
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad99c9?w=400',
    lat: 51.5074,
    lng: -0.1278,
    location: 'London, UK',
    caption: 'Big Ben and Westminster',
    author: 'Mike Wilson',
    authorAvatar: avatars.mike,
    timestamp: new Date('2025-11-14T14:00:00'),
    likes: 31,
    visibility: 'friends',
    category: 'Travel'
  },
  {
    id: 'group-europe-3',
    imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400',
    lat: 52.5200,
    lng: 13.4050,
    location: 'Berlin, Germany',
    caption: 'Brandenburg Gate',
    author: 'Emma Davis',
    authorAvatar: avatars.emma,
    timestamp: new Date('2025-11-13T12:00:00'),
    likes: 28,
    visibility: 'friends',
    category: 'Travel'
  },
  {
    id: 'group-europe-4',
    imageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400',
    lat: 41.9028,
    lng: 12.4964,
    location: 'Rome, Italy',
    caption: 'Colosseum visit',
    author: 'Sarah Chen',
    authorAvatar: avatars.sarah,
    timestamp: new Date('2025-11-12T16:00:00'),
    likes: 42,
    visibility: 'friends',
    category: 'Travel'
  },
  {
    id: 'group-europe-5',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    lat: 40.4168,
    lng: -3.7038,
    location: 'Madrid, Spain',
    caption: 'Plaza Mayor',
    author: 'Mike Wilson',
    authorAvatar: avatars.mike,
    timestamp: new Date('2025-11-11T15:00:00'),
    likes: 19,
    visibility: 'friends',
    category: 'Travel'
  },
  {
    id: 'group-europe-6',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400',
    lat: 50.8503,
    lng: 4.3517,
    location: 'Brussels, Belgium',
    caption: 'Grand Place',
    author: 'Emma Davis',
    authorAvatar: avatars.emma,
    timestamp: new Date('2025-11-10T13:00:00'),
    likes: 25,
    visibility: 'friends',
    category: 'Travel'
  },
];

// Mock group photos - Photography Club group
export const mockPhotographyClubPhotos: Photo[] = [
  {
    id: 'group-photo-1',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
    lat: 37.7749,
    lng: -122.4194,
    location: 'San Francisco, CA',
    caption: 'Golden Gate Bridge',
    author: 'Photography Pro',
    authorAvatar: avatars.photographer,
    timestamp: new Date('2025-11-20T10:00:00'),
    likes: 67,
    visibility: 'public',
    category: 'scenic'
  },
  {
    id: 'group-photo-2',
    imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400',
    lat: 34.0522,
    lng: -118.2437,
    location: 'Los Angeles, CA',
    caption: 'Hollywood Sign',
    author: 'Nature Lover',
    authorAvatar: avatars.nature,
    timestamp: new Date('2025-11-19T14:00:00'),
    likes: 54,
    visibility: 'public',
    category: 'scenic'
  },
  {
    id: 'group-photo-3',
    imageUrl: 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=400',
    lat: 40.7128,
    lng: -74.0060,
    location: 'New York City, NY',
    caption: 'Central Park',
    author: 'Urban Explorer',
    authorAvatar: avatars.urban,
    timestamp: new Date('2025-11-18T11:00:00'),
    likes: 89,
    visibility: 'public',
    category: 'nature'
  },
  {
    id: 'group-photo-4',
    imageUrl: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400',
    lat: 45.5017,
    lng: -73.5673,
    location: 'Montreal, Canada',
    caption: 'Old Montreal streets',
    author: 'Art Enthusiast',
    authorAvatar: avatars.art,
    timestamp: new Date('2025-11-17T16:00:00'),
    likes: 43,
    visibility: 'public',
    category: 'architecture'
  },
];

// Mock groups data
export const mockGroups: Group[] = [
  {
    id: 'europe-trip',
    name: 'Europe Trip',
    memberCount: 5,
    members: [
      { username: 'Sarah Chen', avatar: avatars.sarah },
      { username: 'Mike Wilson', avatar: avatars.mike },
      { username: 'Emma Davis', avatar: avatars.emma },
      { username: 'You', avatar: avatars.you },
    ],
    mapPreview: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=400&fit=crop',
    lastUpdated: '2 days ago',
    photoCount: mockEuropeTripPhotos.length
  },
  {
    id: 'photography-club',
    name: 'Photography Club',
    memberCount: 12,
    members: [
      { username: 'Photography Pro', avatar: avatars.photographer },
      { username: 'Nature Lover', avatar: avatars.nature },
      { username: 'Urban Explorer', avatar: avatars.urban },
      { username: 'Art Enthusiast', avatar: avatars.art },
    ],
    mapPreview: 'https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?w=400&h=400&fit=crop',
    lastUpdated: '5 hours ago',
    photoCount: mockPhotographyClubPhotos.length
  },
];

// Get photos for a specific group
export const getGroupPhotos = (groupId: string): Photo[] => {
  switch (groupId) {
    case 'europe-trip':
      return mockEuropeTripPhotos;
    case 'photography-club':
      return mockPhotographyClubPhotos;
    default:
      return [];
  }
};

// Get group by ID
export const getGroupById = (groupId: string): Group | undefined => {
  return mockGroups.find(g => g.id === groupId);
};

// Add a new group
let groupIdCounter = 0;
export const addGroup = (name: string, selectedFriends: string[]): Group => {
  const avatars = {
    sarah: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    mike: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    emma: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    james: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    you: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
  };

  const avatarMap: { [key: string]: string } = {
    'Sarah Chen': avatars.sarah,
    'Mike Wilson': avatars.mike,
    'Emma Davis': avatars.emma,
    'James Lee': avatars.james,
    'You': avatars.you,
  };

  const members = [
    { username: 'You', avatar: avatars.you },
    ...selectedFriends.map(username => ({
      username,
      avatar: avatarMap[username] || avatars.you,
    })),
  ];

  // Generate unique ID using counter + timestamp to ensure uniqueness
  let uniqueId = `group-${Date.now()}-${++groupIdCounter}`;
  
  // Check if group with this ID already exists (shouldn't happen, but safety check)
  while (mockGroups.some(g => g.id === uniqueId)) {
    uniqueId = `group-${Date.now()}-${++groupIdCounter}`;
  }

  const newGroup: Group = {
    id: uniqueId,
    name,
    memberCount: members.length,
    members,
    mapPreview: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=400&fit=crop',
    lastUpdated: 'just now',
    photoCount: 0,
  };

  mockGroups.push(newGroup);
  return newGroup;
};
