import { useState, useEffect, useRef } from 'react';
import { X, Maximize2, Minimize2, Navigation as NavigationIcon, Clock, MapPin } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import L from 'leaflet';

interface SalonMapModalProps {
  salon: any;
  onClose: () => void;
}

export function SalonMapModal({ salon, onClose }: SalonMapModalProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [travelTime, setTravelTime] = useState<{ driving: string; walking: string } | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  
  // Salon coordinates (in real app, these would come from the database)
  const salonLocation = {
    lat: 40.7580,  // Example: New York
    lng: -73.9855
  };

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Create map
    const map = L.map(mapRef.current).setView([salonLocation.lat, salonLocation.lng], 15);

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Add salon marker
    const salonMarker = L.marker([salonLocation.lat, salonLocation.lng]).addTo(map);
    salonMarker.bindPopup(`
      <div style="padding: 8px;">
        <h4 style="font-weight: bold; margin-bottom: 4px;">${salon.name}</h4>
        <p style="font-size: 14px; color: #666; margin-bottom: 4px;">${salon.location}</p>
        <p style="font-size: 14px; color: #666;">⭐ ${salon.rating} (${salon.reviewCount} reviews)</p>
      </div>
    `);

    mapInstanceRef.current = map;

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [salon]);

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(userPos);
          
          // Add user location marker to map
          if (mapInstanceRef.current) {
            const userIcon = L.divIcon({
              className: 'custom-user-marker',
              html: `<div style="background-color: #3B82F6; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);"></div>`,
              iconSize: [12, 12],
              iconAnchor: [6, 6]
            });
            
            const userMarker = L.marker([userPos.lat, userPos.lng], { icon: userIcon }).addTo(mapInstanceRef.current);
            userMarker.bindPopup(`
              <div style="padding: 8px;">
                <p style="font-size: 14px; font-weight: 600;">Your location</p>
              </div>
            `);

            // Fit map to show both markers
            const bounds = L.latLngBounds([
              [userPos.lat, userPos.lng],
              [salonLocation.lat, salonLocation.lng]
            ]);
            mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
          }
          
          // Calculate distance and estimate travel time
          const distance = calculateDistance(
            userPos.lat,
            userPos.lng,
            salonLocation.lat,
            salonLocation.lng
          );
          
          // Approximate travel time (distance in km * 3 min for car, * 12 min for walking)
          const drivingMinutes = Math.round(distance * 3);
          const walkingMinutes = Math.round(distance * 12);
          
          setTravelTime({
            driving: drivingMinutes < 60 ? `${drivingMinutes} min` : `${Math.round(drivingMinutes / 60)} h ${drivingMinutes % 60} min`,
            walking: walkingMinutes < 60 ? `${walkingMinutes} min` : `${Math.round(walkingMinutes / 60)} h ${walkingMinutes % 60} min`
          });
        },
        (error) => {
          console.log('Geolocation error:', error);
        }
      );
    }
  }, []);

  // Haversine formula to calculate distance between two coordinates
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius of Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const openInGoogleMaps = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${salonLocation.lat},${salonLocation.lng}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className={`bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ${
          isExpanded ? 'w-full h-full' : 'w-full max-w-4xl max-h-[80vh]'
        } flex flex-col`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-purple-600 to-pink-600">
          <div className="flex items-center gap-3">
            <MapPin className="w-6 h-6 text-white" />
            <div>
              <h3 className="font-bold text-white">{salon.name}</h3>
              <p className="text-sm text-purple-100">{salon.location}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setIsExpanded(!isExpanded)}
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10 rounded-full"
            >
              {isExpanded ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </Button>
            <Button
              onClick={onClose}
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10 rounded-full"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Travel Time Info */}
        {travelTime && userLocation && (
          <div className="p-4 bg-purple-50 border-b">
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-3 bg-white">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <Clock className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">By car</p>
                    <p className="font-bold text-purple-600">{travelTime.driving}</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-3 bg-white">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                    <Clock className="w-5 h-5 text-pink-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Walking</p>
                    <p className="font-bold text-pink-600">{travelTime.walking}</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Map */}
        <div className="flex-1 relative">
          <div ref={mapRef} style={{ height: '100%', width: '100%' }}></div>
        </div>

        {/* Footer with Action Button */}
        <div className="p-4 border-t bg-white">
          <Button
            onClick={openInGoogleMaps}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white gap-2"
          >
            <NavigationIcon className="w-4 h-4" />
            Open route in Google Maps
          </Button>
        </div>
      </div>
    </div>
  );
}