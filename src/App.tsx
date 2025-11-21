import { useState } from 'react';
import { OnboardingScreen } from './components/OnboardingScreen';
import { MapView } from './components/MapView';
import { PhotoCapture } from './components/PhotoCapture';
import { PhotoDetails } from './components/PhotoDetails';
import { ProfileScreen } from './components/ProfileScreen';
import { UserMapScreen } from './components/UserMapScreen';
import { ExploreScreen } from './components/ExploreScreen';
import { FriendsScreen } from './components/FriendsScreen';
import { GroupMapsScreen } from './components/GroupMapsScreen';
import { GroupMapView } from './components/GroupMapView';
import { BottomNav } from './components/BottomNav';
import { CameraOptionsModal } from './components/CameraOptionsModal';
import { mockPersonalPhotos, mockFriendsPhotos, mockGlobalPhotos, updatePhotoVisibility } from './data/mockData';

export type Screen = 'onboarding' | 'map' | 'capture' | 'photo-details' | 'profile' | 'user-map' | 'explore' | 'friends' | 'group-maps' | 'group-map-view';
export type MapTab = 'personal' | 'friends' | 'global';

export interface Photo {
  id: string;
  imageUrl: string;
  lat: number;
  lng: number;
  location: string;
  caption?: string;
  author: string;
  authorAvatar: string;
  timestamp: Date;
  likes: number;
  visibility: 'personal' | 'friends' | 'public';
  category?: string;
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('onboarding');
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [hasOnboarded, setHasOnboarded] = useState(false);
  const [showCameraOptions, setShowCameraOptions] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [viewingUsername, setViewingUsername] = useState<string | null>(null);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [navigationStack, setNavigationStack] = useState<Screen[]>([]);
  const [activeMapTab, setActiveMapTab] = useState<MapTab>('personal');

  const handleOnboardingComplete = () => {
    setHasOnboarded(true);
    setCurrentScreen('map');
  };

  const handleNavigate = (screen: Screen) => {
    setNavigationStack(prev => [...prev, currentScreen]);
    setCurrentScreen(screen);
    if (screen !== 'photo-details' && screen !== 'user-map') {
      setSelectedPhoto(null);
    }
    if (screen !== 'user-map') {
      setViewingUsername(null);
    }
  };

  const handlePhotoSelect = (photo: Photo) => {
    setNavigationStack(prev => [...prev, currentScreen]);
    setSelectedPhoto(photo);
    setCurrentScreen('photo-details');
  };

  const handleViewOnMap = () => {
    if (!selectedPhoto) return;
    
    // Determine which screen/tab to navigate to based on photo context
    const photoAuthor = selectedPhoto.author;
    const photoVisibility = selectedPhoto.visibility;
    
    // If we're viewing someone else's profile, stay on their map
    if (viewingUsername && viewingUsername !== 'You') {
      setNavigationStack(prev => [...prev, currentScreen]);
      setCurrentScreen('user-map');
      return;
    }
    
    // Otherwise navigate to the appropriate main map tab
    // The MapView will handle setting the correct tab based on photo visibility
    setNavigationStack(prev => [...prev, currentScreen]);
    setCurrentScreen('map');
    // Photo remains selected so MapView can center on it and determine the tab
  };

  const handleClosePhotoDetails = () => {
    // Pop from navigation stack
    const previousScreen = navigationStack[navigationStack.length - 1];
    if (previousScreen) {
      setNavigationStack(prev => prev.slice(0, -1));
      setCurrentScreen(previousScreen);
    } else {
      // Fallback to map if no navigation history
      setCurrentScreen('map');
    }
    
    // Only clear selected photo if not going back to user-map
    if (previousScreen !== 'user-map') {
      setSelectedPhoto(null);
    }
  };

  const handleProfileClick = (username: string) => {
    if (username === 'You') {
      setNavigationStack(prev => [...prev, currentScreen]);
      setCurrentScreen('profile');
    } else {
      setNavigationStack(prev => [...prev, currentScreen]);
      setViewingUsername(username);
      setCurrentScreen('user-map');
    }
  };

  const handleCaptureComplete = () => {
    setCurrentScreen('map');
  };

  const handleCameraClick = () => {
    setShowCameraOptions(true);
  };

  const handleTakePhoto = () => {
    setShowCameraOptions(false);
    setCurrentScreen('capture');
  };

  const handleUploadPhoto = () => {
    setShowCameraOptions(false);
    setShowUploadModal(true);
  };

