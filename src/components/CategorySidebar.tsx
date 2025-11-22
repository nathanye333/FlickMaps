import { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CategorySidebarProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  isMapExpanded: boolean;
  isVisible: boolean;
  onVisibilityChange: (visible: boolean) => void;
}

const categories = [
  { name: 'All', icon: 'sparkles' as const },
  { name: 'Scenic', icon: 'image' as const },
  { name: 'Food', icon: 'restaurant' as const },
  { name: 'Architecture', icon: 'business' as const },
  { name: 'Hidden Gems', icon: 'compass' as const },
  { name: 'Travel', icon: 'airplane' as const },
];

const { height } = Dimensions.get('window');

export function CategorySidebar({ selectedCategory, onCategoryChange, isMapExpanded, isVisible, onVisibilityChange }: CategorySidebarProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Don't render if map is expanded
  if (isMapExpanded) return null;

  return (
    <>
      {/* Backdrop to close sidebar - only when visible */}
      {isVisible && (
        <Pressable
          style={styles.backdrop}
          onPress={() => onVisibilityChange(false)}
        />
      )}
      
      {/* Left peek tab - only when not visible */}
      {!isVisible && (
        <View style={styles.peekTab}>
          <Ionicons name="chevron-forward" size={16} color="#6b7280" />
        </View>
      )}
      
      {/* Sidebar - always rendered, visibility controlled by styles */}
      <View 
        style={[
          styles.sidebar,
          isExpanded ? styles.sidebarExpanded : styles.sidebarCollapsed,
          isVisible ? styles.sidebarVisible : styles.sidebarHidden,
        ]}
      >
        <View style={styles.sidebarContent}>
          {/* Toggle Button */}
          <Pressable
            style={styles.toggleButton}
            onPress={() => setIsExpanded(!isExpanded)}
          >
            <Ionicons 
              name={isExpanded ? "chevron-back" : "chevron-forward"} 
              size={16} 
              color="#6b7280" 
            />
          </Pressable>

          {/* Content */}
          <View style={styles.content}>
            {isExpanded ? (
              <View style={styles.expandedContent}>
                <Text style={styles.title}>Categories</Text>
                {categories.map((category) => {
                  const isSelected = selectedCategory === category.name;
                  return (
                    <Pressable
                      key={category.name}
                      onPress={() => onCategoryChange(category.name)}
                      style={[
                        styles.categoryButton,
                        isSelected && styles.categoryButtonActive
                      ]}
                    >
                      <Ionicons 
                        name={category.icon} 
                        size={16} 
                        color={isSelected ? 'white' : '#374151'} 
                      />
                      <Text style={[
                        styles.categoryText,
                        isSelected && styles.categoryTextActive
                      ]}>
                        {category.name}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            ) : (
              <View style={styles.collapsedContent}>
                {categories.map((category) => {
                  const isSelected = selectedCategory === category.name;
                  return (
                    <Pressable
                      key={category.name}
                      onPress={() => onCategoryChange(category.name)}
                      style={[
                        styles.categoryIconButton,
                        isSelected && styles.categoryIconButtonActive
                      ]}
                    >
                      <Ionicons 
                        name={category.icon} 
                        size={16} 
                        color={isSelected ? 'white' : '#6b7280'} 
                      />
                    </Pressable>
                  );
                })}
              </View>
            )}
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    zIndex: 20,
  },
  triggerZone: {
    position: 'absolute',
    left: 0,
    top: height * 0.3,
    bottom: 0,
    width: 64,
    zIndex: 20,
  },
  peekTab: {
    position: 'absolute',
    left: 0,
    top: '50%',
    transform: [{ translateY: -32 }],
    width: 32,
    height: 64,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    zIndex: 20,
  },
  sidebar: {
    position: 'absolute',
    left: 0,
    top: '50%',
    transform: [{ translateY: -160 }],
    height: 320,
    zIndex: 30,
  },
  sidebarCollapsed: {
    width: 48,
  },
  sidebarExpanded: {
    width: 224,
  },
  sidebarVisible: {
    opacity: 1,
    transform: [{ translateX: 0 }, { translateY: -160 }],
  },
  sidebarHidden: {
    opacity: 0,
    transform: [{ translateX: -224 }, { translateY: -160 }],
  },
  sidebarContent: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  toggleButton: {
    position: 'absolute',
    right: -12,
    top: '50%',
    transform: [{ translateY: -24 }],
    width: 24,
    height: 48,
    backgroundColor: 'white',
    borderTopRightRadius: 24,
    borderBottomRightRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    zIndex: 10,
  },
  content: {
    flex: 1,
    padding: 12,
  },
  expandedContent: {
    gap: 8,
  },
  title: {
    fontSize: 14,
    color: '#111827',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 10,
    borderRadius: 12,
    backgroundColor: '#f9fafb',
  },
  categoryButtonActive: {
    backgroundColor: '#06b6d4',
  },
  categoryText: {
    fontSize: 14,
    color: '#374151',
  },
  categoryTextActive: {
    color: 'white',
  },
  collapsedContent: {
    gap: 12,
    alignItems: 'center',
    paddingTop: 12,
  },
  categoryIconButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#f9fafb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryIconButtonActive: {
    backgroundColor: '#06b6d4',
  },
});
