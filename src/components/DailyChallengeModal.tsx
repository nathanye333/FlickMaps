import { useState } from 'react';
import { X, Trophy, ThumbsUp, Camera, Clock, MapPin } from 'lucide-react';
import { Photo } from '../App';

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

export function DailyChallengeModal({ 
  onClose, 
  submissions, 
  onVote, 
  challengeTitle,
  challengeDescription,
  endsIn 
}: DailyChallengeModalProps) {
  const [selectedSubmission, setSelectedSubmission] = useState<string | null>(null);
  
  // Sort submissions by votes
  const sortedSubmissions = [...submissions].sort((a, b) => b.votes - a.votes);
  const winner = sortedSubmissions[0];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="relative px-6 py-5 border-b border-gray-200">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
          
          <div className="pr-12">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center">
                <Camera className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-gray-900">Daily Challenge</h2>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span>Ends {endsIn}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-3 p-3 bg-gradient-to-br from-orange-50 to-pink-50 rounded-xl">
              <p className="text-sm text-gray-900 mb-1">{challengeTitle}</p>
              <p className="text-xs text-gray-600">{challengeDescription}</p>
            </div>
          </div>
        </div>

        {/* Submissions Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm text-gray-900">
              {submissions.length} Friend{submissions.length !== 1 ? 's' : ''} Competing
            </h3>
            {winner && (
              <div className="flex items-center gap-1 text-xs text-orange-600">
                <Trophy className="w-4 h-4" />
                <span>Leading: {winner.photo.author}</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {sortedSubmissions.map((submission, index) => (
              <div
                key={submission.id}
                className={`relative rounded-2xl overflow-hidden border-2 transition-all ${
                  submission.hasVoted 
                    ? 'border-cyan-500 shadow-lg shadow-cyan-500/20' 
                    : 'border-gray-200 hover:border-gray-300'
                } ${
                  index === 0 ? 'ring-2 ring-orange-400/50' : ''
                }`}
              >
                {/* Winner Badge */}
                {index === 0 && (
                  <div className="absolute top-3 left-3 z-10 px-2 py-1 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center gap-1 shadow-lg">
                    <Trophy className="w-3 h-3 text-white" />
                    <span className="text-xs text-white">Leading</span>
                  </div>
                )}

                {/* Photo */}
                <div className="relative aspect-square bg-gray-100">
                  <img
                    src={submission.photo.imageUrl}
                    alt={submission.photo.caption || 'Challenge submission'}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Author Avatar */}
                  <div className="absolute top-3 right-3 w-10 h-10 rounded-full border-2 border-white shadow-lg overflow-hidden">
                    <img
                      src={submission.photo.authorAvatar}
                      alt={submission.photo.author}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Info & Vote Section */}
                <div className="p-4 bg-white">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 mb-1">{submission.photo.author}</p>
                      {submission.photo.caption && (
                        <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                          {submission.photo.caption}
                        </p>
                      )}
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <MapPin className="w-3 h-3" />
                        <span className="line-clamp-1">{submission.photo.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Vote Button */}
                  <button
                    onClick={() => {
                      if (!submission.hasVoted) {
                        onVote(submission.id);
                      }
                    }}
                    disabled={submission.hasVoted}
                    className={`w-full py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all ${
                      submission.hasVoted
                        ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <ThumbsUp className={`w-4 h-4 ${submission.hasVoted ? 'fill-white' : ''}`} />
                    <span className="text-sm">
                      {submission.votes} {submission.votes === 1 ? 'Vote' : 'Votes'}
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* No submissions */}
          {submissions.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <Camera className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-600 mb-1">No submissions yet</p>
              <p className="text-sm text-gray-500">Be the first to participate!</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:shadow-lg hover:shadow-cyan-500/30 transition-all"
            onClick={onClose}
          >
            Join Challenge
          </button>
          <p className="text-xs text-center text-gray-500 mt-2">
            Upload a photo to participate in today's challenge
          </p>
        </div>
      </div>
    </div>
  );
}