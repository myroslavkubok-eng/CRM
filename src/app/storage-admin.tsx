import React, { useState, useEffect } from 'react';
import { RefreshCw, Database, FolderOpen, Image, AlertCircle, CheckCircle } from 'lucide-react';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { ImageSeeder } from './components/storage/ImageSeeder';

interface BucketStatus {
  exists: boolean;
  bucket?: {
    id: string;
    name: string;
    public: boolean;
    file_size_limit: number;
  };
  bucketName?: string;
  folders?: Array<{
    folder: string;
    count: number;
    error?: string;
  }>;
  totalImages?: number;
  message?: string;
}

export default function StorageAdmin() {
  const [status, setStatus] = useState<BucketStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [initLoading, setInitLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-3e5c72fb/storage/status`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch storage status');
      }

      const data = await response.json();
      setStatus(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const initializeBucket = async () => {
    setInitLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-3e5c72fb/storage/init`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to initialize bucket');
      }

      const data = await response.json();
      console.log('✅ Bucket initialized:', data);
      
      // Обновляем статус после инициализации
      await fetchStatus();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setInitLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Database className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Storage Admin</h1>
                <p className="text-gray-500 mt-1">Supabase Storage Management</p>
              </div>
            </div>
            <button
              onClick={fetchStatus}
              disabled={loading}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 flex items-center gap-2 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-red-900">Error</h3>
              <p className="text-red-700 text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && !status && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <RefreshCw className="w-8 h-8 text-purple-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Loading storage status...</p>
          </div>
        )}

        {/* Bucket Not Found */}
        {status && !status.exists && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-8 text-center">
            <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Bucket Not Found</h2>
            <p className="text-gray-600 mb-6">{status.message}</p>
            <button
              onClick={initializeBucket}
              disabled={initLoading}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg disabled:opacity-50 transition-all"
            >
              {initLoading ? 'Initializing...' : 'Initialize Bucket'}
            </button>
          </div>
        )}

        {/* Bucket Status */}
        {status && status.exists && (
          <>
            {/* Bucket Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-6 h-6 text-green-500" />
                <h2 className="text-xl font-bold text-gray-900">Bucket Active</h2>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">Bucket Name</p>
                  <p className="font-semibold text-gray-900">{status.bucketName}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">Total Images</p>
                  <p className="font-semibold text-gray-900">{status.totalImages || 0}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">Public Access</p>
                  <p className="font-semibold text-gray-900">
                    {status.bucket?.public ? 'Enabled' : 'Disabled'}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">File Size Limit</p>
                  <p className="font-semibold text-gray-900">
                    {status.bucket?.file_size_limit 
                      ? `${(status.bucket.file_size_limit / 1024 / 1024).toFixed(1)} MB`
                      : 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Folders Stats */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <FolderOpen className="w-6 h-6 text-purple-500" />
                <h2 className="text-xl font-bold text-gray-900">Folder Statistics</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {status.folders?.map((folder) => (
                  <div
                    key={folder.folder}
                    className="border-2 border-gray-200 rounded-xl p-4 hover:border-purple-300 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Image className="w-5 h-5 text-purple-500" />
                        <span className="font-semibold text-gray-900 capitalize">
                          {folder.folder}
                        </span>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          folder.count > 0
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {folder.count}
                      </span>
                    </div>
                    {folder.error && (
                      <p className="text-xs text-red-500 mt-2">{folder.error}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Reinitialize Button */}
            <div className="mt-6 text-center">
              <button
                onClick={initializeBucket}
                disabled={initLoading}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 disabled:opacity-50 transition-colors"
              >
                {initLoading ? 'Reinitializing...' : 'Reinitialize Bucket'}
              </button>
            </div>

            {/* Image Seeder */}
            <div className="mt-8">
              <ImageSeeder onUploadComplete={fetchStatus} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}