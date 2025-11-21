import { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { Photo } from '../App';
import { TimelineFilter } from './MapView';

interface TimelineScrubberProps {
  photos: Photo[];
  filter: TimelineFilter;
  onTimeChange: (currentDate: Date) => void;
  resetTrigger?: number;
}

export function TimelineScrubber({ photos, filter, onTimeChange, resetTrigger }: TimelineScrubberProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [startX, setStartX] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

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

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDragging(true);
    setStartX(e.clientX);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      const deltaX = e.clientX - startX;
      const newOffset = dragOffset + deltaX;
      // Clamp to prevent going into the future (offset < 0)
      setDragOffset(Math.max(newOffset, 0));
      setStartX(e.clientX);
    }
  }, [isDragging, startX, dragOffset]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (isDragging) {
      e.preventDefault();
      const deltaX = e.touches[0].clientX - startX;
      const newOffset = dragOffset + deltaX;
      // Clamp to prevent going into the future (offset < 0)
      setDragOffset(Math.max(newOffset, 0));
      setStartX(e.touches[0].clientX);
    }
  }, [isDragging, startX, dragOffset]);

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      // Snap to nearest interval when releasing
      const snapOffset = Math.round(dragOffset / intervalInfo.pixelsPerUnit) * intervalInfo.pixelsPerUnit;
      setDragOffset(Math.max(snapOffset, 0));
    }
    setIsDragging(false);
  }, [isDragging, dragOffset, intervalInfo.pixelsPerUnit]);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove]);

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
  const snappedOffset = isDragging ? dragOffset : Math.round(dragOffset / intervalInfo.pixelsPerUnit) * intervalInfo.pixelsPerUnit;

  return (
    <div className="w-full bg-transparent pointer-events-auto" ref={containerRef}>
      <div className="relative overflow-hidden">
        {/* Timeline Track */}
        <div
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          className={`relative h-16 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        >
          {/* Background Track - Number Line - positioned lower */}
          <div className="absolute bottom-3 left-0 right-0 h-0.5 bg-gray-800/30" />
          
          {/* Scrollable dates container */}
          <div 
            className="absolute bottom-0 left-1/2 h-full pointer-events-none"
            style={{ 
              transform: `translateX(${snappedOffset}px)`,
              transition: isDragging ? 'none' : 'transform 200ms ease-out'
            }}
          >
            {/* Date Notches */}
            {dateNotches.map((notch) => {
              const position = notch.offset * intervalInfo.pixelsPerUnit;
              const isCenter = notch.offset === -Math.round(snappedOffset / intervalInfo.pixelsPerUnit);
              
              return (
                <div
                  key={`${notch.offset}-${notch.date.getTime()}`}
                  className="absolute bottom-3 -translate-x-1/2"
                  style={{ left: `${position}px` }}
                >
                  {/* Date label - ABOVE timeline */}
                  <div 
                    className={`text-[10px] whitespace-nowrap -translate-x-1/2 relative left-1/2 mb-1.5 transition-all ${
                      isCenter
                        ? 'text-cyan-600 font-bold'
                        : 'text-gray-800 font-medium'
                    }`}
                  >
                    {notch.label}
                  </div>
                  {/* Notch line */}
                  <div 
                    className={`w-px transition-all ${
                      isCenter 
                        ? 'h-3.5 bg-cyan-500' 
                        : 'h-2.5 bg-gray-800/40'
                    }`} 
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}