import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  Sparkles, 
  Calendar, 
  Star, 
  Heart, 
  Users, 
  Building2, 
  CalendarCheck,
  Award,
  CheckCircle2,
  Shield,
  Zap,
  DollarSign,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { mockSalons } from '../data/mockData';
import { SalonCard } from '../components/SalonCard';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '../components/ui/carousel';
import { Card, CardContent } from '../components/ui/card';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import { TrendingUp } from 'lucide-react';
import { AIBookingAssistant } from '../components/AIBookingAssistant';
import { LocationPicker } from '../components/LocationPicker';
import { CityPicker } from '../components/CityPicker';
import { MobileSearchBar } from '../components/MobileSearchBar';
import { useIsMobile } from '../components/ui/use-mobile';
import { CITIES, getCityById, detectCityFromLocation, City } from '../data/locations';

export function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const isMobile = useIsMobile();
  
  // City and location state
  const [currentCity, setCurrentCity] = useState<City>(() => {
    const savedCityId = localStorage.getItem('userCity');
    return savedCityId ? (getCityById(savedCityId) || CITIES[0]) : CITIES[0];
  });
  
  const [userLocation, setUserLocation] = useState(() => {
    const savedLocation = localStorage.getItem('userLocation');
    // If saved location exists and belongs to current city, use it
    if (savedLocation && currentCity.districts.some(d => d.name === savedLocation)) {
      return savedLocation;
    }
    // Otherwise use first district of current city
    return currentCity.districts[0]?.name || 'Downtown Dubai';
  });
  
  // Update userLocation when city changes
  const handleCityChange = (newCity: City) => {
    setCurrentCity(newCity);
    // Reset to first district of new city
    const newLocation = newCity.districts[0]?.name || '';
    setUserLocation(newLocation);
    localStorage.setItem('userCity', newCity.id);
    localStorage.setItem('userLocation', newLocation);
  };
  
  // Live counters
  const [bookingsCount, setBookingsCount] = useState(10000);
  const [clientsCount, setClientsCount] = useState(10000);
  const [salonsCount, setSalonsCount] = useState(500);
  const [rating, setRating] = useState(4.8);
  
  // Animate bookings counter
  useEffect(() => {
    const interval = setInterval(() => {
      setBookingsCount(prev => prev + Math.floor(Math.random() * 3) + 1); // Increase by 1-3 every interval
    }, 2000); // Update every 2 seconds
    
    return () => clearInterval(interval);
  }, []);
  
  // Animate clients counter
  useEffect(() => {
    const interval = setInterval(() => {
      setClientsCount(prev => prev + Math.floor(Math.random() * 2) + 1); // Increase by 1-2 every interval
    }, 3000); // Update every 3 seconds
    
    return () => clearInterval(interval);
  }, []);
  
  // Animate salons counter
  useEffect(() => {
    const interval = setInterval(() => {
      setSalonsCount(prev => prev + (Math.random() > 0.7 ? 1 : 0)); // Increase by 1 occasionally
    }, 5000); // Update every 5 seconds
    
    return () => clearInterval(interval);
  }, []);
  
  // Animate rating (slight fluctuation)
  useEffect(() => {
    const interval = setInterval(() => {
      setRating(prev => {
        const change = (Math.random() - 0.5) * 0.02; // Small random change
        const newRating = prev + change;
        return Math.max(4.7, Math.min(4.9, newRating)); // Keep between 4.7 and 4.9
      });
    }, 4000); // Update every 4 seconds
    
    return () => clearInterval(interval);
  }, []);

  // Countries and cities data
  const countriesAndCities: Record<string, string[]> = {
    uae: ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain'],
    usa: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Miami', 'San Francisco', 'Las Vegas', 'Boston', 'Seattle', 'Atlanta'],
    uk: ['London', 'Manchester', 'Birmingham', 'Liverpool', 'Leeds', 'Glasgow', 'Edinburgh', 'Bristol', 'Newcastle', 'Sheffield'],
    russia: ['Moscow', 'Saint Petersburg', 'Novosibirsk', 'Yekaterinburg', 'Kazan', 'Nizhny Novgorod', 'Chelyabinsk', 'Samara', 'Omsk', 'Rostov-on-Don'],
    france: ['Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice', 'Nantes', 'Strasbourg', 'Montpellier', 'Bordeaux', 'Lille'],
    germany: ['Berlin', 'Munich', 'Frankfurt', 'Hamburg', 'Cologne', 'Stuttgart', 'Düsseldorf', 'Dortmund', 'Essen', 'Leipzig'],
    italy: ['Rome', 'Milan', 'Naples', 'Turin', 'Palermo', 'Genoa', 'Bologna', 'Florence', 'Venice', 'Verona'],
    spain: ['Madrid', 'Barcelona', 'Valencia', 'Seville', 'Zaragoza', 'Málaga', 'Murcia', 'Palma', 'Bilbao', 'Alicante'],
    turkey: ['Istanbul', 'Ankara', 'Izmir', 'Bursa', 'Adana', 'Gaziantep', 'Konya', 'Antalya', 'Kayseri', 'Mersin'],
    thailand: ['Bangkok', 'Chiang Mai', 'Phuket', 'Pattaya', 'Krabi', 'Hua Hin', 'Koh Samui', 'Ayutthaya', 'Chiang Rai', 'Sukhothai'],
    singapore: ['Singapore City', 'Jurong', 'Woodlands', 'Tampines', 'Bedok', 'Sengkang', 'Hougang', 'Yishun', 'Ang Mo Kio', 'Bukit Batok'],
    australia: ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Gold Coast', 'Canberra', 'Newcastle', 'Hobart', 'Darwin'],
    canada: ['Toronto', 'Montreal', 'Vancouver', 'Calgary', 'Edmonton', 'Ottawa', 'Winnipeg', 'Quebec City', 'Hamilton', 'Victoria'],
    japan: ['Tokyo', 'Osaka', 'Yokohama', 'Nagoya', 'Sapporo', 'Fukuoka', 'Kobe', 'Kyoto', 'Kawasaki', 'Hiroshima'],
    china: ['Beijing', 'Shanghai', 'Guangzhou', 'Shenzhen', 'Chengdu', 'Hangzhou', 'Wuhan', 'Xian', 'Nanjing', 'Tianjin'],
    india: ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Surat'],
    brazil: ['São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador', 'Fortaleza', 'Belo Horizonte', 'Manaus', 'Curitiba', 'Recife', 'Porto Alegre'],
    mexico: ['Mexico City', 'Guadalajara', 'Monterrey', 'Puebla', 'Tijuana', 'León', 'Juárez', 'Zapopan', 'Mérida', 'Cancún'],
    argentina: ['Buenos Aires', 'Córdoba', 'Rosario', 'Mendoza', 'La Plata', 'San Miguel de Tucumán', 'Mar del Plata', 'Salta', 'Santa Fe', 'San Juan'],
    southafrica: ['Johannesburg', 'Cape Town', 'Durban', 'Pretoria', 'Port Elizabeth', 'Bloemfontein', 'East London', 'Nelspruit', 'Kimberley', 'Polokwane'],
    egypt: ['Cairo', 'Alexandria', 'Giza', 'Sharm El Sheikh', 'Luxor', 'Aswan', 'Hurghada', 'Port Said', 'Suez', 'Tanta'],
    saudiarabia: ['Riyadh', 'Jeddah', 'Mecca', 'Medina', 'Dammam', 'Khobar', 'Tabuk', 'Buraidah', 'Khamis Mushait', 'Abha'],
    qatar: ['Doha', 'Al Rayyan', 'Umm Salal', 'Al Wakrah', 'Al Khor', 'Madinat ash Shamal', 'Dukhan', 'Mesaieed', 'Al Wukair', 'Al Khawr'],
    kuwait: ['Kuwait City', 'Al Ahmadi', 'Hawalli', 'Salmiya', 'Fahaheel', 'Jabriya', 'Mangaf', 'Sabah Al Salem', 'Fintas', 'Mahboula'],
    bahrain: ['Manama', 'Riffa', 'Muharraq', 'Hamad Town', 'Isa Town', 'Sitra', 'Budaiya', 'Jidhafs', 'Al-Malikiyah', 'Sanabis'],
    greece: ['Athens', 'Thessaloniki', 'Patras', 'Heraklion', 'Larissa', 'Volos', 'Rhodes', 'Ioannina', 'Chania', 'Mykonos'],
    norway: ['Oslo', 'Bergen', 'Trondheim', 'Stavanger', 'Drammen', 'Fredrikstad', 'Kristiansand', 'Sandnes', 'Tromsø', 'Sarpsborg'],
    finland: ['Helsinki', 'Espoo', 'Tampere', 'Vantaa', 'Oulu', 'Turku', 'Jyväskylä', 'Lahti', 'Kuopio', 'Pori'],
    denmark: ['Copenhagen', 'Aarhus', 'Odense', 'Aalborg', 'Esbjerg', 'Randers', 'Kolding', 'Horsens', 'Vejle', 'Roskilde'],
    switzerland: ['Zurich', 'Geneva', 'Basel', 'Lausanne', 'Bern', 'Winterthur', 'Lucerne', 'St. Gallen', 'Lugano', 'Biel/Bienne'],
    lithuania: ['Vilnius', 'Kaunas', 'Klaipėda', 'Šiauliai', 'Panevėžys', 'Alytus', 'Marijampolė', 'Mažeikiai', 'Jonava', 'Utena'],
    latvia: ['Riga', 'Daugavpils', 'Liepāja', 'Jelgava', 'Jūrmala', 'Ventspils', 'Rēzekne', 'Ogre', 'Valmiera', 'Jēkabpils'],
    estonia: ['Tallinn', 'Tartu', 'Narva', 'Pärnu', 'Kohtla-Järve', 'Viljandi', 'Rakvere', 'Maardu', 'Sillamäe', 'Kuressaare'],
    sweden: ['Stockholm', 'Gothenburg', 'Malmö', 'Uppsala', 'Västerås', 'Örebro', 'Linköping', 'Helsingborg', 'Jönköping', 'Norrköping'],
    belgium: ['Brussels', 'Antwerp', 'Ghent', 'Charleroi', 'Liège', 'Bruges', 'Namur', 'Leuven', 'Mons', 'Aalst'],
    netherlands: ['Amsterdam', 'Rotterdam', 'The Hague', 'Utrecht', 'Eindhoven', 'Tilburg', 'Groningen', 'Almere', 'Breda', 'Nijmegen'],
    portugal: ['Lisbon', 'Porto', 'Amadora', 'Braga', 'Setúbal', 'Coimbra', 'Queluz', 'Funchal', 'Cascais', 'Almada'],
    austria: ['Vienna', 'Graz', 'Linz', 'Salzburg', 'Innsbruck', 'Klagenfurt', 'Villach', 'Wels', 'St. Pölten', 'Dornbirn'],
    czechrepublic: ['Prague', 'Brno', 'Ostrava', 'Plzeň', 'Liberec', 'Olomouc', 'České Budějovice', 'Hradec Králové', 'Ústí nad Labem', 'Pardubice'],
    poland: ['Warsaw', 'Kraków', 'Łódź', 'Wrocław', 'Poznań', 'Gdańsk', 'Szczecin', 'Bydgoszcz', 'Lublin', 'Katowice'],
    hungary: ['Budapest', 'Debrecen', 'Szeged', 'Miskolc', 'Pécs', 'Győr', 'Nyíregyháza', 'Kecskemét', 'Székesfehérvár', 'Szombathely'],
    romania: ['Bucharest', 'Cluj-Napoca', 'Timișoara', 'Iași', 'Constanța', 'Craiova', 'Brașov', 'Galați', 'Ploiești', 'Oradea'],
    bulgaria: ['Sofia', 'Plovdiv', 'Varna', 'Burgas', 'Ruse', 'Stara Zagora', 'Pleven', 'Sliven', 'Dobrich', 'Shumen'],
    croatia: ['Zagreb', 'Split', 'Rijeka', 'Osijek', 'Zadar', 'Pula', 'Slavonski Brod', 'Karlovac', 'Varaždin', 'Šibenik'],
    serbia: ['Belgrade', 'Novi Sad', 'Niš', 'Kragujevac', 'Subotica', 'Zrenjanin', 'Pančevo', 'Čačak', 'Novi Pazar', 'Leskovac'],
    slovenia: ['Ljubljana', 'Maribor', 'Celje', 'Kranj', 'Velenje', 'Koper', 'Novo Mesto', 'Ptuj', 'Kamnik', 'Trbovlje'],
    slovakia: ['Bratislava', 'Košice', 'Prešov', 'Žilina', 'Banská Bystrica', 'Nitra', 'Trnava', 'Martin', 'Trenčín', 'Poprad'],
    ireland: ['Dublin', 'Cork', 'Limerick', 'Galway', 'Waterford', 'Drogheda', 'Dundalk', 'Swords', 'Bray', 'Navan'],
    iceland: ['Reykjavik', 'Kópavogur', 'Hafnarfjörður', 'Akureyri', 'Reykjanesbær', 'Garðabær', 'Mosfellsbær', 'Árborg', 'Akranes', 'Fjarðabyggð'],
    ukraine: ['Kyiv', 'Kharkiv', 'Odesa', 'Dnipro', 'Lviv', 'Zaporizhzhia', 'Kryvyi Rih', 'Mykolaiv', 'Mariupol', 'Vinnytsia'],
  };

  const countries = [
    { code: 'uae', name: 'UAE', flag: '🇦🇪' },
    { code: 'usa', name: 'USA', flag: '🇺🇸' },
    { code: 'uk', name: 'UK', flag: '🇬🇧' },
    { code: 'russia', name: 'Russia', flag: '🇷🇺' },
    { code: 'france', name: 'France', flag: '🇫🇷' },
    { code: 'germany', name: 'Germany', flag: '🇩🇪' },
    { code: 'italy', name: 'Italy', flag: '🇮🇹' },
    { code: 'spain', name: 'Spain', flag: '🇪🇸' },
    { code: 'turkey', name: 'Turkey', flag: '🇹🇷' },
    { code: 'thailand', name: 'Thailand', flag: '🇹🇭' },
    { code: 'singapore', name: 'Singapore', flag: '🇸🇬' },
    { code: 'australia', name: 'Australia', flag: '🇦🇺' },
    { code: 'canada', name: 'Canada', flag: '🇨🇦' },
    { code: 'japan', name: 'Japan', flag: '🇯🇵' },
    { code: 'china', name: 'China', flag: '🇨🇳' },
    { code: 'india', name: 'India', flag: '🇮🇳' },
    { code: 'brazil', name: 'Brazil', flag: '🇧🇷' },
    { code: 'mexico', name: 'Mexico', flag: '🇲🇽' },
    { code: 'argentina', name: 'Argentina', flag: '🇦🇷' },
    { code: 'southafrica', name: 'South Africa', flag: '🇿🇦' },
    { code: 'egypt', name: 'Egypt', flag: '🇪🇬' },
    { code: 'saudiarabia', name: 'Saudi Arabia', flag: '🇸🇦' },
    { code: 'qatar', name: 'Qatar', flag: '🇶🇦' },
    { code: 'kuwait', name: 'Kuwait', flag: '🇰🇼' },
    { code: 'bahrain', name: 'Bahrain', flag: '🇧🇭' },
    { code: 'greece', name: 'Greece', flag: '🇬🇷' },
    { code: 'norway', name: 'Norway', flag: '🇳🇴' },
    { code: 'finland', name: 'Finland', flag: '🇫🇮' },
    { code: 'denmark', name: 'Denmark', flag: '🇩🇰' },
    { code: 'switzerland', name: 'Switzerland', flag: '🇨🇭' },
    { code: 'lithuania', name: 'Lithuania', flag: '🇱🇹' },
    { code: 'latvia', name: 'Latvia', flag: '🇱🇻' },
    { code: 'estonia', name: 'Estonia', flag: '🇪🇪' },
    { code: 'sweden', name: 'Sweden', flag: '🇸🇪' },
    { code: 'belgium', name: 'Belgium', flag: '🇧🇪' },
    { code: 'netherlands', name: 'Netherlands', flag: '🇳🇱' },
    { code: 'portugal', name: 'Portugal', flag: '🇵🇹' },
    { code: 'austria', name: 'Austria', flag: '🇦🇹' },
    { code: 'czechrepublic', name: 'Czech Republic', flag: '🇨🇿' },
    { code: 'poland', name: 'Poland', flag: '🇵🇱' },
    { code: 'hungary', name: 'Hungary', flag: '🇭🇺' },
    { code: 'romania', name: 'Romania', flag: '🇷🇴' },
    { code: 'bulgaria', name: 'Bulgaria', flag: '🇧🇬' },
    { code: 'croatia', name: 'Croatia', flag: '🇭🇷' },
    { code: 'serbia', name: 'Serbia', flag: '🇷🇸' },
    { code: 'slovenia', name: 'Slovenia', flag: '🇸🇮' },
    { code: 'slovakia', name: 'Slovakia', flag: '🇸🇰' },
    { code: 'ireland', name: 'Ireland', flag: '🇮🇪' },
    { code: 'iceland', name: 'Iceland', flag: '🇮🇸' },
    { code: 'ukraine', name: 'Ukraine', flag: '🇺🇦' },
  ];

  // Get cities for selected country
  const availableCities = selectedCountry ? countriesAndCities[selectedCountry] || [] : [];

  // Areas by city (popular areas for major cities)
  const areasByCity: Record<string, string[]> = {
    'Dubai': ['Downtown Dubai', 'Dubai Marina', 'JBR', 'Business Bay', 'Jumeirah', 'Deira', 'Bur Dubai', 'Al Barsha'],
    'Abu Dhabi': ['Al Maryah Island', 'Al Reem Island', 'Yas Island', 'Saadiyat Island', 'Khalifa City', 'Al Ain'],
    'New York': ['Manhattan', 'Brooklyn', 'Queens', 'Bronx', 'Staten Island', 'Upper East Side', 'SoHo', 'Williamsburg'],
    'Los Angeles': ['Hollywood', 'Beverly Hills', 'Santa Monica', 'Venice Beach', 'Downtown LA', 'Pasadena', 'Malibu'],
    'London': ['Westminster', 'Kensington', 'Camden', 'Shoreditch', 'Soho', 'Mayfair', 'Chelsea', 'Notting Hill'],
    'Moscow': ['Tverskoy', 'Arbat', 'Zamoskvorechye', 'Presnensky', 'Khamovniki', 'Taganka', 'Kitay-Gorod'],
    'Paris': ['Champs-Élysées', 'Marais', 'Latin Quarter', 'Montmartre', 'Saint-Germain', 'Opéra', 'La Défense'],
    'Berlin': ['Mitte', 'Kreuzberg', 'Charlottenburg', 'Prenzlauer Berg', 'Friedrichshain', 'Schöneberg', 'Neukölln'],
    'Tokyo': ['Shibuya', 'Shinjuku', 'Ginza', 'Roppongi', 'Harajuku', 'Akihabara', 'Asakusa', 'Odaiba'],
    'Singapore City': ['Orchard', 'Marina Bay', 'Raffles Place', 'Clarke Quay', 'Sentosa', 'Bugis', 'Chinatown'],
    'Istanbul': ['Beyoğlu', 'Beşiktaş', 'Kadıköy', 'Üsküdar', 'Fatih', 'Şişli', 'Sultanahmet', 'Taksim'],
    'Bangkok': ['Sukhumvit', 'Silom', 'Siam', 'Sathorn', 'Thonglor', 'Asoke', 'Ratchada', 'Riverside'],
    'Sydney': ['CBD', 'Bondi', 'Manly', 'Parramatta', 'Surry Hills', 'Newtown', 'Darling Harbour', 'The Rocks'],
    'Mumbai': ['Bandra', 'Andheri', 'Colaba', 'Worli', 'Juhu', 'Lower Parel', 'Powai', 'Marine Drive'],
    'Riyadh': ['Olaya', 'Al Malqa', 'Al Sahafa', 'Diplomatic Quarter', 'Al Naseem', 'King Abdullah Financial District'],
    'Doha': ['West Bay', 'The Pearl', 'Lusail', 'Katara', 'Msheireb', 'Al Sadd', 'Aspire Zone'],
    'Athens': ['Plaka', 'Kolonaki', 'Syntagma', 'Monastiraki', 'Glyfada', 'Kifisia', 'Piraeus'],
    'Rome': ['Centro Storico', 'Trastevere', 'Prati', 'Monti', 'Testaccio', 'EUR', 'Parioli'],
    'Milan': ['Centro', 'Brera', 'Navigli', 'Porta Nuova', 'Quadrilatero', 'Isola', 'Tortona'],
    'Madrid': ['Sol', 'Salamanca', 'Malasaña', 'Chueca', 'Retiro', 'Chamberí', 'La Latina'],
    'Barcelona': ['Eixample', 'Gothic Quarter', 'Gràcia', 'El Born', 'Poble Sec', 'Sant Antoni', 'Barceloneta'],
    'Vienna': ['Innere Stadt', 'Leopoldstadt', 'Neubau', 'Margareten', 'Mariahilf', 'Döbling', 'Hietzing'],
    'Prague': ['Old Town', 'Vinohrady', 'Žižkov', 'Nové Město', 'Malá Strana', 'Karlín', 'Dejvice'],
    'Amsterdam': ['Centrum', 'Jordaan', 'De Pijp', 'Oud-West', 'Zuid', 'Noord', 'Oost'],
    'Warsaw': ['Śródmieście', 'Mokotów', 'Wola', 'Praga', 'Żoliborz', 'Ursynów', 'Wilanów'],
    'Budapest': ['District V', 'District VI', 'District VII', 'District XIII', 'Buda Castle', 'Pest', 'Margaret Island'],
    'Lisbon': ['Baixa', 'Chiado', 'Alfama', 'Bairro Alto', 'Belém', 'Parque das Nações', 'Príncipe Real'],
    'Oslo': ['Sentrum', 'Grünerløkka', 'Frogner', 'Majorstuen', 'Aker Brygge', 'Tjuvholmen', 'Grønland'],
    'Stockholm': ['Gamla Stan', 'Södermalm', 'Östermalm', 'Norrmalm', 'Vasastan', 'Djurgården', 'Kungsholmen'],
    'Copenhagen': ['Indre By', 'Nørrebro', 'Vesterbro', 'Østerbro', 'Frederiksberg', 'Christianshavn', 'Amager'],
    'Helsinki': ['Keskusta', 'Kamppi', 'Kallio', 'Punavuori', 'Töölö', 'Katajanokka', 'Kruununhaka'],
    'Zurich': ['Altstadt', 'Zürich West', 'Seefeld', 'Wiedikon', 'Aussersihl', 'Enge', 'Hottingen'],
    'Dublin': ['Temple Bar', 'Georgian Quarter', 'Ballsbridge', 'Rathmines', 'Howth', 'Dún Laoghaire', 'Smithfield'],
    'Brussels': ['Grand Place', 'EU Quarter', 'Ixelles', 'Saint-Gilles', 'Sablon', 'Marolles', 'Louise'],
    'Vilnius': ['Old Town', 'Naujamiestis', 'Žvėrynas', 'Šnipiškės', 'Antakalnis', 'Užupis', 'Justiniškės'],
    'Riga': ['Old Town', 'Centre', 'Quiet Centre', 'Art Nouveau District', 'Āgenskalns', 'Mežaparks', 'Pārdaugava'],
    'Tallinn': ['Old Town', 'City Centre', 'Kadriorg', 'Pirita', 'Kristiine', 'Mustamäe', 'Lasnamäe'],
  };

  const availableAreas = selectedCity ? areasByCity[selectedCity] || ['Downtown', 'City Center', 'Marina', 'Suburbs'] : [];

  // Detect user location on mount
  useEffect(() => {
    const detectLocation = async () => {
      try {
        // Try to get user's location using ipapi.co
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        
        if (data.country_code) {
          // Map country codes to our country codes
          const countryMap: Record<string, string> = {
            'AE': 'uae',
            'US': 'usa',
            'GB': 'uk',
            'RU': 'russia',
            'FR': 'france',
            'DE': 'germany',
            'IT': 'italy',
            'ES': 'spain',
            'TR': 'turkey',
            'TH': 'thailand',
            'SG': 'singapore',
            'AU': 'australia',
            'CA': 'canada',
            'JP': 'japan',
            'CN': 'china',
            'IN': 'india',
            'BR': 'brazil',
            'MX': 'mexico',
            'AR': 'argentina',
            'ZA': 'southafrica',
            'EG': 'egypt',
            'SA': 'saudiarabia',
            'QA': 'qatar',
            'KW': 'kuwait',
            'BH': 'bahrain',
            'GR': 'greece',
            'NO': 'norway',
            'FI': 'finland',
            'DK': 'denmark',
            'CH': 'switzerland',
            'LT': 'lithuania',
            'LV': 'latvia',
            'EE': 'estonia',
            'SE': 'sweden',
            'BE': 'belgium',
            'NL': 'netherlands',
            'PT': 'portugal',
            'AT': 'austria',
            'CZ': 'czechrepublic',
            'PL': 'poland',
            'HU': 'hungary',
            'RO': 'romania',
            'BG': 'bulgaria',
            'HR': 'croatia',
            'RS': 'serbia',
            'SI': 'slovenia',
            'SK': 'slovakia',
            'IE': 'ireland',
            'IS': 'iceland',
            'UA': 'ukraine',
          };
          
          const detectedCountry = countryMap[data.country_code];
          if (detectedCountry) {
            setSelectedCountry(detectedCountry);
            
            // Set the first city of the detected country, or try to match the detected city
            const cities = countriesAndCities[detectedCountry];
            if (cities && cities.length > 0) {
              // Try to find matching city
              const matchingCity = cities.find(city => 
                city.toLowerCase() === data.city?.toLowerCase()
              );
              setSelectedCity(matchingCity || cities[0]);
            }
          }
        }
      } catch (error) {
        console.log('Could not detect location:', error);
        // Default to UAE/Dubai if geolocation fails
        setSelectedCountry('uae');
        setSelectedCity('Dubai');
      }
    };

    detectLocation();
  }, []);

  // Update city when country changes
  const handleCountryChange = (countryCode: string) => {
    setSelectedCountry(countryCode);
    // Set first city of the new country
    const cities = countriesAndCities[countryCode];
    if (cities && cities.length > 0) {
      setSelectedCity(cities[0]);
    } else {
      setSelectedCity('');
    }
  };

  const topRatedSalons = mockSalons.filter(s => s.rating >= 4.5);
  const premiumSalons = mockSalons.filter(s => s.isPremium);
  const recommendedSalons = mockSalons.filter(s => s.isRecommended);
  const newSalons = mockSalons.filter(s => s.isNew);
  const locationSalons = mockSalons.filter(s => s.distance <= 3.0); // Within 3km

  const testimonials = [
    {
      id: 1,
      name: 'Olivia Chen',
      avatar: 'OC',
      service: 'Bridal Makeup',
      location: 'Beauty Haven',
      city: 'Dubai, UAE',
      rating: 5,
      time: '1 week ago',
      text: '"The variety of salons and services is incredible! I found the perfect place for my wedding makeup. The reviews helped me make the right choice. Thank you Katia!"'
    },
    {
      id: 2,
      name: 'Emma Martinez',
      avatar: 'EM',
      service: 'Manicure & Pedicure',
      location: 'Nail Art Paradise',
      city: 'Abu Dhabi, UAE',
      rating: 5,
      time: '3 days ago',
      text: '"I love how I can book appointments instantly through the app! No more waiting for callbacks. The reminders are super helpful too. Best beauty booking platform I\'ve used!"'
    },
    {
      id: 3,
      name: 'Sarah Johnson',
      avatar: 'SJ',
      service: 'Hair Styling',
      location: 'Glamour Studio',
      city: 'Dubai, UAE',
      rating: 5,
      time: '2 weeks ago',
      text: '"Amazing platform! Found the perfect salon for my needs. The booking process was seamless and the staff was professional. Highly recommend!"'
    }
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className={`min-h-screen bg-white ${isMobile ? 'pb-20' : ''}`}>
      {/* Header */}
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-purple-50 via-pink-50 to-white py-16 md:py-24">
        <div className="container mx-auto px-3 md:px-4">
          {/* Badge */}
          <div className="max-w-4xl mx-auto text-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span className="text-sm text-purple-600 font-medium">Your Premier Luxury Beauty Platform</span>
            </div>
          </div>

          {/* Title */}
          <div className="max-w-4xl mx-auto text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              <span className="text-gray-900">Welcome to</span>
              <br />
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Katia Booking
              </span>
            </h1>
            <p className="text-lg md:text-xl text-purple-600 mb-8">
              Discover and book the finest beauty salons
            </p>

            {/* Stats */}
            <div className="flex justify-center gap-4 md:gap-8 mb-12">
              <div className="bg-white rounded-2xl px-6 py-4 shadow-sm">
                <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  12+
                </div>
                <div className="text-xs md:text-sm text-gray-600">Salons</div>
              </div>
              <div className="bg-white rounded-2xl px-6 py-4 shadow-sm">
                <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  50K+
                </div>
                <div className="text-xs md:text-sm text-gray-600">Clients</div>
              </div>
              <div className="bg-white rounded-2xl px-6 py-4 shadow-sm">
                <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  4.8★
                </div>
                <div className="text-xs md:text-sm text-gray-600">Rating</div>
              </div>
            </div>
          </div>

          {/* Smart Search */}
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8">
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium text-purple-600">Smart Search</span>
                <button
                  onClick={() => setShowAIAssistant(true)}
                  className="ml-auto flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full hover:from-purple-700 hover:to-pink-700 transition-all hover:shadow-lg cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-white" />
                  <span className="text-xs font-medium text-white">AI Katia</span>
                </button>
              </div>

              {/* Search Input */}
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search services, salons..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-14 text-base rounded-xl"
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Select value={selectedCountry} onValueChange={handleCountryChange}>
                  <SelectTrigger className="h-12 rounded-xl">
                    <SelectValue placeholder="Country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map(country => (
                      <SelectItem key={country.code} value={country.code}>
                        {country.flag} {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedCity} onValueChange={setSelectedCity}>
                  <SelectTrigger className="h-12 rounded-xl">
                    <SelectValue placeholder="City" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCities.map(city => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedArea} onValueChange={setSelectedArea}>
                  <SelectTrigger className="h-12 rounded-xl">
                    <SelectValue placeholder="Area" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableAreas.map(area => (
                      <SelectItem key={area} value={area}>
                        {area}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedService} onValueChange={setSelectedService}>
                  <SelectTrigger className="h-12 rounded-xl">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manicure">Manicure</SelectItem>
                    <SelectItem value="pedicure">Pedicure</SelectItem>
                    <SelectItem value="eyelashes">Eyelashes</SelectItem>
                    <SelectItem value="brow">Brow</SelectItem>
                    <SelectItem value="barber">Barber</SelectItem>
                    <SelectItem value="cosmetology">Cosmetology</SelectItem>
                    <SelectItem value="laser">Laser</SelectItem>
                    <SelectItem value="makeup">Make up</SelectItem>
                    <SelectItem value="hairstylist">Hair stylist</SelectItem>
                    <SelectItem value="tattoo">Tattoo</SelectItem>
                    <SelectItem value="piercing">Piercing</SelectItem>
                    <SelectItem value="spa">Spa</SelectItem>
                    <SelectItem value="pmu">PMU</SelectItem>
                    <SelectItem value="massage">Massage</SelectItem>
                    <SelectItem value="waxing">Waxing</SelectItem>
                    <SelectItem value="facial">Facial</SelectItem>
                    <SelectItem value="fitness">Fitness</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Search Button */}
              <Button className="w-full md:w-auto mt-4 h-12 px-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl">
                <Search className="w-5 h-5 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* 1. Premium Salons Section */}
        {premiumSalons.length > 0 && (
          <section className="py-12 md:py-16">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent flex items-center gap-2">
                  <Award className="w-8 h-8 text-yellow-500" />
                  Premium Salons
                </h2>
                <p className="text-gray-600 text-sm mt-1">Luxury experiences with exclusive services</p>
              </div>
              <Link to="/salons">
                <Button variant="outline" className="hidden md:inline-flex">
                  View All
                </Button>
              </Link>
            </div>

            {/* Desktop */}
            <div className="hidden md:block">
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent className="-ml-2 md:-ml-4">
                  {premiumSalons.map(salon => (
                    <CarouselItem key={salon.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                      <SalonCard salon={salon} />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="hidden md:flex" />
                <CarouselNext className="hidden md:flex" />
              </Carousel>
            </div>

            {/* Mobile */}
            <div className="md:hidden">
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent className="-ml-2">
                  {premiumSalons.map(salon => (
                    <CarouselItem key={salon.id} className="pl-2 basis-[85%]">
                      <SalonCard salon={salon} />
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
          </section>
        )}

        {/* 2. Recommended Salons Section */}
        {recommendedSalons.length > 0 && (
          <section className="py-12 md:py-16 bg-gradient-to-b from-white to-blue-50 -mx-4 px-4">
            <div className="container mx-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-2">
                    <TrendingUp className="w-8 h-8 text-blue-500" />
                    Recommended for You
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">Handpicked based on your preferences</p>
                </div>
                <Link to="/salons">
                  <Button variant="outline" className="hidden md:inline-flex">
                    View All
                  </Button>
                </Link>
              </div>

              {/* Desktop */}
              <div className="hidden md:block">
                <Carousel
                  opts={{
                    align: "start",
                    loop: true,
                  }}
                  className="w-full"
                >
                  <CarouselContent className="-ml-2 md:-ml-4">
                    {recommendedSalons.map(salon => (
                      <CarouselItem key={salon.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                        <SalonCard salon={salon} />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="hidden md:flex" />
                  <CarouselNext className="hidden md:flex" />
                </Carousel>
              </div>

              {/* Mobile */}
              <div className="md:hidden">
                <Carousel
                  opts={{
                    align: "start",
                    loop: true,
                  }}
                  className="w-full"
                >
                  <CarouselContent className="-ml-2">
                    {recommendedSalons.map(salon => (
                      <CarouselItem key={salon.id} className="pl-2 basis-[85%]">
                        <SalonCard salon={salon} />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>
              </div>
            </div>
          </section>
        )}

        {/* 3. New in Katia Section */}
        {newSalons.length > 0 && (
          <section className="py-12 md:py-16">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent flex items-center gap-2">
                  <Sparkles className="w-8 h-8 text-green-500" />
                  New in Katia
                </h2>
                <p className="text-gray-600 text-sm mt-1">Recently joined salons bringing fresh experiences</p>
              </div>
              <Link to="/salons">
                <Button variant="outline" className="hidden md:inline-flex">
                  View All
                </Button>
              </Link>
            </div>

            {/* Desktop */}
            <div className="hidden md:block">
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent className="-ml-2 md:-ml-4">
                  {newSalons.map(salon => (
                    <CarouselItem key={salon.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                      <SalonCard salon={salon} />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="hidden md:flex" />
                <CarouselNext className="hidden md:flex" />
              </Carousel>
            </div>

            {/* Mobile */}
            <div className="md:hidden">
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent className="-ml-2">
                  {newSalons.map(salon => (
                    <CarouselItem key={salon.id} className="pl-2 basis-[85%]">
                      <SalonCard salon={salon} />
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
          </section>
        )}

        {/* 4. Near Your Location Section */}
        {locationSalons.length > 0 && (
          <section className="py-12 md:py-16 bg-gradient-to-b from-white to-purple-50 -mx-4 px-4">
            <div className="container mx-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-2">
                    <MapPin className="w-8 h-8 text-purple-500" />
                    Near Your Location
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">Within 3km from you • Quick & convenient</p>
                </div>
                <Link to="/salons">
                  <Button variant="outline" className="hidden md:inline-flex">
                    View All
                  </Button>
                </Link>
              </div>

              {/* Desktop */}
              <div className="hidden md:block">
                <Carousel
                  opts={{
                    align: "start",
                    loop: true,
                  }}
                  className="w-full"
                >
                  <CarouselContent className="-ml-2 md:-ml-4">
                    {locationSalons.map(salon => (
                      <CarouselItem key={salon.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                        <SalonCard salon={salon} />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="hidden md:flex" />
                  <CarouselNext className="hidden md:flex" />
                </Carousel>
              </div>

              {/* Mobile */}
              <div className="md:hidden">
                <Carousel
                  opts={{
                    align: "start",
                    loop: true,
                  }}
                  className="w-full"
                >
                  <CarouselContent className="-ml-2">
                    {locationSalons.map(salon => (
                      <CarouselItem key={salon.id} className="pl-2 basis-[85%]">
                        <SalonCard salon={salon} />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>
              </div>
            </div>
          </section>
        )}

        {/* Top Rated Salons - Carousel */}
        <section className="py-12 md:py-16">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-2">
                <Star className="w-8 h-8 text-yellow-500 fill-yellow-500" />
                Top Rated Salons
              </h2>
              <p className="text-gray-600 text-sm mt-1">Highly rated by our community</p>
            </div>
            <Link to="/salons">
              <Button variant="outline" className="hidden md:inline-flex">
                View All
              </Button>
            </Link>
          </div>

          {/* Desktop */}
          <div className="hidden md:block">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {topRatedSalons.map(salon => (
                  <CarouselItem key={salon.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                    <SalonCard salon={salon} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex" />
              <CarouselNext className="hidden md:flex" />
            </Carousel>
          </div>

          {/* Mobile */}
          <div className="md:hidden">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-2">
                {topRatedSalons.map(salon => (
                  <CarouselItem key={salon.id} className="pl-2 basis-[85%]">
                    <SalonCard salon={salon} />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        </section>

        {/* Why Choose Katia Booking */}
        <section className="py-12 md:py-16 bg-gradient-to-b from-white to-purple-50 -mx-4 px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
              Why Choose Katia Booking
            </h2>
            <p className="text-gray-600">Experience the future of beauty booking</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="pt-8 pb-8 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-bold text-purple-600 mb-2">Instant Booking</h3>
                <p className="text-sm text-gray-600">Book 24/7 with real-time confirmation</p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="pt-8 pb-8 text-center">
                <div className="w-16 h-16 bg-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-pink-600" />
                </div>
                <h3 className="text-lg font-bold text-pink-600 mb-2">Verified Reviews</h3>
                <p className="text-sm text-gray-600">Real reviews you can trust</p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="pt-8 pb-8 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-bold text-purple-600 mb-2">Best Locations</h3>
                <p className="text-sm text-gray-600">Premium salons near you</p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="pt-8 pb-8 text-center">
                <div className="w-16 h-16 bg-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-pink-600" />
                </div>
                <h3 className="text-lg font-bold text-pink-600 mb-2">Save Favorites</h3>
                <p className="text-sm text-gray-600">Never lose your favorites</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Trusted by Thousands */}
        <section className="py-12 md:py-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
              Trusted by Thousands
            </h2>
            <p className="text-gray-600">Join our growing community of beauty enthusiasts and salon partners</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1 transition-all duration-300">
                {clientsCount.toLocaleString()}+
              </div>
              <div className="text-sm text-gray-600">Happy Clients</div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-purple-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1 transition-all duration-300">
                {salonsCount.toLocaleString()}+
              </div>
              <div className="text-sm text-gray-600">Partner Salons</div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CalendarCheck className="w-8 h-8 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1 transition-all duration-300">
                {bookingsCount.toLocaleString()}+
              </div>
              <div className="text-sm text-gray-600">Successful Bookings</div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-yellow-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1 transition-all duration-300">
                {rating.toFixed(1)}<span className="text-yellow-500">/5</span>
              </div>
              <div className="text-sm text-gray-600">Average Rating</div>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-500 mb-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-purple-600" />
              <span>Premium Quality</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-purple-600" />
              <span>Secure Booking</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-purple-600" />
              <span>Instant Confirmation</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-purple-600" />
              <span>Best Prices</span>
            </div>
          </div>

          <div className="text-center text-sm text-gray-500">
            Trusted by leading beauty brands globally
          </div>
        </section>

        {/* What Our Clients Say */}
        <section className="py-12 md:py-16 bg-gradient-to-b from-white to-purple-50 -mx-4 px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
              What Our Clients Say
            </h2>
            <p className="text-gray-600">Join thousands of satisfied customers who trust Katia for their beauty needs</p>
          </div>

          {/* Testimonials Carousel */}
          <div className="max-w-4xl mx-auto relative mb-12">
            <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 relative">
              {/* Quote Icon */}
              <div className="absolute top-8 right-8 text-purple-200 text-6xl md:text-8xl font-serif">"</div>

              <div className="relative">
                {/* Avatar & Info */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                    {testimonials[currentTestimonial].avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonials[currentTestimonial].name}</h4>
                    <div className="flex gap-1 mb-1">
                      {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Testimonial Text */}
                <p className="text-gray-700 italic mb-6 text-lg leading-relaxed">
                  {testimonials[currentTestimonial].text}
                </p>

                {/* Service Info */}
                <div className="flex flex-wrap gap-2 text-sm text-gray-500">
                  <span>{testimonials[currentTestimonial].service}</span>
                  <span>•</span>
                  <span>{testimonials[currentTestimonial].location}</span>
                  <span>•</span>
                  <span>{testimonials[currentTestimonial].city}</span>
                  <span>•</span>
                  <span>{testimonials[currentTestimonial].time}</span>
                </div>
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={prevTestimonial}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-purple-50 transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={nextTestimonial}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-purple-50 transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Dots Indicator */}
            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentTestimonial
                      ? 'w-8 bg-gradient-to-r from-purple-600 to-pink-600'
                      : 'w-2 bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Bottom Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">4.9/5</div>
              <div className="text-sm text-gray-600">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">10K+</div>
              <div className="text-sm text-gray-600">Happy Clients</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">500+</div>
              <div className="text-sm text-gray-600">Partner Salons</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">50K+</div>
              <div className="text-sm text-gray-600">Bookings Made</div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 -mx-4 px-4 bg-gradient-to-r from-purple-600 to-pink-600">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Ready to Transform Your Look?
            </h2>
            <p className="text-lg md:text-xl text-purple-100 mb-8">
              Join thousands of satisfied customers who trust us for their beauty needs
            </p>
            <Link to="/salons">
              <Button className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-6 text-lg rounded-xl h-auto">
                Browse Salons
              </Button>
            </Link>
          </div>
        </section>
      </div>

      {/* Footer */}
      <Footer />

      {/* AI Booking Assistant Modal */}
      <AIBookingAssistant 
        isOpen={showAIAssistant} 
        onClose={() => setShowAIAssistant(false)}
        userLocation={userLocation}
        userCity={currentCity}
      />
    </div>
  );
}