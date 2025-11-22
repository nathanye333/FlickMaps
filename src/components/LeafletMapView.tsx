import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';

const { width, height } = Dimensions.get('window');

export interface LeafletMarker {
  id: string;
  lat: number;
  lng: number;
  imageUrl?: string;
  title?: string;
  photos?: any[];
  // For author information
  author?: string;
  authorAvatar?: string;
}

interface LeafletMapViewProps {
  markers?: LeafletMarker[];
  initialCenter?: { lat: number; lng: number };
  initialZoom?: number;
  onMarkerPress?: (marker: LeafletMarker) => void;
  onRegionChange?: (region: { lat: number; lng: number; zoom: number }) => void;
  selectedMarkerId?: string;
  style?: any;
}

export interface LeafletMapViewRef {
  setCenter: (lat: number, lng: number, zoom?: number) => void;
  setZoom: (zoom: number) => void;
}

export const LeafletMapView = forwardRef<LeafletMapViewRef, LeafletMapViewProps>(({
  markers = [],
  initialCenter = { lat: 37.7749, lng: -122.4194 },
  initialZoom = 13,
  onMarkerPress,
  onRegionChange,
  selectedMarkerId,
  style,
}, ref) => {
  const webViewRef = useRef<WebView>(null);

  useImperativeHandle(ref, () => ({
    setCenter: (lat: number, lng: number, zoom?: number) => {
      if (webViewRef.current) {
        const message = JSON.stringify({
          type: 'setCenter',
          lat,
          lng,
          zoom: zoom || initialZoom,
        });
        webViewRef.current.postMessage(message);
      }
    },
    setZoom: (zoom: number) => {
      if (webViewRef.current) {
        const message = JSON.stringify({
          type: 'setZoom',
          zoom,
        });
        webViewRef.current.postMessage(message);
      }
    },
  }), [initialZoom]);

  // Generate HTML for Leaflet map
  const generateMapHTML = () => {
    const markersJS = markers
      .map((marker, index) => {
        const isSelected = selectedMarkerId === marker.id;
        
        // Get photos array and extract author information
        // If no photos array, treat marker as a single photo
        const allPhotos = marker.photos && marker.photos.length > 0 
          ? marker.photos 
          : marker.imageUrl 
            ? [{ 
                imageUrl: marker.imageUrl, 
                author: marker.author, 
                authorAvatar: marker.authorAvatar 
              }]
            : [];
        
        const photoCount = allPhotos.length;
        const isStack = photoCount > 1;
        
        // Get unique authors for avatar display (up to 3)
        const uniqueAuthors = Array.from(
          new Map(
            allPhotos
              .filter(p => p && p.author && p.authorAvatar)
              .map(p => [p.author, p])
          ).values()
        );
        const displayAuthors = uniqueAuthors.slice(0, 3);
        const remainingCount = Math.max(0, uniqueAuthors.length - 3);
        
        // Use first photo's image or marker's imageUrl
        const firstPhoto = allPhotos.length > 0 ? allPhotos[0] : null;
        const imageUrl = firstPhoto?.imageUrl || marker.imageUrl || 'https://via.placeholder.com/100';
        
        // Calculate marker size - larger base size, adaptive based on selection and stack
        // Base size: 100px (much larger than original 60px)
        // Selected: up to 130px, Stack: 110px, Single: 100px
        const baseSize = 100;
        const markerSize = isSelected 
          ? Math.min(baseSize * 1.3, 130) 
          : isStack 
            ? baseSize * 1.1 
            : baseSize;
        
        const safeId = marker.id.replace(/[^a-zA-Z0-9]/g, '_');
        
        // Avatar size scales with marker size
        const avatarSize = Math.max(20, markerSize * 0.22);
        const avatarMargin = Math.max(1, markerSize * 0.015);
        
        // Generate avatars HTML with proper positioning
        const avatarsHTML = displayAuthors.map((authorPhoto, idx) => {
          const leftPos = 2 + (idx * (avatarSize + avatarMargin));
          return `
            <div style="
              position: absolute;
              left: ${leftPos}px;
              top: 2px;
              width: ${avatarSize}px;
              height: ${avatarSize}px;
              border-radius: 50%;
              border: 2px solid white;
              overflow: hidden;
              box-shadow: 0 1px 3px rgba(0,0,0,0.2);
              background: white;
              z-index: ${10 + displayAuthors.length - idx};
            ">
              <img 
                src="${authorPhoto.authorAvatar || ''}" 
                style="width: 100%; height: 100%; object-fit: cover;"
                onerror="this.style.display='none'"
              />
            </div>
          `;
        }).join('');
        
        // Remaining authors indicator
        const remainingAvatarsHTML = remainingCount > 0 ? `
          <div style="
            position: absolute;
            left: ${2 + (displayAuthors.length * (avatarSize + avatarMargin))}px;
            top: 2px;
            width: ${avatarSize}px;
            height: ${avatarSize}px;
            border-radius: 50%;
            border: 2px solid white;
            background: #f3f4f6;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 1px 3px rgba(0,0,0,0.2);
            z-index: 10;
          ">
            <span style="
              color: #374151;
              font-size: ${Math.max(8, markerSize * 0.08)}px;
              font-weight: 600;
            ">+${remainingCount}</span>
          </div>
        ` : '';
        
        // "and x others" text for stacks with more than 3 authors
        const othersTextHTML = isStack && remainingCount > 0 ? `
          <div style="
            position: absolute;
            top: ${Math.max(26, markerSize * 0.32)}px;
            left: 2px;
            background: rgba(0, 0, 0, 0.7);
            border-radius: 6px;
            padding: 3px 6px;
            max-width: 100px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.3);
            z-index: 10;
          ">
            <span style="
              color: white;
              font-size: ${Math.max(7, markerSize * 0.09)}px;
              font-weight: 600;
              white-space: nowrap;
            ">and ${remainingCount} other${remainingCount !== 1 ? 's' : ''}</span>
          </div>
        ` : '';
        
        // Photo count badge
        const photoCountBadgeHTML = isStack ? `
          <div style="
            position: absolute;
            top: -8px;
            right: -8px;
            background: #06b6d4;
            color: white;
            border-radius: 50%;
            min-width: ${Math.max(22, markerSize * 0.22)}px;
            min-height: ${Math.max(22, markerSize * 0.22)}px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: ${Math.max(10, markerSize * 0.1)}px;
            font-weight: 600;
            border: 2px solid white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            padding: 2px 6px;
            z-index: 10;
          ">${photoCount}</div>
        ` : '';
        
        const markerHTML = `
          <div style="
            width: ${markerSize}px;
            height: ${markerSize}px;
            position: relative;
          ">
            <img 
              src="${imageUrl}" 
              style="
                width: 100%;
                height: 100%;
                border-radius: 12px;
                border: 2px solid white;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                object-fit: cover;
              "
              onerror="this.src='https://via.placeholder.com/100'"
            />
            ${avatarsHTML}
            ${remainingAvatarsHTML}
            ${othersTextHTML}
            ${photoCountBadgeHTML}
          </div>
        `;
        
        return `
          const marker${safeId} = L.marker([${marker.lat}, ${marker.lng}], {
            icon: L.divIcon({
              className: 'custom-marker',
              html: ${JSON.stringify(markerHTML)},
              iconSize: [${markerSize}, ${markerSize}],
              iconAnchor: [${markerSize / 2}, ${markerSize}]
            }),
            zIndexOffset: ${isSelected ? 1000 : isStack ? 100 : 10}
          }).addTo(map);
          
          marker${safeId}.on('click', function() {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'markerClick',
              markerId: '${marker.id}',
              lat: ${marker.lat},
              lng: ${marker.lng}
            }));
          });
        `;
      })
      .join('');

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
          <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body, html {
              width: 100%;
              height: 100%;
              overflow: hidden;
            }
            #map {
              width: 100%;
              height: 100%;
            }
            .custom-marker {
              background: transparent;
              border: none;
            }
          </style>
        </head>
        <body>
          <div id="map"></div>
          <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
          <script>
            const map = L.map('map', {
              zoomControl: false,
              attributionControl: false,
              dragging: true,
              touchZoom: true,
              doubleClickZoom: true,
              scrollWheelZoom: true,
              boxZoom: true,
              keyboard: true
            }).setView([${initialCenter.lat}, ${initialCenter.lng}], ${initialZoom});

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              maxZoom: 19,
              attribution: '© OpenStreetMap'
            }).addTo(map);

            ${markersJS}

            let isMoving = false;
            map.on('moveend', function() {
              if (!isMoving) {
                isMoving = true;
                const center = map.getCenter();
                const zoom = map.getZoom();
                window.ReactNativeWebView.postMessage(JSON.stringify({
                  type: 'regionChange',
                  lat: center.lat,
                  lng: center.lng,
                  zoom: zoom
                }));
                setTimeout(() => { isMoving = false; }, 100);
              }
            });

            // Handle messages from React Native
            function handleNativeMessage(event) {
              try {
                const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
                if (data && data.type === 'setCenter') {
                  map.setView([data.lat, data.lng], data.zoom || map.getZoom());
                }
                if (data && data.type === 'setZoom') {
                  map.setZoom(data.zoom);
                }
              } catch (e) {
                console.error('Error handling message:', e);
              }
            }
            
            // Listen for messages from React Native WebView
            document.addEventListener('message', handleNativeMessage);
            window.addEventListener('message', handleNativeMessage);
          </script>
        </body>
      </html>
    `;
  };

  useEffect(() => {
    if (selectedMarkerId && webViewRef.current) {
      const marker = markers.find(m => m.id === selectedMarkerId);
      if (marker) {
        // Small delay to ensure WebView is ready
        const timer = setTimeout(() => {
          if (webViewRef.current) {
            const message = JSON.stringify({
              type: 'setCenter',
              lat: marker.lat,
              lng: marker.lng,
              zoom: 15,
            });
            webViewRef.current.postMessage(message);
          }
        }, 300);
        return () => clearTimeout(timer);
      }
    }
  }, [selectedMarkerId, markers]);

  const handleMessage = (event: any) => {
    try {
      const message = event.nativeEvent?.data || event.nativeEvent?.message;
      if (!message) return;
      
      const data = typeof message === 'string' ? JSON.parse(message) : message;
      
      if (data.type === 'markerClick') {
        const marker = markers.find(m => m.id === data.markerId);
        if (marker && onMarkerPress) {
          onMarkerPress(marker);
        }
      }
      
      if (data.type === 'regionChange' && onRegionChange) {
        onRegionChange({
          lat: data.lat,
          lng: data.lng,
          zoom: data.zoom,
        });
      }
    } catch (error) {
      console.error('Error parsing WebView message:', error);
    }
  };

  return (
    <View style={[styles.container, style]}>
        <WebView
        ref={webViewRef}
        source={{ html: generateMapHTML() }}
        style={styles.webview}
        onMessage={handleMessage}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        scalesPageToFit={false}
        scrollEnabled={false}
        bounces={false}
        mixedContentMode="always"
        injectedJavaScript={`
          (function() {
            if (!window.ReactNativeWebView) {
              window.ReactNativeWebView = {
                postMessage: function(data) {
                  if (window.postMessage) {
                    window.postMessage(data, '*');
                  }
                }
              };
            }
          })();
          true;
        `}
      />
    </View>
  );
});

LeafletMapView.displayName = 'LeafletMapView';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});

