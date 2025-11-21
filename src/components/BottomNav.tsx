import { User, Users, Globe, Camera, Compass } from 'lucide-react';
import { Screen, MapTab } from '../App';

interface BottomNavProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
  onUploadClick?: () => void;
  activeMapTab?: MapTab;
  onMapTabChange?: (tab: MapTab) => void;
}

export function BottomNav({ currentScreen, onNavigate, onUploadClick, activeMapTab, onMapTabChange }: BottomNavProps) {
  return (
    <div className="bg-white border-t border-gray-200 safe-area-bottom">
      <div className="flex items-center justify-around px-4 py-2 relative">
        {/* Map Button */}
        <button
          onClick={() => onNavigate('map')}
          className={`flex flex-col items-center gap-1 py-2 px-3 rounded-xl transition-all ${
            currentScreen === 'map' ? 'text-cyan-500' : 'text-gray-400'
          }`}
        >
          <Globe className="w-6 h-6" />
          <span className="text-xs">Map</span>
        </button>
        
        {/* Friends Button */}
        <button
          onClick={() => onNavigate('friends')}
          className={`flex flex-col items-center gap-1 py-2 px-3 rounded-xl transition-all ${
            currentScreen === 'friends' ? 'text-cyan-500' : 'text-gray-400'
          }`}
        >
          <Users className="w-6 h-6" />
          <span className="text-xs">Friends</span>
        </button>

        {/* Center Capture Button */}
        <button
          onClick={() => {
            if (onUploadClick) {
              onUploadClick();
            } else {
              onNavigate('capture');
            }
          }}
          className="flex items-center justify-center -mt-2"
        >
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 shadow-lg flex items-center justify-center hover:scale-105 transition-transform">
            <Camera className="w-6 h-6 text-white" />
          </div>
        </button>

        {/* Explore Button */}
        <button
          onClick={() => onNavigate('explore')}
          className={`flex flex-col items-center gap-1 py-2 px-3 rounded-xl transition-all ${
            currentScreen === 'explore' ? 'text-cyan-500' : 'text-gray-400'
          }`}
        >
          <Compass className="w-6 h-6" />
          <span className="text-xs">Explore</span>
        </button>

        {/* Profile Button */}
        <button
          onClick={() => onNavigate('profile')}
          className={`flex flex-col items-center gap-1 py-2 px-3 rounded-xl transition-all ${
            currentScreen === 'profile' ? 'text-cyan-500' : 'text-gray-400'
          }`}
        >
          <User className="w-6 h-6" />
          <span className="text-xs">Profile</span>
        </button>
      </div>
    </div>
  );
}