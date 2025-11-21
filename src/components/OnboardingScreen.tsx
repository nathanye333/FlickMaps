import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

interface OnboardingScreenProps {
  onComplete: () => void;
  navigation?: any;
  route?: any;
}

const { width } = Dimensions.get('window');

const slides = [
  {
    icon: 'location' as const,
    title: 'Welcome to FlickMaps',
    description: 'Your photos, pinned to the moments and places that matter',
    gradientColors: ['#60a5fa', '#22d3ee'],
  },
  {
    icon: 'camera' as const,
    title: 'Capture Your World',
    description: 'Every photo tells a story. Every location holds a memory.',
    gradientColors: ['#22d3ee', '#2dd4bf'],
  },
  {
    icon: 'people' as const,
    title: 'Connect with Friends',
    description: 'Share daily moments and discover where your friends have been',
    gradientColors: ['#2dd4bf', '#60a5fa'],
  },
  {
    icon: 'map' as const,
    title: 'Explore the Globe',
    description: 'Discover hidden gems and beautiful places through community photos',
    gradientColors: ['#60a5fa', '#818cf8'],
  },
];

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [step, setStep] = useState(0);
  const currentSlide = slides[step];

  const handleNext = () => {
    if (step < slides.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  return (
    <View style={styles.container}>
      {/* Content */}
      <View style={styles.content}>
        <View style={[styles.iconContainer, { backgroundColor: currentSlide.gradientColors[0] }]}>
          <Ionicons name={currentSlide.icon} size={64} color="white" />
        </View>
        
        <Text style={styles.title}>{currentSlide.title}</Text>
        <Text style={styles.description}>{currentSlide.description}</Text>
      </View>

      {/* Progress Dots */}
      <View style={styles.progressContainer}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.progressDot,
              index === step ? styles.progressDotActive : styles.progressDotInactive,
            ]}
          />
        ))}
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        {step === slides.length - 1 ? (
          <View style={styles.buttonGroup}>
            <Pressable
              onPress={handleNext}
              style={[styles.button, styles.buttonPrimary]}
            >
              <Text style={styles.buttonPrimaryText}>Sign up with Email</Text>
            </Pressable>
            <Pressable
              onPress={handleNext}
              style={[styles.button, styles.buttonSecondary]}
            >
              <Text style={styles.buttonSecondaryText}>Continue with Google</Text>
            </Pressable>
            <Pressable
              onPress={handleNext}
              style={[styles.button, styles.buttonDark]}
            >
              <Text style={styles.buttonDarkText}>Continue with Apple</Text>
            </Pressable>
          </View>
        ) : (
          <Pressable
            onPress={handleNext}
            style={[styles.button, styles.buttonPrimary]}
          >
            <Text style={styles.buttonPrimaryText}>Next</Text>
          </Pressable>
        )}
        
        {step < slides.length - 1 && (
          <Pressable
            onPress={onComplete}
            style={styles.skipButton}
          >
            <Text style={styles.skipButtonText}>Skip</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eff6ff',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  iconContainer: {
    width: 128,
    height: 128,
    borderRadius: 64,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 30,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#4b5563',
    textAlign: 'center',
    maxWidth: 300,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 32,
  },
  progressDot: {
    height: 8,
    borderRadius: 4,
  },
  progressDotActive: {
    width: 32,
    backgroundColor: '#06b6d4',
  },
  progressDotInactive: {
    width: 8,
    backgroundColor: '#d1d5db',
  },
  actions: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  buttonGroup: {
    gap: 12,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPrimary: {
    backgroundColor: '#06b6d4',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonPrimaryText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonSecondary: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonSecondaryText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDark: {
    backgroundColor: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonDarkText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  skipButton: {
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  skipButtonText: {
    color: '#6b7280',
    fontSize: 16,
  },
});
