# FlickMaps - Expo Mobile App (SDK 54)

A photo-sharing app that pins your photos to locations on a map, built with React Native and Expo SDK 54.

## Features

- 📍 Map-based photo sharing with location tagging
- 📸 Camera integration for capturing photos
- 👥 Friends and social features
- 🌍 Global photo exploration
- 🎯 Daily challenges
- 👤 User profiles and group maps

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- Expo CLI

### Installation

**Important:** Fix permission issues first if you ran `sudo npm` commands:

```bash
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) node_modules
```

Then install dependencies using Expo's install command (recommended):

```bash
npx expo install --fix
```

This will ensure all packages are compatible with Expo SDK 54.

Start the Expo development server:

```bash
npx expo start
```

Run on your preferred platform:
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app on your device
   - Press `w` for web

## Project Structure

```
├── App.tsx                 # Main app component with navigation
├── index.js                # Expo entry point
├── babel.config.js         # Babel configuration
├── metro.config.js         # Metro bundler configuration
├── src/
│   ├── components/        # React Native components
│   │   ├── MapView.tsx   # Main map view with react-native-maps
│   │   ├── PhotoCapture.tsx # Camera and photo capture
│   │   ├── ProfileScreen.tsx
│   │   └── ...
│   └── data/
│       └── mockData.ts    # Mock data for development
├── app.json               # Expo configuration
└── package.json           # Dependencies
```

## Key Technologies

- **Expo SDK 54** - React Native framework
- **React 19** - UI library
- **React Native 0.81** - Mobile framework
- **React Navigation** - Navigation between screens
- **react-native-maps** - Map functionality
- **expo-camera** - Camera access
- **expo-image-picker** - Photo selection
- **expo-location** - GPS location services
- **@expo/vector-icons** - Icon library
- **react-native-reanimated** - Animations

## Configuration Files

- `babel.config.js` - Babel configuration with reanimated plugin
- `metro.config.js` - Metro bundler configuration
- `app.json` / `app.config.js` - Expo app configuration
- `tsconfig.json` - TypeScript configuration

## Building for Production

### iOS
```bash
eas build --platform ios
```

### Android
```bash
eas build --platform android
```

## Notes

This app has been transformed from a web application (Vite + React) to a native mobile app using Expo SDK 54. Key changes include:

- Replaced HTML elements with React Native components
- Replaced web-specific libraries (Radix UI) with React Native alternatives
- Implemented navigation with React Navigation
- Added native camera and location permissions
- Converted Tailwind CSS to StyleSheet for React Native styling
- Replaced lucide-react icons with @expo/vector-icons
- Updated to Expo SDK 54 with React 19 and React Native 0.81

## Troubleshooting

### Permission Errors
If you encounter permission errors from running `sudo npm`:
```bash
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) node_modules
```

### Babel/Plugin Errors
If you see "index.js .plugins is not a valid plugin property":
- Ensure `babel.config.js` exports a function that returns `presets` and `plugins`
- The `react-native-reanimated/plugin` must be listed last in plugins array
- Run `npx expo install --fix` to ensure compatible versions

### Install Dependencies
Use Expo's install command instead of npm install:
```bash
npx expo install --fix
```

## License

Private project
