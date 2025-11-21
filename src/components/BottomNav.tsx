import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

interface BottomNavProps {
  currentScreen: string;
  onNavigate?: (screen: string) => void;
  onUploadClick?: () => void;
}

export function BottomNav({ currentScreen, onNavigate, onUploadClick }: BottomNavProps) {
  const navigation = useNavigation();

  const handleNavigate = (screen: string) => {
    if (onNavigate) {
      onNavigate(screen);
    } else {
      navigation.navigate(screen as never);
    }
  };

  const navItems = [
    { screen: 'Map', icon: 'globe' as const, label: 'Map' },
    { screen: 'Friends', icon: 'people' as const, label: 'Friends' },
    { screen: 'Explore', icon: 'compass' as const, label: 'Explore' },
    { screen: 'Profile', icon: 'person' as const, label: 'Profile' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.navContainer}>
        {navItems.map((item, index) => {
          const isActive = currentScreen === item.screen;
          return (
            <Pressable
              key={item.screen}
              onPress={() => handleNavigate(item.screen)}
              style={styles.navButton}
            >
              <Ionicons 
                name={item.icon} 
                size={24} 
                color={isActive ? '#06b6d4' : '#9ca3af'} 
              />
              <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>
                {item.label}
              </Text>
            </Pressable>
          );
        })}
        
        {/* Center Capture Button */}
        <Pressable
          onPress={() => {
            if (onUploadClick) {
              onUploadClick();
            } else {
              handleNavigate('Capture');
            }
          }}
          style={styles.captureButton}
        >
          <LinearGradient
            colors={['#06b6d4', '#3b82f6']} // from-cyan-500 to-blue-500
            style={styles.captureButtonInner}
          >
            <Ionicons name="camera" size={24} color="white" />
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
    paddingHorizontal: 16,
    paddingVertical: 8,
    position: 'relative',
  },
  navButton: {
    alignItems: 'center',
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
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
    marginTop: -8, // -mt-2 in original (8px)
  },
  captureButtonInner: {
    width: 56, // w-14 h-14 in original (56px)
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