  const handleVisibilityChange = (photoId: string, newVisibility: 'personal' | 'friends' | 'public') => {
    // Update the photo visibility in mock data
    updatePhotoVisibility(photoId, newVisibility);
    
    // Update the selected photo if it's the one being changed
    if (selectedPhoto && selectedPhoto.id === photoId) {
      setSelectedPhoto({
        ...selectedPhoto,
        visibility: newVisibility
      });
    }
    
    // Force a re-render by resetting to current screen (this triggers MapView to reload photos)
    setCurrentScreen(currentScreen);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Mobile App Container */}
      <div className="mx-auto max-w-md h-screen flex flex-col relative">
        {/* Screen Content */}
        <div className="flex-1 overflow-hidden">
          {currentScreen === 'onboarding' && !hasOnboarded && (
            <OnboardingScreen onComplete={handleOnboardingComplete} />
          )}
          
          {currentScreen === 'map' && hasOnboarded && (
            <MapView 
              onPhotoSelect={handlePhotoSelect} 
              showUploadModal={showUploadModal}
              onUploadModalClose={() => setShowUploadModal(false)}
              selectedPhoto={selectedPhoto}
              onProfileClick={handleProfileClick}
              activeMapTab={activeMapTab}
              setActiveMapTab={setActiveMapTab}
              onGroupsClick={() => handleNavigate('group-maps')}
            />
          )}
          
          {currentScreen === 'capture' && (
            <PhotoCapture onComplete={handleCaptureComplete} onCancel={() => handleNavigate('map')} />
          )}
          
          {currentScreen === 'photo-details' && selectedPhoto && (
            <PhotoDetails 
              photo={selectedPhoto} 
              onClose={handleClosePhotoDetails} 
              onViewOnMap={handleViewOnMap}
              onProfileClick={handleProfileClick}
              onVisibilityChange={handleVisibilityChange}
            />
          )}
          
          {currentScreen === 'profile' && (
            <ProfileScreen 
              onPhotoSelect={handlePhotoSelect}
              onViewOnMap={() => handleNavigate('map')}
              onSettings={() => alert('Settings - would show account settings, privacy, notifications, etc.')}
            />
          )}
          
          {currentScreen === 'user-map' && viewingUsername && (
            <UserMapScreen 
              username={viewingUsername}
              onBack={() => handleNavigate('map')}
              onPhotoSelect={handlePhotoSelect}
              onProfileClick={handleProfileClick}
            />
          )}
          
          {currentScreen === 'explore' && (
            <ExploreScreen 
              onPhotoSelect={handlePhotoSelect}
              onProfileClick={handleProfileClick}
              onChallengeClick={() => setShowCameraOptions(true)}
            />
          )}
          
          {currentScreen === 'friends' && (
            <FriendsScreen 
              onPhotoSelect={handlePhotoSelect}
              onProfileClick={handleProfileClick}
            />
          )}
          
          {currentScreen === 'group-maps' && (
            <GroupMapsScreen 
              onBack={() => {
                const previousScreen = navigationStack[navigationStack.length - 1];
                if (previousScreen) {
                  setNavigationStack(prev => prev.slice(0, -1));
                  setCurrentScreen(previousScreen);
                } else {
                  setCurrentScreen('map');
                }
              }}
              onGroupSelect={(groupId) => {
                setNavigationStack(prev => [...prev, currentScreen]);
                setSelectedGroupId(groupId);
                setCurrentScreen('group-map-view');
              }}
              onCreateGroup={() => alert('Create group feature - would show group creation form')}
            />
          )}
          
          {currentScreen === 'group-map-view' && selectedGroupId && (
            <GroupMapView 
              groupId={selectedGroupId}
              groupName="Europe Trip"
              onBack={() => {
                const previousScreen = navigationStack[navigationStack.length - 1];
                if (previousScreen) {
                  setNavigationStack(prev => prev.slice(0, -1));
                  setCurrentScreen(previousScreen);
                  setSelectedGroupId(null);
                } else {
                  setCurrentScreen('group-maps');
                  setSelectedGroupId(null);
                }
              }}
              onPhotoSelect={handlePhotoSelect}
              onProfileClick={handleProfileClick}
            />
          )}
        </div>

        {/* Bottom Navigation - Only show after onboarding */}
        {hasOnboarded && currentScreen !== 'onboarding' && currentScreen !== 'photo-details' && currentScreen !== 'user-map' && (
          <BottomNav 
            currentScreen={currentScreen} 
            onNavigate={handleNavigate}
            onUploadClick={handleCameraClick}
            activeMapTab={activeMapTab}
            onMapTabChange={setActiveMapTab}
          />
        )}

        {/* Camera Options Modal */}
        {showCameraOptions && (
          <CameraOptionsModal
            onTakePhoto={handleTakePhoto}
            onUploadPhoto={handleUploadPhoto}
            onClose={() => setShowCameraOptions(false)}
          />
        )}
      </div>
    </div>
  );
}