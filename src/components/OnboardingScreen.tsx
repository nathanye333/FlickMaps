import { useState } from 'react';
import { Camera, Map, Users, MapPin } from 'lucide-react';

interface OnboardingScreenProps {
  onComplete: () => void;
}

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [step, setStep] = useState(0);

  const slides = [
    {
      icon: MapPin,
      title: 'Welcome to FlickMaps',
      description: 'Your photos, pinned to the moments and places that matter',
      gradient: 'from-blue-400 to-cyan-400'
    },
    {
      icon: Camera,
      title: 'Capture Your World',
      description: 'Every photo tells a story. Every location holds a memory.',
      gradient: 'from-cyan-400 to-teal-400'
    },
    {
      icon: Users,
      title: 'Connect with Friends',
      description: 'Share daily moments and discover where your friends have been',
      gradient: 'from-teal-400 to-blue-400'
    },
    {
      icon: Map,
      title: 'Explore the Globe',
      description: 'Discover hidden gems and beautiful places through community photos',
      gradient: 'from-blue-400 to-indigo-400'
    }
  ];

  const currentSlide = slides[step];
  const Icon = currentSlide.icon;

  const handleNext = () => {
    if (step < slides.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-blue-50 to-cyan-50">
      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
        <div className={`w-32 h-32 rounded-full bg-gradient-to-br ${currentSlide.gradient} flex items-center justify-center mb-8 shadow-lg`}>
          <Icon className="w-16 h-16 text-white" strokeWidth={1.5} />
        </div>
        
        <h1 className="text-3xl mb-4 text-gray-900">{currentSlide.title}</h1>
        <p className="text-gray-600 max-w-xs">{currentSlide.description}</p>
      </div>

      {/* Progress Dots */}
      <div className="flex justify-center gap-2 mb-8">
        {slides.map((_, index) => (
          <div
            key={index}
            className={`h-2 rounded-full transition-all ${
              index === step ? 'w-8 bg-cyan-500' : 'w-2 bg-gray-300'
            }`}
          />
        ))}
      </div>

      {/* Actions */}
      <div className="px-6 pb-8">
        {step === slides.length - 1 ? (
          <div className="space-y-3">
            <button
              onClick={handleNext}
              className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-2xl shadow-lg"
            >
              Sign up with Email
            </button>
            <button
              onClick={handleNext}
              className="w-full py-4 bg-white text-gray-700 rounded-2xl shadow border border-gray-200"
            >
              Continue with Google
            </button>
            <button
              onClick={handleNext}
              className="w-full py-4 bg-black text-white rounded-2xl shadow"
            >
              Continue with Apple
            </button>
          </div>
        ) : (
          <button
            onClick={handleNext}
            className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-2xl shadow-lg"
          >
            Next
          </button>
        )}
        
        {step < slides.length - 1 && (
          <button
            onClick={onComplete}
            className="w-full py-3 text-gray-500 mt-2"
          >
            Skip
          </button>
        )}
      </div>
    </div>
  );
}
