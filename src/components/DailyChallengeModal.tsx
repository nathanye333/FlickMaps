import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Modal, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Photo } from '../App';
import { LinearGradient } from 'expo-linear-gradient';

interface DailyChallengeSubmission {
  id: string;
  photo: Photo;
  votes: number;
  hasVoted: boolean;
}

interface DailyChallengeModalProps {
  onClose: () => void;
  submissions: DailyChallengeSubmission[];
  onVote: (submissionId: string) => void;
  challengeTitle: string;
  challengeDescription: string;
  endsIn: string;
}

const { width } = Dimensions.get('window');

export function DailyChallengeModal({ 
  onClose, 
  submissions, 
  onVote, 
  challengeTitle,
  challengeDescription,
  endsIn 
}: DailyChallengeModalProps) {
  const [selectedSubmission, setSelectedSubmission] = useState<string | null>(null);
  
  // Debug: Log submissions to verify data is being passed
  React.useEffect(() => {
    console.log('Daily Challenge Submissions:', submissions.length, submissions);
  }, [submissions]);
  
  // Sort submissions by votes
  const sortedSubmissions = [...submissions].sort((a, b) => b.votes - a.votes);
  const winner = sortedSubmissions[0];

  return (
    <Modal
      visible={true}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.modal} onPress={(e) => e.stopPropagation()}>
          {/* Header */}
          <View style={styles.header}>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={20} color="#6b7280" />
            </Pressable>
            
            <View style={styles.headerContent}>
              <View style={styles.headerTop}>
                <View>
                  <Text style={styles.headerTitle}>Daily Challenge</Text>
                  <View style={styles.headerMeta}>
                    <Ionicons name="time" size={12} color="#6b7280" />
                    <Text style={styles.headerMetaText}>Ends {endsIn}</Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.challengeInfo}>
                <Text style={styles.challengeTitle}>{challengeTitle}</Text>
                <Text style={styles.challengeDescription}>{challengeDescription}</Text>
              </View>
            </View>
          </View>

          {/* Submissions Grid */}
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.submissionsHeader}>
              <Text style={styles.submissionsCount}>
                {submissions.length} Submission{submissions.length !== 1 ? 's' : ''} Competing
              </Text>
              {winner && (
                <View style={styles.leadingBadge}>
                  <Ionicons name="trophy" size={16} color="#ea580c" />
                  <Text style={styles.leadingText}>Leading: {winner.photo.author}</Text>
                </View>
              )}
            </View>

            <View style={styles.grid}>
              {sortedSubmissions.map((submission, index) => (
                <Pressable
                  key={submission.id}
                  onPress={() => {
                    setSelectedSubmission(submission.id);
                    onVote(submission.id);
                  }}
                  style={[
                    styles.submissionItem,
                    submission.hasVoted && styles.submissionItemVoted,
                    index === 0 && styles.submissionItemWinner,
                  ]}
                >
                  {/* Winner Badge */}
                  {index === 0 && (
                    <LinearGradient
                      colors={['#f97316', '#ec4899']}
                      style={styles.winnerBadge}
                    >
                      <Ionicons name="trophy" size={12} color="white" />
                      <Text style={styles.winnerBadgeText}>Leading</Text>
                    </LinearGradient>
                  )}
                  
                  <Image
                    source={{ uri: submission.photo.imageUrl }}
                    style={styles.submissionImage}
                    contentFit="cover"
                  />
                  
                  <View style={styles.submissionOverlay}>
                    <View style={styles.submissionInfo}>
                      <View style={styles.submissionAuthor}>
                        <Image
                          source={{ uri: submission.photo.authorAvatar }}
                          style={styles.submissionAvatar}
                          contentFit="cover"
                        />
                        <Text style={styles.submissionAuthorName}>{submission.photo.author}</Text>
                      </View>
                      
                      <Pressable
                        style={[
                          styles.voteButton,
                          submission.hasVoted && styles.voteButtonVoted
                        ]}
                        onPress={(e) => {
                          e.stopPropagation();
                          onVote(submission.id);
                        }}
                      >
                        <Ionicons 
                          name={submission.hasVoted ? "heart" : "heart-outline"} 
                          size={16} 
                          color={submission.hasVoted ? "white" : "#374151"} 
                        />
                        <Text style={[
                          styles.voteCount,
                          submission.hasVoted && styles.voteCountVoted
                        ]}>
                          {submission.votes}
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                </Pressable>
              ))}
            </View>
            
            {submissions.length === 0 && (
              <View style={styles.emptyState}>
                <Ionicons name="camera" size={64} color="#d1d5db" />
                <Text style={styles.emptyStateText}>
                  Upload a photo to participate in today's challenge
                </Text>
              </View>
            )}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  header: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  headerContent: {
    paddingRight: 48,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    color: '#111827',
    fontWeight: '600',
  },
  headerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  headerMetaText: {
    fontSize: 12,
    color: '#6b7280',
  },
  challengeInfo: {
    padding: 12,
    backgroundColor: '#fff7ed',
    borderRadius: 12,
  },
  challengeTitle: {
    fontSize: 14,
    color: '#111827',
    marginBottom: 4,
    fontWeight: '500',
  },
  challengeDescription: {
    fontSize: 12,
    color: '#6b7280',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  submissionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  submissionsCount: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
  },
  leadingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  leadingText: {
    fontSize: 12,
    color: '#ea580c',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  submissionItem: {
    width: (width - 80) / 2,
    aspectRatio: 1,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    backgroundColor: '#f3f4f6',
  },
  submissionItemVoted: {
    borderColor: '#06b6d4',
    shadowColor: '#06b6d4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  submissionItemWinner: {
    borderWidth: 2,
    borderColor: '#f97316',
  },
  winnerBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  winnerBadgeText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600',
  },
  submissionImage: {
    width: '100%',
    height: '100%',
  },
  submissionOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  submissionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  submissionAuthor: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  submissionAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'white',
  },
  submissionAuthorName: {
    fontSize: 12,
    color: 'white',
    fontWeight: '500',
  },
  voteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  voteButtonVoted: {
    backgroundColor: '#06b6d4',
  },
  voteCount: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '600',
  },
  voteCountVoted: {
    color: 'white',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 16,
    textAlign: 'center',
  },
});
