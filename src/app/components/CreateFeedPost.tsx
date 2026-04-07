import { useState } from 'react';
import { X, Upload, Image as ImageIcon, Calendar, Clock, DollarSign } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { toast } from 'sonner';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';

interface CreateFeedPostProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  salonId: string;
  salonName: string;
  accessToken: string;
}

export function CreateFeedPost({ 
  isOpen, 
  onClose, 
  onSuccess, 
  salonId, 
  salonName,
  accessToken 
}: CreateFeedPostProps) {
  const [postType, setPostType] = useState<'post' | 'last-minute'>('post');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);

  // Last-minute specific fields
  const [serviceName, setServiceName] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [availableDate, setAvailableDate] = useState('');
  const [availableTime, setAvailableTime] = useState('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImageToStorage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'feed');

    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-3e5c72fb/storage/upload`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${publicAnonKey}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error('Failed to upload image');
    }

    const data = await response.json();
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    if (postType === 'last-minute') {
      if (!serviceName.trim()) {
        toast.error('Please enter service name for last-minute booking');
        return;
      }
      // Validate prices only if one of them is filled
      if ((originalPrice || discountPrice) && (!originalPrice || !discountPrice)) {
        toast.error('Please fill both original price and discount price, or leave both empty');
        return;
      }
    }

    try {
      setIsUploading(true);

      // Upload image if present
      let imageUrl = '';
      if (imageFile) {
        toast.info('Uploading image...');
        imageUrl = await uploadImageToStorage(imageFile);
      }

      // Create post data
      const postData = {
        salonId,
        salonName,
        type: postType,
        title,
        description,
        category,
        imageUrl,
        ...(postType === 'last-minute' && {
          serviceName,
          originalPrice: parseFloat(originalPrice),
          discountPrice: parseFloat(discountPrice),
          availableDate,
          availableTime,
        }),
      };

      // Send to backend
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-3e5c72fb/feed/posts`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(postData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create post');
      }

      toast.success('Post created successfully!');
      onSuccess();
      onClose();
      resetForm();
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create post');
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setPostType('post');
    setTitle('');
    setDescription('');
    setCategory('');
    setImageFile(null);
    setImagePreview('');
    setServiceName('');
    setOriginalPrice('');
    setDiscountPrice('');
    setAvailableDate('');
    setAvailableTime('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Create New Post
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Post Type Selection */}
          <div className="space-y-3">
            <Label>Post Type</Label>
            <RadioGroup value={postType} onValueChange={(value) => setPostType(value as 'post' | 'last-minute')}>
              <div className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors cursor-pointer">
                <RadioGroupItem value="post" id="post" />
                <Label htmlFor="post" className="cursor-pointer flex-1">
                  <div className="font-medium">Regular Post</div>
                  <div className="text-sm text-gray-500">Share news, updates, or promotions</div>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors cursor-pointer">
                <RadioGroupItem value="last-minute" id="last-minute" />
                <Label htmlFor="last-minute" className="cursor-pointer flex-1">
                  <div className="font-medium">Last Minute Deal</div>
                  <div className="text-sm text-gray-500">Offer discounted slots available today</div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="Enter post title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Tell your story..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              placeholder="Enter category..."
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label>Image</Label>
            
            {imagePreview ? (
              <div className="relative aspect-video rounded-lg overflow-hidden border border-gray-200">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 bg-white/90 hover:bg-white"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview('');
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center aspect-video border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-400 transition-colors cursor-pointer bg-gray-50">
                <ImageIcon className="w-12 h-12 text-gray-400 mb-2" />
                <span className="text-sm text-gray-600">Click to upload image</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            )}
          </div>

          {/* Last-Minute Specific Fields */}
          {postType === 'last-minute' && (
            <div className="space-y-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
              <h3 className="font-semibold text-purple-900">Last Minute Details</h3>
              
              <div className="space-y-2">
                <Label htmlFor="serviceName">Service Name *</Label>
                <Input
                  id="serviceName"
                  placeholder="e.g., Haircut & Styling"
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  required={postType === 'last-minute'}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="originalPrice">Original Price (AED)</Label>
                  <Input
                    id="originalPrice"
                    type="number"
                    step="0.01"
                    placeholder="150 (optional)"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="discountPrice">Discount Price (AED)</Label>
                  <Input
                    id="discountPrice"
                    type="number"
                    step="0.01"
                    placeholder="99 (optional)"
                    value={discountPrice}
                    onChange={(e) => setDiscountPrice(e.target.value)}
                  />
                </div>
              </div>

              <p className="text-xs text-gray-600 italic">
                💡 If prices are not provided, this will show as "LAST MINUTE" without a discount badge
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="availableDate">Available Date *</Label>
                  <Input
                    id="availableDate"
                    type="date"
                    value={availableDate}
                    onChange={(e) => setAvailableDate(e.target.value)}
                    required={postType === 'last-minute'}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="availableTime">Available Time *</Label>
                  <Input
                    id="availableTime"
                    type="time"
                    value={availableTime}
                    onChange={(e) => setAvailableTime(e.target.value)}
                    required={postType === 'last-minute'}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Footer Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <Upload className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Post'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}