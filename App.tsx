import React, { useState, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View, StyleSheet, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// Import screens
import { OnboardingScreen } from './src/components/OnboardingScreen';
import { MapView } from './src/components/MapView';
import { PhotoCapture } from './src/components/PhotoCapture';
import { PhotoDetails } from './src/components/PhotoDetails';
import { ProfileScreen } from './src/components/ProfileScreen';
import { UserMapScreen } from './src/components/UserMapScreen';
import { ExploreScreen } from './src/components/ExploreScreen';
import { FriendsScreen } from './src/components/FriendsScreen';
import { GroupMapsScreen } from './src/components/GroupMapsScreen';
import { GroupMapView } from './src/components/GroupMapView';
import { SettingsScreen } from './src/components/SettingsScreen';
import { CameraOptionsModal } from './src/components/CameraOptionsModal';
import { PhotoUploadModal } from './src/components/PhotoUploadModal';
import { updatePhotoVisibility } from './src/data/mockData';

// Types
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

export type RootStackParamList = {
  Onboarding: undefined;
  Main: undefined;
  Capture: undefined;
  PhotoDetails: { photo: Photo };
  UserMap: { username: string };
  GroupMaps: undefined;
  GroupMapView: { groupId: string; groupName: string };
  Settings: undefined;
};

export type MainTabParamList = {
  Map: undefined;
  Friends: undefined;
  Explore: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

// Context for app state
export const AppContext = React.createContext<{
  selectedPhoto: Photo | null;
  setSelectedPhoto: (photo: Photo | null) => void;
  viewingUsername: string | null;
  setViewingUsername: (username: string | null) => void;
  selectedGroupId: string | null;
  setSelectedGroupId: (groupId: string | null) => void;
  activeMapTab: MapTab;
  setActiveMapTab: (tab: MapTab) => void;
  showCameraOptions: boolean;
  setShowCameraOptions: (show: boolean) => void;
  showUploadModal: boolean;
  setShowUploadModal: (show: boolean) => void;
  hasOnboarded: boolean;
  setHasOnboarded: (onboarded: boolean) => void;
  onVisibilityChange: (photoId: string, newVisibility: 'personal' | 'friends' | 'public') => void;
  onViewOnMap: () => void;
  isDailyChallengeActive: boolean;
  setIsDailyChallengeActive: (active: boolean) => void;
}>({
  selectedPhoto: null,
  setSelectedPhoto: () => {},
  viewingUsername: null,
  setViewingUsername: () => {},
  selectedGroupId: null,
  setSelectedGroupId: () => {},
  activeMapTab: 'personal',
  setActiveMapTab: () => {},
  showCameraOptions: false,
  setShowCameraOptions: () => {},
  showUploadModal: false,
  setShowUploadModal: () => {},
  hasOnboarded: false,
  setHasOnboarded: () => {},
  onVisibilityChange: () => {},
  onViewOnMap: () => {},
  isDailyChallengeActive: false,
  setIsDailyChallengeActive: () => {},
});

function MainTabs() {
  const context = React.useContext(AppContext);
  
  // Wrapper component to pass onGroupsClick prop to MapView
  const MapViewWrapper = ({ navigation }: any) => {
    const handleGroupsClick = () => {
      // Navigate to GroupMaps in the parent Stack navigator
      navigation.getParent()?.navigate('GroupMaps');
    };
    
    return <MapView onGroupsClick={handleGroupsClick} />;
  };
  
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#06b6d4',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: '#e5e7eb',
          paddingBottom: 4,
          height: 60,
        },
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen 
        name="Map" 
        component={MapViewWrapper}
        options={{
          tabBarLabel: 'Map',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="globe" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Friends" 
        component={FriendsScreen}
        options={{
          tabBarLabel: 'Friends',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Explore" 
        component={ExploreScreen}
        options={{
          tabBarLabel: 'Explore',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="compass" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// Custom Tab Bar with center camera button
function CustomTabBar({ state, descriptors, navigation }: any) {
  const context = React.useContext(AppContext);
  
  return (
    <View style={customTabBarStyles.container}>
      <View style={customTabBarStyles.navContainer}>
        {/* Map Button */}
        <Pressable
          onPress={() => navigation.navigate('Map')}
          style={customTabBarStyles.navButton}
        >
          <View style={customTabBarStyles.navButtonContent}>
            <Ionicons 
              name="globe" 
              size={24} 
              color={state.index === 0 ? '#06b6d4' : '#9ca3af'} 
            />
            <Text style={[customTabBarStyles.navLabel, state.index === 0 && customTabBarStyles.navLabelActive]}>
              Map
            </Text>
          </View>
        </Pressable>
        
        {/* Friends Button */}
        <Pressable
          onPress={() => navigation.navigate('Friends')}
          style={customTabBarStyles.navButton}
        >
          <View style={customTabBarStyles.navButtonContent}>
            <Ionicons 
              name="people" 
              size={24} 
              color={state.index === 1 ? '#06b6d4' : '#9ca3af'} 
            />
            <Text style={[customTabBarStyles.navLabel, state.index === 1 && customTabBarStyles.navLabelActive]}>
              Friends
            </Text>
          </View>
        </Pressable>
        
        {/* Center Camera Button */}
        <Pressable
          onPress={() => {
            if (context?.setShowCameraOptions) {
              context.setShowCameraOptions(true);
            }
          }}
          style={customTabBarStyles.captureButton}
        >
          <LinearGradient
            colors={context?.isDailyChallengeActive ? ['#fb923c', '#f97316'] : ['#06b6d4', '#3b82f6']}
            style={customTabBarStyles.captureButtonInner}
          >
            <Ionicons name="camera" size={24} color="white" />
          </LinearGradient>
        </Pressable>
        
        {/* Explore Button */}
        <Pressable
          onPress={() => navigation.navigate('Explore')}
          style={customTabBarStyles.navButton}
        >
          <View style={customTabBarStyles.navButtonContent}>
            <Ionicons 
              name="compass" 
              size={24} 
              color={state.index === 2 ? '#06b6d4' : '#9ca3af'} 
            />
            <Text style={[customTabBarStyles.navLabel, state.index === 2 && customTabBarStyles.navLabelActive]}>
              Explore
            </Text>
          </View>
        </Pressable>
        
        {/* Profile Button */}
        <Pressable
          onPress={() => navigation.navigate('Profile')}
          style={customTabBarStyles.navButton}
        >
          <View style={customTabBarStyles.navButtonContent}>
            <Ionicons 
              name="person" 
              size={24} 
              color={state.index === 3 ? '#06b6d4' : '#9ca3af'} 
            />
            <Text style={[customTabBarStyles.navLabel, state.index === 3 && customTabBarStyles.navLabelActive]}>
              Profile
            </Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
}

const customTabBarStyles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingBottom: 8,
  },
  navContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
    paddingVertical: 8,
    position: 'relative',
  },
  navButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 12,
    flex: 1,
  },
  navButtonContent: {
    alignItems: 'center',
    gap: 4,
  },
  navLabel: {
    fontSize: 12,
    color: '#9ca3af',
  },
  navLabelActive: {
    color: '#06b6d4',
  },
  captureButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -8,
    marginHorizontal: 16,
  },
  captureButtonInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
});

export default function App() {
  const navigationRef = useRef<any>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [hasOnboarded, setHasOnboarded] = useState(false);
  const [showCameraOptions, setShowCameraOptions] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [viewingUsername, setViewingUsername] = useState<string | null>(null);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [activeMapTab, setActiveMapTab] = useState<MapTab>('personal');
  // Daily challenge is active by default to show it's "live"
  const [isDailyChallengeActive, setIsDailyChallengeActive] = useState<boolean>(true);

  const handleVisibilityChange = (photoId: string, newVisibility: 'personal' | 'friends' | 'public') => {
    updatePhotoVisibility(photoId, newVisibility);
    if (selectedPhoto && selectedPhoto.id === photoId) {
      setSelectedPhoto({
        ...selectedPhoto,
        visibility: newVisibility
      });
    }
  };

  const handleViewOnMap = () => {
    if (!selectedPhoto) return;
    
    // Determine which screen/tab to navigate to based on photo context
    const photoVisibility = selectedPhoto.visibility;
    
    // If we're viewing someone else's profile, stay on their map
    if (viewingUsername && viewingUsername !== 'You') {
      if (navigationRef.current) {
        navigationRef.current.navigate('UserMap' as never, { username: viewingUsername } as never);
      }
      return;
    }
    
    // Set the appropriate tab based on photo visibility
    if (photoVisibility === 'personal') {
      setActiveMapTab('personal');
    } else if (photoVisibility === 'friends') {
      setActiveMapTab('friends');
    } else if (photoVisibility === 'public') {
      setActiveMapTab('global');
    }
    
    // Navigate to Map tab in Main navigator
    // Go back first to close PhotoDetails, then navigate to Map
    if (navigationRef.current) {
      navigationRef.current.goBack();
      // Use setTimeout to ensure the goBack completes before navigating
      setTimeout(() => {
        if (navigationRef.current) {
          navigationRef.current.navigate('Main' as never, { screen: 'Map' } as never);
        }
      }, 300);
    }
    // Photo remains selected in context so MapView can center on it
  };

  const contextValue = {
    selectedPhoto,
    setSelectedPhoto,
    viewingUsername,
    setViewingUsername,
    selectedGroupId,
    setSelectedGroupId,
    activeMapTab,
    setActiveMapTab,
    showCameraOptions,
    setShowCameraOptions,
    showUploadModal,
    setShowUploadModal,
    hasOnboarded,
    setHasOnboarded,
    onVisibilityChange: handleVisibilityChange,
    onViewOnMap: handleViewOnMap,
    isDailyChallengeActive,
    setIsDailyChallengeActive,
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <AppContext.Provider value={contextValue}>
          <NavigationContainer ref={navigationRef}>
            <StatusBar style="auto" />
            <Stack.Navigator
              screenOptions={{
                headerShown: false,
                animation: 'slide_from_right',
              }}
            >
              {!hasOnboarded ? (
                <Stack.Screen name="Onboarding">
                  {(props) => <OnboardingScreen {...props} onComplete={() => setHasOnboarded(true)} />}
                </Stack.Screen>
              ) : (
                <>
                  <Stack.Screen name="Main" component={MainTabs} />
                  <Stack.Screen name="Capture">
                    {(props) => (
                      <PhotoCapture 
                        {...props}
                        onComplete={() => {
                          if (navigationRef.current) {
                            navigationRef.current.goBack();
                          }
                        }}
                        onCancel={() => {
                          if (navigationRef.current) {
                            navigationRef.current.goBack();
                          }
                        }}
                      />
                    )}
                  </Stack.Screen>
                  <Stack.Screen name="PhotoDetails">
                    {(props) => (
                      <PhotoDetails 
                        {...props} 
                        onVisibilityChange={handleVisibilityChange}
                      />
                    )}
                  </Stack.Screen>
                  <Stack.Screen name="UserMap" component={UserMapScreen} />
                  <Stack.Screen name="GroupMaps" component={GroupMapsScreen} />
                  <Stack.Screen name="GroupMapView" component={GroupMapView} />
                  <Stack.Screen name="Settings" component={SettingsScreen} />
                </>
              )}
            </Stack.Navigator>
          </NavigationContainer>
          {/* Modals */}
          {showCameraOptions && (
            <CameraOptionsModal
              visible={showCameraOptions}
              onTakePhoto={() => {
                setShowCameraOptions(false);
                // Navigate to Capture screen
                if (navigationRef.current) {
                  navigationRef.current.navigate('Capture');
                }
              }}
              onUploadPhoto={() => {
                setShowCameraOptions(false);
                setShowUploadModal(true);
              }}
              onClose={() => setShowCameraOptions(false)}
            />
          )}
          {showUploadModal && (
            <PhotoUploadModal
              visible={showUploadModal}
              onClose={() => setShowUploadModal(false)}
              onPhotosUploaded={(photos) => {
                setShowUploadModal(false);
                // Handle uploaded photos
              }}
            />
          )}
        </AppContext.Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

