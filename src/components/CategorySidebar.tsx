import { useState } from 'react';
import { ChevronLeft, ChevronRight, Mountain, UtensilsCrossed, Building2, Compass, Plane, Sparkles } from 'lucide-react';

interface CategorySidebarProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  isMapExpanded: boolean;
  isVisible: boolean;
  onVisibilityChange: (visible: boolean) => void;
}

const categories = [
  { name: 'All', icon: Sparkles },
  { name: 'Scenic', icon: Mountain },
  { name: 'Food', icon: UtensilsCrossed },
  { name: 'Architecture', icon: Building2 },
  { name: 'Hidden Gems', icon: Compass },
  { name: 'Travel', icon: Plane },
];

export function CategorySidebar({ selectedCategory, onCategoryChange, isMapExpanded, isVisible, onVisibilityChange }: CategorySidebarProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      {/* Backdrop to close sidebar */}
      {isVisible && (
        <div
          className="absolute inset-0 z-20 bg-black/10 transition-opacity duration-300"
          onClick={() => onVisibilityChange(false)}
        />
      )}
      
      <div 
        className={`absolute left-0 z-30 transition-all duration-300 ease-in-out ${
          isExpanded ? 'w-56' : 'w-12'
        } ${
          isVisible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
        }`}
        style={{ 
          top: '50%', 
          transform: isVisible ? 'translateY(-50%)' : 'translate(-100%, -50%)',
          height: '320px'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-full bg-white/95 backdrop-blur-sm shadow-lg rounded-r-2xl">
          {/* Toggle Button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-12 bg-white rounded-r-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors z-10"
          >
            {isExpanded ? (
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-600" />
            )}
          </button>

          {/* Content */}
          <div className="h-full overflow-y-auto p-3">
            {isExpanded ? (
              <div className="space-y-2">
                <h3 className="text-sm text-gray-900 mb-4 px-2">Categories</h3>
                {categories.map((category) => {
                  const Icon = category.icon;
                  const isSelected = selectedCategory === category.name;
                  return (
                    <button
                      key={category.name}
                      onClick={() => onCategoryChange(category.name)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                        isSelected
                          ? 'bg-cyan-500 text-white shadow-sm'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm">{category.name}</span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-3 flex flex-col items-center pt-3">
                {categories.map((category) => {
                  const Icon = category.icon;
                  const isSelected = selectedCategory === category.name;
                  return (
                    <button
                      key={category.name}
                      onClick={() => onCategoryChange(category.name)}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                        isSelected
                          ? 'bg-cyan-500 text-white shadow-sm'
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                      }`}
                      title={category.name}
                    >
                      <Icon className="w-4 h-4" />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}