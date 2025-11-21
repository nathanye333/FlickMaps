import { useState, useRef } from 'react';
import { X, Upload, AlertCircle, Check } from 'lucide-react';
import EXIF from 'exif-js';

interface PhotoUploadModalProps {
  onClose: () => void;
  onPhotosUploaded: (photos: UploadedPhoto[]) => void;
}

export interface UploadedPhoto {
  imageUrl: string;
  lat: number;
  lng: number;
  timestamp: Date;
  fileName: string;
}

export function PhotoUploadModal({ onClose, onPhotosUploaded }: PhotoUploadModalProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [processingStatus, setProcessingStatus] = useState<{
    [key: string]: 'processing' | 'success' | 'error';
  }>({});
  const [errorMessages, setErrorMessages] = useState<{ [key: string]: string }>({});
  const [uploadedPhotos, setUploadedPhotos] = useState<UploadedPhoto[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    setSelectedFiles(files);
    const newStatus: { [key: string]: 'processing' | 'success' | 'error' } = {};
    const newErrors: { [key: string]: string } = {};
    const validPhotos: UploadedPhoto[] = [];

    for (const file of files) {
      newStatus[file.name] = 'processing';
      setProcessingStatus({ ...newStatus });

      try {
        // Parse EXIF data
        const exifData: any = await new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = function() {
            EXIF.getData(img as any, function(this: any) {
              const allTags = EXIF.getAllTags(this);
              if (Object.keys(allTags).length > 0) {
                resolve(allTags);
              } else {
                reject(new Error('No EXIF data found'));
              }
            });
          };
          img.onerror = () => reject(new Error('Failed to load image'));
          img.src = URL.createObjectURL(file);
        });

        // Helper function to convert GPS coordinates
        const convertDMSToDD = (degrees: number, minutes: number, seconds: number, direction: string) => {
          let dd = degrees + minutes / 60 + seconds / 3600;
          if (direction === 'S' || direction === 'W') {
            dd = dd * -1;
          }
          return dd;
        };

        // Extract and convert GPS data
        let lat: number | null = null;
        let lng: number | null = null;

        if (exifData.GPSLatitude && exifData.GPSLatitudeRef) {
          const latArray = exifData.GPSLatitude;
          lat = convertDMSToDD(latArray[0], latArray[1], latArray[2], exifData.GPSLatitudeRef);
        }

        if (exifData.GPSLongitude && exifData.GPSLongitudeRef) {
          const lngArray = exifData.GPSLongitude;
          lng = convertDMSToDD(lngArray[0], lngArray[1], lngArray[2], exifData.GPSLongitudeRef);
        }

        // Validate GPS data
        if (lat === null || lng === null) {
          newStatus[file.name] = 'error';
          newErrors[file.name] = 'No GPS data found';
          continue;
        }

        // Extract date
        let photoDate: Date;
        if (exifData.DateTimeOriginal) {
          // Parse EXIF date format: "YYYY:MM:DD HH:MM:SS"
          const dateStr = exifData.DateTimeOriginal.replace(/^(\d{4}):(\d{2}):(\d{2})/, '$1-$2-$3');
          photoDate = new Date(dateStr);
        } else if (exifData.DateTime) {
          const dateStr = exifData.DateTime.replace(/^(\d{4}):(\d{2}):(\d{2})/, '$1-$2-$3');
          photoDate = new Date(dateStr);
        } else {
          // Use file modification date as fallback
          photoDate = new Date(file.lastModified);
        }

        // Validate date
        if (isNaN(photoDate.getTime())) {
          newStatus[file.name] = 'error';
          newErrors[file.name] = 'Invalid date information';
          continue;
        }

        // Create object URL for the image
        const imageUrl = URL.createObjectURL(file);

        // Add to valid photos
        validPhotos.push({
          imageUrl,
          lat,
          lng,
          timestamp: photoDate,
          fileName: file.name,
        });

        newStatus[file.name] = 'success';
      } catch (error) {
        newStatus[file.name] = 'error';
        newErrors[file.name] = typeof error === 'string' ? error : 'Failed to read photo metadata';
      }
    }

    setProcessingStatus(newStatus);
    setErrorMessages(newErrors);
    setUploadedPhotos(validPhotos);
  };

  const handleUpload = () => {
    if (uploadedPhotos.length > 0) {
      onPhotosUploaded(uploadedPhotos);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-lg text-gray-900">Upload Photos</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {selectedFiles.length === 0 ? (
            /* Upload Area */
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-cyan-500 transition-colors"
            >
              <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center">
                <Upload className="w-8 h-8 text-cyan-600" />
              </div>
              <div className="text-center">
                <p className="text-gray-900 mb-1">Select photos to upload</p>
                <p className="text-xs text-gray-500">
                  Photos must have GPS data and date information
                </p>
              </div>
              <button className="px-4 py-2 bg-cyan-500 text-white rounded-full hover:bg-cyan-600 transition-colors">
                Choose Photos
              </button>
            </div>
          ) : (
            /* File List */
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-600">
                  {uploadedPhotos.length} of {selectedFiles.length} photos valid
                </p>
                <button
                  onClick={() => {
                    setSelectedFiles([]);
                    setProcessingStatus({});
                    setErrorMessages({});
                    setUploadedPhotos([]);
                  }}
                  className="text-xs text-cyan-600 hover:text-cyan-700"
                >
                  Clear All
                </button>
              </div>

              {selectedFiles.map((file) => {
                const status = processingStatus[file.name];
                return (
                  <div
                    key={file.name}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 truncate">{file.name}</p>
                      {status === 'error' && errorMessages[file.name] && (
                        <p className="text-xs text-red-600 mt-1">
                          {errorMessages[file.name]}
                        </p>
                      )}
                      {status === 'success' && (
                        <p className="text-xs text-green-600 mt-1">
                          Ready to upload
                        </p>
                      )}
                    </div>
                    <div className="flex-shrink-0">
                      {status === 'processing' && (
                        <div className="w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                      )}
                      {status === 'success' && (
                        <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                      {status === 'error' && (
                        <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                          <AlertCircle className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Info Box */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex gap-2">
              <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-blue-900">
                <p className="mb-1">Photos must include:</p>
                <ul className="list-disc list-inside space-y-0.5 ml-2">
                  <li>GPS location data (latitude/longitude)</li>
                  <li>Date/time information (EXIF metadata)</li>
                </ul>
                <p className="mt-2 text-blue-700">
                  Most photos taken with smartphones automatically include this data.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        {selectedFiles.length > 0 && (
          <div className="p-4 border-t border-gray-100 flex gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
            >
              Add More
            </button>
            <button
              onClick={handleUpload}
              disabled={uploadedPhotos.length === 0}
              className={`flex-1 py-3 rounded-xl transition-colors ${
                uploadedPhotos.length > 0
                  ? 'bg-cyan-500 text-white hover:bg-cyan-600'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Upload {uploadedPhotos.length > 0 && `(${uploadedPhotos.length})`}
            </button>
          </div>
        )}

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    </div>
  );
}