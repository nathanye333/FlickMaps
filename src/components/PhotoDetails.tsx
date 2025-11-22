import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView, TextInput, Share, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Photo } from '../App';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image as ExpoImage } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Import AppContext from App.tsx
import { AppContext } from '../../App';

interface PhotoDetailsProps {
  photo?: Photo;
  onClose?: () => void;
  onViewOnMap?: () => void;
  onProfileClick?: (username: string) => void;
  onVisibilityChange?: (photoId: string, newVisibility: 'personal' | 'friends' | 'public') => void;
  navigation?: any;
  route?: any;
}

export function PhotoDetails({ onClose, onViewOnMap, onProfileClick, onVisibilityChange, navigation, route }: PhotoDetailsProps) {
  const nav = useNavigation();
  const routeParams = useRoute();
  const insets = useSafeAreaInsets();
  const photo = (routeParams.params as any)?.photo || (route as any)?.params?.photo;
  
  // Get context if available
  const context = React.useContext(AppContext);
  
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(photo?.likes || 0);
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<Array<{ author: string; text: string }>>([]);
  const [currentVisibility, setCurrentVisibility] = useState(photo?.visibility || 'friends');
  const [showVisibilityMenu, setShowVisibilityMenu] = useState(false);
  
  const isOwnPhoto = photo?.author === 'You';

  // Set selectedPhoto in context when component mounts or photo changes
  useEffect(() => {
    if (photo && context && context.setSelectedPhoto) {
      context.setSelectedPhoto(photo);
    }
  }, [photo, context]);

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      nav.goBack();
    }
  };

  const handleVisibilityChange = (newVisibility: 'personal' | 'friends' | 'public') => {
    setCurrentVisibility(newVisibility);
    setShowVisibilityMenu(false);
    // Use context's onVisibilityChange if available, otherwise use prop
    const visibilityHandler = (context && typeof context.onVisibilityChange === 'function') 
      ? context.onVisibilityChange 
      : onVisibilityChange;
    if (visibilityHandler && photo) {
      visibilityHandler(photo.id, newVisibility);
    }
  };

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case 'personal': return 'lock-closed' as const;
      case 'friends': return 'people' as const;
      case 'public': return 'globe' as const;
      default: return 'lock-closed' as const;
    }
  };

  const getVisibilityLabel = (visibility: string) => {
    switch (visibility) {
      case 'personal': return 'Only Me';
      case 'friends': return 'Friends';
      case 'public': return 'Public';
      default: return '';
    }
  };

  const handleLike = () => {
    if (isLiked) {
      setLikeCount(likeCount - 1);
    } else {
      setLikeCount(likeCount + 1);
    }
    setIsLiked(!isLiked);
  };

  const handleComment = () => {
    setShowComments(!showComments);
  };

  const handleSubmitComment = () => {
    if (comment.trim()) {
      setComments([...comments, { author: 'You', text: comment }]);
      setComment('');
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this photo from ${photo?.author} on FlickMaps!`,
        url: photo?.imageUrl,
      });
    } catch (error) {
      Alert.alert('Error', 'Unable to share photo');
    }
  };

  if (!photo) {
    return null;
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString();
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <View style={styles.container}>
      {/* Close Button */}
      <Pressable
        onPress={handleClose}
        style={[styles.closeButton, { top: Math.max(insets.top + 16, 44) }]}
      >
        <View style={styles.closeButtonInner}>
          <Ionicons name="close" size={24} color="white" />
        </View>
      </Pressable>

      {/* Photo */}
      <View style={styles.photoContainer}>
        <ExpoImage
          source={{ uri: photo.imageUrl }}
          style={styles.photo}
          contentFit="cover"
        />
        
        {/* Gradient Overlay */}
        <LinearGradient
          colors={['transparent', 'rgba(0, 0, 0, 0.8)']}
          style={styles.gradientOverlay}
        />
        
        {/* Photo Info Overlay */}
        <View style={styles.photoInfo}>
          <View style={styles.authorContainer}>
            <Pressable 
              onPress={() => onProfileClick && onProfileClick(photo.author)}
              style={styles.avatarButton}
            >
              {photo.authorAvatar ? (
                <ExpoImage source={{ uri: photo.authorAvatar }} style={styles.avatar} contentFit="cover" />
              ) : (
                <View style={[styles.avatar, styles.avatarPlaceholder]}>
                  <Text style={styles.avatarText}>{photo.author[0]}</Text>
                </View>
              )}
            </Pressable>
            <View style={styles.authorInfo}>
              <Pressable 
                onPress={() => onProfileClick && onProfileClick(photo.author)}
              >
                <Text style={styles.authorName}>{photo.author}</Text>
              </Pressable>
              <Text style={styles.timestamp}>
                {formatDate(photo.timestamp)} at {formatTime(photo.timestamp)}
              </Text>
            </View>
          </View>
          
          {photo.caption && (
            <Text style={styles.caption}>{photo.caption}</Text>
          )}
        </View>
      </View>

      {/* Action Bar */}
      <View style={styles.actionBar}>
        <Pressable style={styles.actionButton} onPress={handleLike}>
          <View style={[styles.actionButtonInner, isLiked && styles.actionButtonLiked]}>
            <Ionicons 
              name={isLiked ? "heart" : "heart-outline"} 
              size={24} 
              color={isLiked ? '#ef4444' : '#374151'} 
            />
          </View>
          <Text style={styles.actionLabel}>{likeCount}</Text>
        </Pressable>
        
        <Pressable style={styles.actionButton} onPress={handleComment}>
          <View style={[styles.actionButtonInner, showComments && styles.actionButtonActive]}>
            <Ionicons 
              name="chatbubble-outline" 
              size={24} 
              color={showComments ? '#06b6d4' : '#374151'} 
            />
          </View>
          <Text style={styles.actionLabel}>Comment</Text>
        </Pressable>
        
        <Pressable style={styles.actionButton} onPress={handleShare}>
          <View style={styles.actionButtonInner}>
            <Ionicons name="share-outline" size={24} color="#374151" />
          </View>
          <Text style={styles.actionLabel}>Share</Text>
        </Pressable>
        
        {/* Visibility button for own photos */}
        {isOwnPhoto && (
          <Pressable style={styles.actionButton} onPress={() => setShowVisibilityMenu(!showVisibilityMenu)}>
            <View style={[styles.actionButtonInner, showVisibilityMenu && styles.actionButtonActive]}>
              <Ionicons 
                name={getVisibilityIcon(currentVisibility)} 
                size={24} 
                color={showVisibilityMenu ? '#06b6d4' : '#374151'} 
              />
            </View>
            <Text style={styles.actionLabel}>{getVisibilityLabel(currentVisibility)}</Text>
          </Pressable>
        )}
      </View>
      
      {/* Visibility Menu */}
      {isOwnPhoto && showVisibilityMenu && (
        <View style={styles.visibilityMenu}>
          <Pressable 
            style={[styles.visibilityOption, currentVisibility === 'personal' && styles.visibilityOptionActive]}
            onPress={() => handleVisibilityChange('personal')}
          >
            <Ionicons name="lock-closed" size={20} color={currentVisibility === 'personal' ? '#06b6d4' : '#374151'} />
            <Text style={[styles.visibilityOptionText, currentVisibility === 'personal' && styles.visibilityOptionTextActive]}>
              Only Me
            </Text>
            {currentVisibility === 'personal' && <Ionicons name="checkmark" size={20} color="#06b6d4" />}
          </Pressable>
          
          <Pressable 
            style={[styles.visibilityOption, currentVisibility === 'friends' && styles.visibilityOptionActive]}
            onPress={() => handleVisibilityChange('friends')}
          >
            <Ionicons name="people" size={20} color={currentVisibility === 'friends' ? '#06b6d4' : '#374151'} />
            <Text style={[styles.visibilityOptionText, currentVisibility === 'friends' && styles.visibilityOptionTextActive]}>
              Friends
            </Text>
            {currentVisibility === 'friends' && <Ionicons name="checkmark" size={20} color="#06b6d4" />}
          </Pressable>
          
          <Pressable 
            style={[styles.visibilityOption, currentVisibility === 'public' && styles.visibilityOptionActive]}
            onPress={() => handleVisibilityChange('public')}
          >
            <Ionicons name="globe" size={20} color={currentVisibility === 'public' ? '#06b6d4' : '#374151'} />
            <Text style={[styles.visibilityOptionText, currentVisibility === 'public' && styles.visibilityOptionTextActive]}>
              Public
            </Text>
            {currentVisibility === 'public' && <Ionicons name="checkmark" size={20} color="#06b6d4" />}
          </Pressable>
        </View>
      )}

      {/* Comments Section - shown above View on Map button */}
      {showComments && (
        <View style={styles.commentsSection}>
          <View style={styles.commentsHeader}>
            <Text style={styles.commentsTitle}>Comments</Text>
            <Pressable onPress={() => setShowComments(false)}>
              <Text style={styles.closeCommentsText}>Close</Text>
            </Pressable>
          </View>
          
          <ScrollView style={styles.commentsList}>
            {comments.length === 0 ? (
              <Text style={styles.noComments}>No comments yet</Text>
            ) : (
              comments.map((c, i) => (
                <View key={i} style={styles.commentItem}>
                  <View style={styles.commentAvatar}>
                    <Text style={styles.commentAvatarText}>{c.author[0]}</Text>
                  </View>
                  <View style={styles.commentContent}>
                    <Text style={styles.commentAuthor}>{c.author}</Text>
                    <Text style={styles.commentText}>{c.text}</Text>
                  </View>
                </View>
              ))
            )}
          </ScrollView>
          
          <View style={styles.commentInputContainer}>
            <TextInput
              value={comment}
              onChangeText={setComment}
              placeholder="Add a comment..."
              style={styles.commentInput}
              onSubmitEditing={handleSubmitComment}
            />
            <Pressable onPress={handleSubmitComment} style={styles.sendButton}>
              <Ionicons name="send" size={20} color="#06b6d4" />
            </Pressable>
          </View>
        </View>
      )}

      {/* View on Map Button - always at bottom */}
      <Pressable 
        style={styles.viewOnMapButton} 
        onPress={() => {
          if (!photo) return;
          
          // Ensure photo is set in context
          if (context?.setSelectedPhoto) {
            context.setSelectedPhoto(photo);
          }
          
          if (onViewOnMap) {
            onViewOnMap();
          } else if (context?.onViewOnMap) {
            // Call the context's onViewOnMap handler
            context.onViewOnMap();
          } else {
            // Fallback behavior: set appropriate map tab and navigate to Map
            if (context?.setActiveMapTab) {
              const tab = photo.visibility === 'personal' ? 'personal' 
                : photo.visibility === 'friends' ? 'friends' 
                : 'global';
              context.setActiveMapTab(tab);
            }
            // Navigate to Map tab
            try {
              nav.goBack();
              setTimeout(() => {
                (nav as any).navigate('Main', { screen: 'Map' });
              }, 300);
            } catch (e) {
              // Fallback: just go back
              nav.goBack();
            }
          }
        }}
      >
        <Ionicons name="map" size={20} color="white" />
        <Text style={styles.viewOnMapText}>View on Map</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    zIndex: 30,
  },
  closeButtonInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoContainer: {
    flex: 1,
    position: 'relative',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 128,
  },
  photoInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  avatarButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarPlaceholder: {
    backgroundColor: '#06b6d4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 14,
    color: 'white',
    fontWeight: '500',
  },
  timestamp: {
    fontSize: 12,
    color: '#d1d5db',
    marginTop: 2,
  },
  caption: {
    fontSize: 14,
    color: 'white',
    marginBottom: 12,
  },
  actionBar: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  actionButton: {
    alignItems: 'center',
    gap: 4,
  },
  actionButtonInner: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonLiked: {
    backgroundColor: '#fef2f2',
  },
  actionButtonActive: {
    backgroundColor: '#ecfeff',
  },
  actionLabel: {
    fontSize: 12,
    color: '#4b5563',
  },
  commentsSection: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    maxHeight: 256,
  },
  commentsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  commentsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  closeCommentsText: {
    fontSize: 12,
    color: '#06b6d4',
  },
  commentsList: {
    paddingHorizontal: 16,
    maxHeight: 200,
  },
  noComments: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    paddingVertical: 16,
  },
  commentItem: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#06b6d4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  commentAvatarText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  commentContent: {
    flex: 1,
  },
  commentAuthor: {
    fontSize: 12,
    color: '#111827',
    fontWeight: '500',
  },
  commentText: {
    fontSize: 14,
    color: '#374151',
    marginTop: 2,
  },
  commentInputContainer: {
    flexDirection: 'row',
    gap: 8,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  commentInput: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    fontSize: 14,
  },
  sendButton: {
    padding: 8,
  },
  viewOnMapButton: {
    backgroundColor: '#06b6d4',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  viewOnMapText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  visibilityMenu: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingVertical: 8,
  },
  visibilityOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    gap: 12,
  },
  visibilityOptionActive: {
    backgroundColor: '#ecfeff',
  },
  visibilityOptionText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  visibilityOptionTextActive: {
    color: '#06b6d4',
    fontWeight: '600',
  },
});
