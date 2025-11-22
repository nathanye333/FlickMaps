import { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, PanResponder, Dimensions } from 'react-native';
import { Photo } from '../App';
import { TimelineFilter } from './MapView';

const { width } = Dimensions.get('window');

interface TimelineScrubberProps {
  photos: Photo[];
  filter: TimelineFilter;
  onTimeChange: (currentDate: Date) => void;
  resetTrigger?: number;
}

export function TimelineScrubber({ photos, filter, onTimeChange, resetTrigger }: TimelineScrubberProps) {
  const [dragOffset, setDragOffset] = useState(0);
  const containerRef = useRef<View>(null);
  const dragStartOffset = useRef(0);
  const dragOffsetRef = useRef(0);
  const intervalInfoRef = useRef({ pixelsPerUnit: 80 });
  const lastDragX = useRef(0); // Track last drag position to calculate incremental changes
  
  // Sensitivity factor: reduces how much the timeline moves relative to swipe distance
  // Lower values = less sensitive (timeline moves less for same swipe distance)
  const swipeSensitivity = 1;
  
  // Maximum change per update to prevent rapid date changes during continuous drag
  const maxChangePerUpdate = 20; // pixels

  // Calculate interval size based on filter - memoized to prevent infinite loops
  const intervalInfo = useMemo(() => {
    switch (filter) {
      case 'daily':
        return { unit: 'day', step: 1, pixelsPerUnit: 60 };
      case 'weekly':
        return { unit: 'week', step: 7, pixelsPerUnit: 80 };
      case 'monthly':
        return { unit: 'month', step: 1, pixelsPerUnit: 100 };
      case 'yearly':
        return { unit: 'year', step: 1, pixelsPerUnit: 120 };
    }
  }, [filter]);

  // Reset to current date (offset 0) when filter changes or resetTrigger changes
  useEffect(() => {
    setDragOffset(0);
  }, [filter, resetTrigger]);

  // Get the current middle date based on drag offset
  const getCurrentDate = useCallback(() => {
    const now = new Date();
    // Calculate which interval we're at based on offset
    const intervalsFromNow = -Math.round(dragOffset / intervalInfo.pixelsPerUnit);
    
    const currentDate = new Date(now);
    switch (filter) {
      case 'daily':
        currentDate.setDate(now.getDate() + intervalsFromNow);
        break;
      case 'weekly':
        currentDate.setDate(now.getDate() + (intervalsFromNow * 7));
        break;
      case 'monthly':
        currentDate.setMonth(now.getMonth() + intervalsFromNow);
        break;
      case 'yearly':
        currentDate.setFullYear(now.getFullYear() + intervalsFromNow);
        break;
    }
    
    return currentDate;
  }, [dragOffset, filter, intervalInfo.pixelsPerUnit]);

  // Update filtered photos when drag offset changes - using ref to prevent loops
  const onTimeChangeRef = useRef(onTimeChange);
  useEffect(() => {
    onTimeChangeRef.current = onTimeChange;
  }, [onTimeChange]);

  useEffect(() => {
    const currentDate = getCurrentDate();
    onTimeChangeRef.current(currentDate);
  }, [getCurrentDate]);
  
  // Update refs when values change
  useEffect(() => {
    dragOffsetRef.current = dragOffset;
    dragStartOffset.current = dragOffset;
  }, [dragOffset]);
  
  useEffect(() => {
    intervalInfoRef.current = intervalInfo;
  }, [intervalInfo]);
  
  // Create pan responder with refs to avoid stale closures
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        // Store the starting offset when drag begins
        dragStartOffset.current = dragOffsetRef.current;
        lastDragX.current = 0; // Reset last position tracker
      },
      onPanResponderMove: (evt, gestureState) => {
        const currentDragX = gestureState.dx;
        // Calculate incremental change from last update (not total from start)
        // This prevents accumulation during continuous drag
        const incrementalDeltaX = currentDragX - lastDragX.current;
        lastDragX.current = currentDragX;
        
        // Apply sensitivity factor to incremental change
        const adjustedDeltaX = incrementalDeltaX * swipeSensitivity;
        
        // Limit maximum change per update to prevent rapid date changes during continuous drag
        // This caps how much the timeline can move in a single update cycle
        const clampedDeltaX = Math.max(-maxChangePerUpdate, Math.min(maxChangePerUpdate, adjustedDeltaX));
        
        // Update offset incrementally from current position, not from start
        const newOffset = dragOffsetRef.current + clampedDeltaX;
        // Clamp to prevent going into the future (offset < 0)
        setDragOffset(Math.max(newOffset, 0));
      },
      onPanResponderRelease: (evt, gestureState) => {
        // Snap to nearest interval when releasing
        // Use the current dragOffset (which has been updated incrementally) for snapping
        // This ensures consistency with the incremental movement during drag
        const snapOffset = Math.round(dragOffsetRef.current / intervalInfoRef.current.pixelsPerUnit) * intervalInfoRef.current.pixelsPerUnit;
        setDragOffset(Math.max(snapOffset, 0));
        lastDragX.current = 0; // Reset for next drag
      },
    })
  ).current;

  // Format date for notches
  const formatNotchDate = (date: Date) => {
    switch (filter) {
      case 'daily':
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      case 'weekly':
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      case 'monthly':
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      case 'yearly':
        return date.getFullYear().toString();
    }
  };

  // Generate visible date notches (more than visible to allow smooth scrolling)
  const getDateNotches = () => {
    const now = new Date();
    const notches = [];
    const visibleRange = 15; // Show 15 notches on each side
    
    for (let i = -visibleRange; i <= visibleRange; i++) {
      const notchDate = new Date(now);
      
      switch (filter) {
        case 'daily':
          notchDate.setDate(now.getDate() + i);
          break;
        case 'weekly':
          notchDate.setDate(now.getDate() + (i * 7));
          break;
        case 'monthly':
          notchDate.setMonth(now.getMonth() + i);
          break;
        case 'yearly':
          notchDate.setFullYear(now.getFullYear() + i);
          break;
      }
      
      notches.push({
        offset: i,
        date: notchDate,
        label: formatNotchDate(notchDate)
      });
    }
    
    return notches;
  };

  const dateNotches = getDateNotches();
  
  // Calculate snapped offset for rendering
  const snappedOffset = Math.round(dragOffset / intervalInfo.pixelsPerUnit) * intervalInfo.pixelsPerUnit;
  const currentInterval = -Math.round(snappedOffset / intervalInfo.pixelsPerUnit);

  return (
    <View style={styles.container} ref={containerRef} {...panResponder.panHandlers}>
      <View style={styles.trackContainer}>
        {/* Timeline Track */}
        <View style={styles.track}>
          {/* Background Track - Number Line */}
          <View style={styles.trackLine} />
          
          {/* Scrollable dates container */}
          <View 
            style={[
              styles.datesContainer,
              { 
                transform: [{ translateX: snappedOffset }],
              }
            ]}
          >
            {/* Date Notches */}
            {dateNotches.map((notch) => {
              const position = notch.offset * intervalInfo.pixelsPerUnit;
              const isCenter = notch.offset === currentInterval;
              
              return (
                <View
                  key={`${notch.offset}-${notch.date.getTime()}`}
                  style={[
                    styles.notchContainer,
                    { left: position }
                  ]}
                >
                  {/* Date label - ABOVE timeline */}
                  <Text 
                    style={[
                      styles.dateLabel,
                      isCenter && styles.dateLabelActive
                    ]}
                  >
                    {notch.label}
                  </Text>
                  {/* Notch line */}
                  <View 
                    style={[
                      styles.notchLine,
                      isCenter && styles.notchLineActive
                    ]} 
                  />
                </View>
              );
            })}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: 'transparent',
  },
  trackContainer: {
    position: 'relative',
    overflow: 'hidden',
  },
  track: {
    position: 'relative',
    height: 64,
  },
  trackLine: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  datesContainer: {
    position: 'absolute',
    bottom: 0,
    left: width / 2,
    height: '100%',
  },
  notchContainer: {
    position: 'absolute',
    bottom: 12,
    transform: [{ translateX: -0.5 }],
  },
  dateLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 6,
    textAlign: 'center',
    minWidth: 50,
  },
  dateLabelActive: {
    color: '#0891b2',
    fontWeight: 'bold',
  },
  notchLine: {
    width: 1,
    height: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  notchLineActive: {
    height: 14,
    backgroundColor: '#06b6d4',
    width: 2,
  },
});
