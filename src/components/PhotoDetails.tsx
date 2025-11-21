import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView, TextInput, Share, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Photo } from '../App';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image as ExpoImage } from 'expo-image';

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
  const photo = (routeParams.params as any)?.photo || (route as any)?.params?.photo;
  
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(photo?.likes || 0);
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<Array<{ author: string; text: string }>>([]);
  const [currentVisibility, setCurrentVisibility] = useState(photo?.visibility || 'friends');
  const [showVisibilityMenu, setShowVisibilityMenu] = useState(false);
  
  const isOwnPhoto = photo?.author === 'You';

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
    if (onVisibilityChange && photo) {
      onVisibilityChange(photo.id, newVisibility);
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
        style={styles.closeButton}
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
      </View>

      {/* Comments Section */}
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
    top: 16,
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
});
