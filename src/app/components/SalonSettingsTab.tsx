import { useState, useRef } from 'react';
import { Eye, EyeOff, Upload, X, Image as ImageIcon, Wrench, Settings as SettingsIcon, CreditCard, DollarSign } from 'lucide-react';
import { Button } from './ui/button';
import { ResourceManagementTab } from './ResourceManagementTab';
import { StripeConnectSettings } from './StripeConnectSettings';
import { DepositSettings, DepositOption } from './DepositSettings';

interface WorkingHours {
  day: string;
  enabled: boolean;
  start: string;
  end: string;
}

interface SalonSettingsTabProps {
  salonId?: string;
  initialIsPublished?: boolean;
  onPublishChange?: (isPublished: boolean) => void;
}

export function SalonSettingsTab({ 
  salonId, 
  initialIsPublished = false,
  onPublishChange 
}: SalonSettingsTabProps) {
  const [activeTab, setActiveTab] = useState<'general' | 'resources' | 'payments' | 'deposits'>('general');
  const [salonName, setSalonName] = useState('Glamour Downtown');
  const [phone, setPhone] = useState('+1 234 567 8900');
  const [phoneNumber, setPhoneNumber] = useState('234 567 8900');
  const [countryCode, setCountryCode] = useState('+1');
  const [selectedCountry, setSelectedCountry] = useState('US');
  const [address, setAddress] = useState('123 Main St');
  const [description, setDescription] = useState('Tell clients about your salon');
  const [isPublished, setIsPublished] = useState(initialIsPublished);
  const [isUpdatingPublish, setIsUpdatingPublish] = useState(false);
  
  // Address Search State
  const [addressSuggestions, setAddressSuggestions] = useState<any[]>([]);
  const [showAddressSuggestions, setShowAddressSuggestions] = useState(false);
  const [isSearchingAddress, setIsSearchingAddress] = useState(false);
  const [salonCoordinates, setSalonCoordinates] = useState<{lat: number, lon: number} | null>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Saving state
  const [isSaving, setIsSaving] = useState(false);

  // Photo Gallery State
  const [galleryPhotos, setGalleryPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800',
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800',
    'https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?w=800',
    'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800',
  ]);

  // Cover Image State
  const [coverImage, setCoverImage] = useState('https://images.unsplash.com/photo-1681965823525-b684fb97e9fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBzYWxvbiUyMGludGVyaW9yfGVufDF8fHx8MTc2NjMzMDkwM3ww&ixlib=rb-4.1.0&q=80&w=1080');

  // Logo Image State
  const [logoImage, setLogoImage] = useState<string | null>(null);

  // File input refs for uploads
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  // Countries data with flags and phone codes
  const countries = [
    { code: 'US', flag: '🇺🇸', name: 'United States', dialCode: '+1' },
    { code: 'RU', flag: '🇷🇺', name: 'Russia', dialCode: '+7' },
    { code: 'UA', flag: '🇺🇦', name: 'Ukraine', dialCode: '+380' },
    { code: 'GB', flag: '🇬🇧', name: 'United Kingdom', dialCode: '+44' },
    { code: 'DE', flag: '🇩🇪', name: 'Germany', dialCode: '+49' },
    { code: 'FR', flag: '🇫🇷', name: 'France', dialCode: '+33' },
    { code: 'IT', flag: '🇮🇹', name: 'Italy', dialCode: '+39' },
    { code: 'ES', flag: '🇪🇸', name: 'Spain', dialCode: '+34' },
    { code: 'PL', flag: '🇵🇱', name: 'Poland', dialCode: '+48' },
    { code: 'CA', flag: '🇨🇦', name: 'Canada', dialCode: '+1' },
    { code: 'AU', flag: '🇦🇺', name: 'Australia', dialCode: '+61' },
    { code: 'BR', flag: '🇧🇷', name: 'Brazil', dialCode: '+55' },
    { code: 'MX', flag: '🇲🇽', name: 'Mexico', dialCode: '+52' },
    { code: 'JP', flag: '🇯🇵', name: 'Japan', dialCode: '+81' },
    { code: 'CN', flag: '🇨🇳', name: 'China', dialCode: '+86' },
    { code: 'IN', flag: '🇮🇳', name: 'India', dialCode: '+91' },
    { code: 'KR', flag: '🇰🇷', name: 'South Korea', dialCode: '+82' },
    { code: 'TR', flag: '🇹🇷', name: 'Turkey', dialCode: '+90' },
    { code: 'SA', flag: '🇸🇦', name: 'Saudi Arabia', dialCode: '+966' },
    { code: 'AE', flag: '🇦🇪', name: 'UAE', dialCode: '+971' },
    { code: 'IL', flag: '🇮🇱', name: 'Israel', dialCode: '+972' },
    { code: 'EG', flag: '🇪🇬', name: 'Egypt', dialCode: '+20' },
    { code: 'ZA', flag: '🇿🇦', name: 'South Africa', dialCode: '+27' },
    { code: 'AR', flag: '🇦🇷', name: 'Argentina', dialCode: '+54' },
    { code: 'CL', flag: '🇨🇱', name: 'Chile', dialCode: '+56' },
    { code: 'CO', flag: '🇨🇴', name: 'Colombia', dialCode: '+57' },
    { code: 'PE', flag: '🇵🇪', name: 'Peru', dialCode: '+51' },
    { code: 'VE', flag: '🇻🇪', name: 'Venezuela', dialCode: '+58' },
    { code: 'NL', flag: '🇳🇱', name: 'Netherlands', dialCode: '+31' },
    { code: 'BE', flag: '🇧🇪', name: 'Belgium', dialCode: '+32' },
    { code: 'AT', flag: '🇦🇹', name: 'Austria', dialCode: '+43' },
    { code: 'CH', flag: '🇨🇭', name: 'Switzerland', dialCode: '+41' },
    { code: 'SE', flag: '🇸🇪', name: 'Sweden', dialCode: '+46' },
    { code: 'NO', flag: '🇳🇴', name: 'Norway', dialCode: '+47' },
    { code: 'DK', flag: '🇩🇰', name: 'Denmark', dialCode: '+45' },
    { code: 'FI', flag: '🇫🇮', name: 'Finland', dialCode: '+358' },
    { code: 'PT', flag: '🇵🇹', name: 'Portugal', dialCode: '+351' },
    { code: 'GR', flag: '🇬🇷', name: 'Greece', dialCode: '+30' },
    { code: 'CZ', flag: '🇨🇿', name: 'Czech Republic', dialCode: '+420' },
    { code: 'RO', flag: '🇷🇴', name: 'Romania', dialCode: '+40' },
    { code: 'HU', flag: '🇭🇺', name: 'Hungary', dialCode: '+36' },
    { code: 'BG', flag: '🇧🇬', name: 'Bulgaria', dialCode: '+359' },
    { code: 'BY', flag: '🇧🇾', name: 'Belarus', dialCode: '+375' },
    { code: 'KZ', flag: '🇰🇿', name: 'Kazakhstan', dialCode: '+7' },
    { code: 'UZ', flag: '🇺🇿', name: 'Uzbekistan', dialCode: '+998' },
    { code: 'GE', flag: '🇬🇪', name: 'Georgia', dialCode: '+995' },
    { code: 'AM', flag: '🇦🇲', name: 'Armenia', dialCode: '+374' },
    { code: 'AZ', flag: '🇦🇿', name: 'Azerbaijan', dialCode: '+994' },
    { code: 'TH', flag: '🇹🇭', name: 'Thailand', dialCode: '+66' },
    { code: 'VN', flag: '🇻🇳', name: 'Vietnam', dialCode: '+84' },
    { code: 'PH', flag: '🇵🇭', name: 'Philippines', dialCode: '+63' },
    { code: 'ID', flag: '🇮🇩', name: 'Indonesia', dialCode: '+62' },
    { code: 'MY', flag: '🇲🇾', name: 'Malaysia', dialCode: '+60' },
    { code: 'SG', flag: '🇸🇬', name: 'Singapore', dialCode: '+65' },
    { code: 'NZ', flag: '����🇿', name: 'New Zealand', dialCode: '+64' },
    { code: 'IE', flag: '🇮🇪', name: 'Ireland', dialCode: '+353' },
    { code: 'LV', flag: '🇱🇻', name: 'Latvia', dialCode: '+371' },
    { code: 'LT', flag: '🇱🇹', name: 'Lithuania', dialCode: '+370' },
    { code: 'EE', flag: '🇪🇪', name: 'Estonia', dialCode: '+372' },
    { code: 'SK', flag: '🇸🇰', name: 'Slovakia', dialCode: '+421' },
    { code: 'SI', flag: '🇸🇮', name: 'Slovenia', dialCode: '+386' },
    { code: 'HR', flag: '🇭🇷', name: 'Croatia', dialCode: '+385' },
    { code: 'RS', flag: '🇷🇸', name: 'Serbia', dialCode: '+381' },
    { code: 'BA', flag: '🇧🇦', name: 'Bosnia', dialCode: '+387' },
    { code: 'ME', flag: '🇲🇪', name: 'Montenegro', dialCode: '+382' },
    { code: 'MK', flag: '🇲🇰', name: 'North Macedonia', dialCode: '+389' },
    { code: 'AL', flag: '🇦🇱', name: 'Albania', dialCode: '+355' },
    { code: 'MD', flag: '🇲🇩', name: 'Moldova', dialCode: '+373' },
  ];

  const currentCountry = countries.find(c => c.code === selectedCountry) || countries[0];

  // Handle country change
  const handleCountryChange = (countryCode: string) => {
    const country = countries.find(c => c.code === countryCode);
    if (country) {
      setSelectedCountry(countryCode);
      setCountryCode(country.dialCode);
      setPhone(`${country.dialCode} ${phoneNumber}`);
    }
  };

  // Handle phone number change
  const handlePhoneNumberChange = (value: string) => {
    setPhoneNumber(value);
    setPhone(`${countryCode} ${value}`);
  };

  // Search address using OpenStreetMap Nominatim API
  const searchAddress = async (query: string) => {
    if (query.length < 3) {
      setAddressSuggestions([]);
      setShowAddressSuggestions(false);
      return;
    }

    setIsSearchingAddress(true);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`,
        {
          headers: {
            'Accept-Language': 'en',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to search address');
      }

      const data = await response.json();
      setAddressSuggestions(data);
      setShowAddressSuggestions(data.length > 0);
    } catch (error) {
      console.error('Error searching address:', error);
      toast.error('Failed to search address. Please try again.');
    } finally {
      setIsSearchingAddress(false);
    }
  };

  // Handle address input change with debounce
  const handleAddressChange = (value: string) => {
    setAddress(value);

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout for debounced search
    searchTimeoutRef.current = setTimeout(() => {
      searchAddress(value);
    }, 500);
  };

  // Handle address selection from suggestions
  const handleAddressSelect = (suggestion: any) => {
    setAddress(suggestion.display_name);
    setSalonCoordinates({
      lat: parseFloat(suggestion.lat),
      lon: parseFloat(suggestion.lon),
    });
    setShowAddressSuggestions(false);
    toast.success('📍 Location saved! It will be shown on your public page.');
  };

  // Save all salon settings
  const handleSaveSettings = async () => {
    if (!salonId) {
      toast.error('Salon ID not found');
      return;
    }

    // Validation
    if (!salonName.trim()) {
      toast.error('Please enter salon name');
      return;
    }

    if (!phone.trim()) {
      toast.error('Please enter phone number');
      return;
    }

    if (!address.trim()) {
      toast.error('Please enter address');
      return;
    }

    setIsSaving(true);

    try {
      const url = `https://${projectId}.supabase.co/functions/v1/make-server-3e5c72fb/salon/${salonId}/settings`;
      console.log('Saving settings to:', url);
      
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          name: salonName,
          phone: phone,
          address: address,
          description: description,
          coordinates: salonCoordinates,
          logo: logoImage,
          cover: coverImage,
          gallery: galleryPhotos,
          workingHours: workingHours,
        }),
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const data = await response.json();
        console.error('Response error:', data);
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Response data:', data);

      toast.success('✅ All changes saved successfully!');
    } catch (error) {
      console.error('Error saving salon settings:', error);
      toast.error(`Failed to save: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const [workingHours, setWorkingHours] = useState<WorkingHours[]>([
    { day: 'Mon', enabled: true, start: '09:00', end: '18:00' },
    { day: 'Tue', enabled: true, start: '09:00', end: '18:00' },
    { day: 'Wed', enabled: true, start: '09:00', end: '18:00' },
    { day: 'Thu', enabled: true, start: '09:00', end: '18:00' },
    { day: 'Fri', enabled: true, start: '09:00', end: '18:00' },
    { day: 'Sat', enabled: false, start: '09:00', end: '18:00' },
    { day: 'Sun', enabled: false, start: '09:00', end: '18:00' }
  ]);

  const toggleDay = (index: number) => {
    setWorkingHours(prev => 
      prev.map((hour, i) => 
        i === index ? { ...hour, enabled: !hour.enabled } : hour
      )
    );
  };

  const updateTime = (index: number, field: 'start' | 'end', value: string) => {
    setWorkingHours(prev => 
      prev.map((hour, i) => 
        i === index ? { ...hour, [field]: value } : hour
      )
    );
  };

  const handlePublishToggle = async (newValue: boolean) => {
    if (!salonId) {
      toast.error('Salon ID not found');
      return;
    }

    setIsUpdatingPublish(true);
    
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-3e5c72fb/salon/${salonId}/publish`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ isPublished: newValue }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update publication status');
      }

      setIsPublished(newValue);
      onPublishChange?.(newValue);
      
      toast.success(
        newValue 
          ? '🎉 Salon published! Clients can now find and book your services.'
          : 'Salon unpublished. It will not be visible to clients.'
      );
    } catch (error) {
      console.error('Error updating publication status:', error);
      toast.error('Failed to update publication status. Please try again.');
    } finally {
      setIsUpdatingPublish(false);
    }
  };

  // Gallery Photo Management
  const handleAddPhoto = () => {
    // Trigger file input click
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Process each selected file
    Array.from(files).forEach((file) => {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image file`);
        return;
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        toast.error(`${file.name} is too large. Max size is 5MB`);
        return;
      }

      // Read file and create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        setGalleryPhotos(prev => [...prev, imageUrl]);
        toast.success(`📸 ${file.name} added to gallery`);
      };
      reader.onerror = () => {
        toast.error(`Failed to read ${file.name}`);
      };
      reader.readAsDataURL(file);
    });

    // Reset input so same file can be selected again
    e.target.value = '';
  };

  const handleRemovePhoto = (index: number) => {
    setGalleryPhotos(prev => prev.filter((_, i) => i !== index));
    toast.success('Photo removed');
  };

  // Cover Image Management
  const handleAddCover = () => {
    // Trigger file input click
    coverInputRef.current?.click();
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Process each selected file
    Array.from(files).forEach((file) => {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image file`);
        return;
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        toast.error(`${file.name} is too large. Max size is 5MB`);
        return;
      }

      // Read file and create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        setCoverImage(imageUrl);
        toast.success(`📸 ${file.name} set as cover`);
      };
      reader.onerror = () => {
        toast.error(`Failed to read ${file.name}`);
      };
      reader.readAsDataURL(file);
    });

    // Reset input so same file can be selected again
    e.target.value = '';
  };

  // Logo Image Management
  const handleAddLogo = () => {
    // Trigger file input click
    logoInputRef.current?.click();
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Process each selected file
    Array.from(files).forEach((file) => {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image file`);
        return;
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        toast.error(`${file.name} is too large. Max size is 5MB`);
        return;
      }

      // Read file and create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        setLogoImage(imageUrl);
        toast.success(`📸 ${file.name} set as logo`);
      };
      reader.onerror = () => {
        toast.error(`Failed to read ${file.name}`);
      };
      reader.readAsDataURL(file);
    });

    // Reset input so same file can be selected again
    e.target.value = '';
  };

  return (
    <div className="space-y-6">
      {/* Tabs Navigation */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('general')}
          className={`px-6 py-3 font-medium transition-all flex items-center gap-2 ${
            activeTab === 'general'
              ? 'border-b-2 border-purple-600 text-purple-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <SettingsIcon className="w-4 h-4" />
          General Settings
        </button>
        <button
          onClick={() => setActiveTab('resources')}
          className={`px-6 py-3 font-medium transition-all flex items-center gap-2 ${
            activeTab === 'resources'
              ? 'border-b-2 border-purple-600 text-purple-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Wrench className="w-4 h-4" />
          Resource Management
        </button>
        <button
          onClick={() => setActiveTab('payments')}
          className={`px-6 py-3 font-medium transition-all flex items-center gap-2 ${
            activeTab === 'payments'
              ? 'border-b-2 border-purple-600 text-purple-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          Payment Settings
        </button>
        <button
          onClick={() => setActiveTab('deposits')}
          className={`px-6 py-3 font-medium transition-all flex items-center gap-2 ${
            activeTab === 'deposits'
              ? 'border-b-2 border-purple-600 text-purple-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          Deposit Settings
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'general' ? (
        <div className="grid lg:grid-cols-[320px_1fr] gap-6">
          {/* Hidden file inputs for photo and cover uploads */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
          <input
            ref={coverInputRef}
            type="file"
            accept="image/*"
            onChange={handleCoverChange}
            className="hidden"
          />
          <input
            ref={logoInputRef}
            type="file"
            accept="image/*"
            onChange={handleLogoChange}
            className="hidden"
          />

          {/* Sticky Save Button - Always visible */}
          <div className="fixed bottom-6 right-6 z-30 lg:right-8">
            <Button
              onClick={handleSaveSettings}
              disabled={isSaving}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 text-lg font-semibold shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-3"></div>
                  Saving...
                </>
              ) : (
                <>
                  💾 Save All Changes
                </>
              )}
            </Button>
          </div>

          {/* Left Column - Logo & Cover */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Salon Settings</h2>
              <p className="text-sm text-gray-500">Manage your salon profile</p>
            </div>

            {/* Publication Status Card */}
            <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {isPublished ? (
                        <Eye className="w-5 h-5 text-green-600" />
                      ) : (
                        <EyeOff className="w-5 h-5 text-gray-400" />
                      )}
                      <h3 className="font-bold text-gray-900">
                        {isPublished ? 'Salon Published' : 'Salon Not Published'}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      {isPublished 
                        ? 'Your salon is visible to clients and accepting bookings.'
                        : 'Publish your salon when you\'re ready to accept bookings. Make sure to add services first.'}
                    </p>
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={isPublished}
                        onCheckedChange={handlePublishToggle}
                        disabled={isUpdatingPublish}
                        className="data-[state=checked]:bg-green-600"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        {isPublished ? 'Published' : 'Unpublished'}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Logo Upload */}
            <Card className="border-none shadow-sm">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-700 mb-4">▪︎Logo</div>
                  
                  {/* Logo Preview */}
                  <div className="w-32 h-32 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    {logoImage ? (
                      <img
                        src={logoImage}
                        alt="Salon logo"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                        <span className="text-4xl font-bold text-purple-600">G</span>
                      </div>
                    )}
                  </div>

                  <Button 
                    onClick={handleAddLogo}
                    variant="outline" 
                    size="sm" 
                    className="gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Upload Logo
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Cover Upload */}
            <Card className="border-none shadow-sm">
              <CardContent className="p-6">
                <div>
                  {/* Cover Preview */}
                  <div className="relative h-40 rounded-lg overflow-hidden bg-gray-100 mb-4">
                    <img
                      src={coverImage}
                      alt="Salon cover"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <Button 
                    onClick={handleAddCover}
                    variant="outline" 
                    size="sm" 
                    className="w-full gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Upload Cover
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - General Info & Working Hours */}
          <div className="space-y-6">
            {/* General Information */}
            <Card className="border-none shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-6">General Information</h3>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  {/* Salon Name */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Salon Name
                    </label>
                    <input
                      type="text"
                      value={salonName}
                      onChange={(e) => setSalonName(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Phone
                    </label>
                    <div className="flex gap-2">
                      {/* Country Selector */}
                      <div className="relative">
                        <select
                          value={selectedCountry}
                          onChange={(e) => handleCountryChange(e.target.value)}
                          className="appearance-none pl-3 pr-8 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white cursor-pointer"
                          style={{ minWidth: '110px' }}
                        >
                          {countries.map(country => (
                            <option key={country.code} value={country.code}>
                              {country.flag} {country.dialCode}
                            </option>
                          ))}
                        </select>
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400">
                          ▼
                        </div>
                      </div>
                      
                      {/* Phone Number Input */}
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => handlePhoneNumberChange(e.target.value)}
                        placeholder="234 567 8900"
                        className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="mb-6 relative">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Address
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => handleAddressChange(e.target.value)}
                      onFocus={() => address.length >= 3 && setShowAddressSuggestions(addressSuggestions.length > 0)}
                      onBlur={() => setTimeout(() => setShowAddressSuggestions(false), 200)}
                      placeholder="Start typing your salon address..."
                      className="w-full px-4 py-2 pr-10 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    {isSearchingAddress && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <div className="animate-spin h-4 w-4 border-2 border-purple-600 border-t-transparent rounded-full"></div>
                      </div>
                    )}
                    {salonCoordinates && !isSearchingAddress && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-fuchsia-600">
                        📍
                      </div>
                    )}
                  </div>
                  
                  {/* Address Suggestions Dropdown */}
                  {showAddressSuggestions && addressSuggestions.length > 0 && (
                    <div className="absolute z-20 mt-1 w-full bg-white border border-purple-200 rounded-lg shadow-xl max-h-64 overflow-y-auto">
                      {addressSuggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          type="button"
                          className="w-full px-4 py-3 text-left hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all border-b border-gray-100 last:border-b-0"
                          onClick={() => handleAddressSelect(suggestion)}
                        >
                          <div className="flex items-start gap-3">
                            <span className="text-fuchsia-600 mt-1">📍</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-gray-900 font-medium truncate">
                                {suggestion.display_name.split(',')[0]}
                              </p>
                              <p className="text-xs text-gray-500 mt-0.5">
                                {suggestion.display_name}
                              </p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Location Badge */}
                  {salonCoordinates && (
                    <div className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full">
                      <span className="text-fuchsia-600">📍</span>
                      <span className="text-xs font-medium text-gray-700">
                        Location saved • Lat: {salonCoordinates.lat.toFixed(4)}, Lon: {salonCoordinates.lon.toFixed(4)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="mb-6">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    placeholder="Tell clients about your salon"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Working Hours */}
            <Card className="border-none shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Working Hours</h3>

                <div className="space-y-4">
                  {workingHours.map((hour, index) => (
                    <div key={hour.day} className="flex items-center justify-between">
                      {/* Day Toggle */}
                      <div className="flex items-center gap-3 w-24">
                        <button
                          onClick={() => toggleDay(index)}
                          className={`relative w-12 h-6 rounded-full transition-colors ${
                            hour.enabled ? 'bg-gray-900' : 'bg-gray-300'
                          }`}
                        >
                          <div
                            className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                              hour.enabled ? 'translate-x-7' : 'translate-x-1'
                            }`}
                          />
                        </button>
                        <span className={`text-sm font-medium ${
                          hour.enabled ? 'text-gray-900' : 'text-gray-400'
                        }`}>
                          {hour.day}
                        </span>
                      </div>

                      {/* Time Inputs */}
                      {hour.enabled ? (
                        <div className="flex items-center gap-3">
                          <select
                            value={hour.start}
                            onChange={(e) => updateTime(index, 'start', e.target.value)}
                            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                          >
                            {Array.from({ length: 24 }, (_, i) => {
                              const time = `${String(i).padStart(2, '0')}:00`;
                              return <option key={time} value={time}>{time}</option>;
                            })}
                          </select>

                          <span className="text-gray-500">-</span>

                          <select
                            value={hour.end}
                            onChange={(e) => updateTime(index, 'end', e.target.value)}
                            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                          >
                            {Array.from({ length: 24 }, (_, i) => {
                              const time = `${String(i).padStart(2, '0')}:00`;
                              return <option key={time} value={time}>{time}</option>;
                            })}
                          </select>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">Closed</span>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Photo Gallery */}
            <Card className="border-none shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Photo Gallery</h3>
                    <p className="text-sm text-gray-500 mt-1">Showcase your salon to attract clients</p>
                  </div>
                  <Button 
                    onClick={handleAddPhoto}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Add Photo
                  </Button>
                </div>

                {/* Gallery Grid */}
                {galleryPhotos.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {galleryPhotos.map((photo, index) => (
                      <div key={index} className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100">
                        <img
                          src={photo}
                          alt={`Gallery ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center">
                          <button
                            onClick={() => handleRemovePhoto(index)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transform hover:scale-110"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                        {/* Photo Number Badge */}
                        <div className="absolute top-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                          #{index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                    <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-600 mb-4">No photos yet</p>
                    <Button 
                      onClick={handleAddPhoto}
                      variant="outline"
                      className="gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      Upload First Photo
                    </Button>
                  </div>
                )}

                {/* Gallery Info */}
                {galleryPhotos.length > 0 && (
                  <div className="mt-4 flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      {galleryPhotos.length} {galleryPhotos.length === 1 ? 'photo' : 'photos'}
                    </span>
                    <span className="text-gray-500">
                      💡 Add at least 5 photos to attract more clients
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      ) : activeTab === 'resources' ? (
        <ResourceManagementTab userRole="owner" />
      ) : activeTab === 'payments' ? (
        <StripeConnectSettings
          salonId={salonId || ''}
          salonName={salonName}
          currentStripeAccountId={undefined}
          isStripeConnected={false}
          onConnect={() => toast.success('Stripe connected!')}
          onDisconnect={() => toast.success('Stripe disconnected')}
        />
      ) : (
        <DepositSettings
          currentPolicies={[]}
          onSave={(policies) => {
            console.log('Saving deposit policies:', policies);
            toast.success('Deposit settings saved!');
          }}
        />
      )}
    </div>
  );
}