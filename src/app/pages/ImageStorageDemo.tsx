import { useState, useEffect } from 'react';
import { Upload, Image as ImageIcon, Trash2, FolderOpen, Settings } from 'lucide-react';
import { ImageUploader } from '../components/ImageUploader';
import { SupabaseImage } from '../components/SupabaseImage';
import { Link } from 'react-router-dom';
import {
  listImages,
  deleteImage,
  IMAGE_FOLDERS,
  type ImageFile,
} from '../../utils/supabaseStorage';

/**
 * Демо-страница для тестирования Supabase Storage
 * Доступна по адресу: /image-storage-demo
 */
export default function ImageStorageDemo() {
  const [selectedFolder, setSelectedFolder] = useState<string>(IMAGE_FOLDERS.GENERAL);
  const [images, setImages] = useState<ImageFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState('');

  // Загружаем список изображений при выборе папки
  useEffect(() => {
    loadImages();
  }, [selectedFolder]);

  const loadImages = async () => {
    try {
      setLoading(true);
      const { files } = await listImages(selectedFolder);
      setImages(files);
    } catch (error) {
      console.error('Failed to load images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (filePath: string) => {
    if (!confirm('Delete this image?')) return;

    try {
      await deleteImage(filePath);
      setImages(images.filter((img) => img.path !== filePath));
    } catch (error) {
      console.error('Failed to delete image:', error);
      alert('Failed to delete image');
    }
  };

  const handleUploadComplete = (url: string) => {
    setUploadedUrl(url);
    // Перезагружаем список изображений
    setTimeout(() => loadImages(), 1000);
  };

  const folders = Object.entries(IMAGE_FOLDERS);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-4">
            <ImageIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Supabase Storage Demo
          </h1>
          <p className="text-gray-600 mb-4">
            Test image upload, listing, and deletion
          </p>
          <Link 
            to="/storage-admin"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all"
          >
            <Settings className="w-4 h-4" />
            Open Storage Admin
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Upload */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Upload className="w-5 h-5 text-purple-600" />
                Upload Image
              </h2>

              {/* Folder Selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Folder
                </label>
                <select
                  value={selectedFolder}
                  onChange={(e) => setSelectedFolder(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {folders.map(([key, value]) => (
                    <option key={value} value={value}>
                      {key.toLowerCase()} ({value})
                    </option>
                  ))}
                </select>
              </div>

              {/* Upload Component */}
              <ImageUploader
                folder={selectedFolder}
                onUploadComplete={handleUploadComplete}
                label="Drop image here"
              />

              {/* Upload Result */}
              {uploadedUrl && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm font-medium text-green-900 mb-2">
                    ✅ Uploaded successfully!
                  </p>
                  <p className="text-xs text-green-700 break-all">
                    {uploadedUrl}
                  </p>
                </div>
              )}

              {/* Stats */}
              <div className="mt-6 p-4 bg-purple-50 rounded-lg">
                <h3 className="text-sm font-medium text-purple-900 mb-2">
                  Storage Stats
                </h3>
                <div className="space-y-1 text-xs text-purple-700">
                  <p>Folder: <span className="font-semibold">{selectedFolder}</span></p>
                  <p>Images: <span className="font-semibold">{images.length}</span></p>
                  <p>Max Size: <span className="font-semibold">5 MB</span></p>
                  <p>Types: <span className="font-semibold">PNG, JPG, WebP, SVG</span></p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Image Gallery */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <FolderOpen className="w-5 h-5 text-purple-600" />
                  {selectedFolder} ({images.length})
                </h2>
                <button
                  onClick={loadImages}
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-purple-600 hover:bg-purple-50 rounded-lg transition-colors disabled:opacity-50"
                >
                  {loading ? 'Loading...' : 'Refresh'}
                </button>
              </div>

              {/* Image Grid */}
              {loading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="aspect-square bg-gray-200 rounded-lg animate-pulse"
                    />
                  ))}
                </div>
              ) : images.length === 0 ? (
                <div className="text-center py-12">
                  <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No images in this folder</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Upload your first image to get started
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {images.map((image) => (
                    <div
                      key={image.path}
                      className="group relative aspect-square bg-gray-100 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      {/* Image */}
                      <SupabaseImage
                        src={image.publicUrl}
                        alt={image.name}
                        className="w-full h-full object-cover"
                      />

                      {/* Overlay on Hover */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4">
                        <p className="text-white text-xs font-medium text-center mb-3 line-clamp-2">
                          {image.name}
                        </p>
                        <p className="text-white/70 text-xs mb-4">
                          {(image.size / 1024).toFixed(1)} KB
                        </p>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <a
                            href={image.publicUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 bg-white text-purple-600 rounded-lg text-xs font-medium hover:bg-purple-50 transition-colors"
                          >
                            View
                          </a>
                          <button
                            onClick={() => handleDelete(image.path)}
                            className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs font-medium hover:bg-red-600 transition-colors flex items-center gap-1"
                          >
                            <Trash2 className="w-3 h-3" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            📚 Documentation
          </h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-semibold text-purple-900 mb-2">
                Folder Structure
              </h4>
              <ul className="text-purple-700 space-y-1 text-xs">
                <li>• <code>logos/</code> - Salon logos</li>
                <li>• <code>products/</code> - Product photos</li>
                <li>• <code>certificates/</code> - Gift certificates</li>
                <li>• <code>masters/</code> - Master photos</li>
                <li>• <code>gallery/</code> - Work gallery</li>
                <li>• <code>avatars/</code> - User avatars</li>
              </ul>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">
                Validation Rules
              </h4>
              <ul className="text-blue-700 space-y-1 text-xs">
                <li>• Max size: 5 MB</li>
                <li>• Types: PNG, JPG, WebP, SVG</li>
                <li>• Auto-generated unique names</li>
                <li>• Public read access</li>
              </ul>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2">
                Features
              </h4>
              <ul className="text-green-700 space-y-1 text-xs">
                <li>• CDN-powered delivery</li>
                <li>• Automatic optimization</li>
                <li>• Lazy loading support</li>
                <li>• Fallback handling</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}