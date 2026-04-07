import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockSalons, serviceCategories } from '../data/mockData';
import { SalonCard } from '../components/SalonCard';
import { Card } from '../components/ui/card';
import { Checkbox } from '../components/ui/checkbox';
import { Label } from '../components/ui/label';
import { Slider } from '../components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../components/ui/sheet';
import { Button } from '../components/ui/button';
import { SlidersHorizontal, ArrowLeft, X } from 'lucide-react';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';

export function SalonListingPage() {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState('recommended');
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [minRating, setMinRating] = useState(0);
  const [showAvailableToday, setShowAvailableToday] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  const [maxDistance, setMaxDistance] = useState('5');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(c => c !== categoryId)
        : [...prev, categoryId]
    );
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 200]);
    setMinRating(0);
    setShowAvailableToday(false);
    setMaxDistance('5');
    setSortBy('recommended');
  };

  // Фильтрация салонов
  const filteredSalons = mockSalons.filter(salon => {
    // Фильтр по категориям услуг
    if (selectedCategories.length > 0) {
      const hasMatchingService = salon.services?.some(service =>
        selectedCategories.includes(service.category)
      );
      if (!hasMatchingService) return false;
    }

    // Фильтр по цене (проверяем минимальную цену услуг салона)
    const minPrice = Math.min(...(salon.services?.map(s => s.price) || [0]));
    const maxPrice = Math.max(...(salon.services?.map(s => s.price) || [200]));
    if (maxPrice < priceRange[0] || minPrice > priceRange[1]) {
      return false;
    }

    // Фильтр по рейтингу
    if (minRating > 0 && salon.rating < minRating) {
      return false;
    }

    // Фильтр "Доступно сегодня"
    if (showAvailableToday && !salon.isOpenNow) {
      return false;
    }

    // Фильтр по расстоянию
    const maxDist = parseFloat(maxDistance);
    if (salon.distance > maxDist) {
      return false;
    }

    return true;
  });

  // Сортировка салонов
  const sortedSalons = [...filteredSalons].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'distance':
        return a.distance - b.distance;
      case 'new':
        // Предполагаем, что салоны с большим ID - новее
        return parseInt(b.id) - parseInt(a.id);
      case 'price-low':
        const minPriceA = Math.min(...(a.services?.map(s => s.price) || [0]));
        const minPriceB = Math.min(...(b.services?.map(s => s.price) || [0]));
        return minPriceA - minPriceB;
      case 'price-high':
        const maxPriceA = Math.max(...(a.services?.map(s => s.price) || [0]));
        const maxPriceB = Math.max(...(b.services?.map(s => s.price) || [0]));
        return maxPriceB - maxPriceA;
      case 'recommended':
      default:
        // Рекомендованные: комбинация рейтинга и количества отзывов
        const scoreA = a.rating * Math.log(a.reviewCount + 1);
        const scoreB = b.rating * Math.log(b.reviewCount + 1);
        return scoreB - scoreA;
    }
  });

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="container mx-auto px-4 py-4 md:py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-600 hover:text-purple-600 mb-4 md:mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Home</span>
        </button>

        <div className="mb-4 md:mb-8">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2">
            Beauty Salons in New York
          </h1>
          <p className="text-gray-600">{sortedSalons.length} salons found</p>
        </div>

        {/* Mobile Filters and Sort Bar */}
        <div className="md:hidden flex items-center gap-2 mb-4">
          <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="flex-1">
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filters
                {(selectedCategories.length > 0 || minRating > 0 || showAvailableToday) && (
                  <span className="ml-2 bg-purple-600 text-white text-xs rounded-full px-2 py-0.5">
                    {selectedCategories.length + (minRating > 0 ? 1 : 0) + (showAvailableToday ? 1 : 0)}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[85vh] overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
                <SheetDescription className="sr-only">
                  Filter salons by category, price, rating, and more
                </SheetDescription>
              </SheetHeader>
              
              <div className="mt-6 space-y-6">
                {/* Service Category */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">Service Category</h3>
                  </div>
                  <div className="space-y-3">
                    {serviceCategories.map(category => (
                      <div key={category.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`mobile-${category.id}`}
                          checked={selectedCategories.includes(category.id)}
                          onCheckedChange={() => toggleCategory(category.id)}
                        />
                        <Label
                          htmlFor={`mobile-${category.id}`}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {category.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <h3 className="font-semibold mb-3">Price Range</h3>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={200}
                    step={10}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>

                {/* Rating */}
                <div>
                  <h3 className="font-semibold mb-3">Minimum Rating</h3>
                  <div className="space-y-2">
                    {[4.5, 4.0, 3.5, 3.0].map(rating => (
                      <div key={rating} className="flex items-center space-x-2">
                        <Checkbox
                          id={`mobile-rating-${rating}`}
                          checked={minRating === rating}
                          onCheckedChange={() => setMinRating(rating)}
                        />
                        <Label
                          htmlFor={`mobile-rating-${rating}`}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {rating}+ stars
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Availability */}
                <div>
                  <h3 className="font-semibold mb-3">Availability</h3>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="mobile-today"
                      checked={showAvailableToday}
                      onCheckedChange={() => setShowAvailableToday(!showAvailableToday)}
                    />
                    <Label htmlFor="mobile-today" className="text-sm font-normal cursor-pointer">
                      Available Today
                    </Label>
                  </div>
                </div>

                {/* Distance */}
                <div>
                  <h3 className="font-semibold mb-3">Distance</h3>
                  <Select value={maxDistance} onValueChange={setMaxDistance}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select distance" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Within 1 km</SelectItem>
                      <SelectItem value="3">Within 3 km</SelectItem>
                      <SelectItem value="5">Within 5 km</SelectItem>
                      <SelectItem value="10">Within 10 km</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4 pb-safe">
                  <Button variant="outline" onClick={clearAllFilters} className="flex-1">
                    Clear All
                  </Button>
                  <Button 
                    onClick={() => setMobileFiltersOpen(false)} 
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600"
                  >
                    Show Results ({sortedSalons.length})
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recommended">Recommended</SelectItem>
              <SelectItem value="rating">Highest Rating</SelectItem>
              <SelectItem value="distance">Nearest</SelectItem>
              <SelectItem value="new">Newest</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-8">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden md:block w-80">
            <Card className="p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Filters</h2>
                <Button variant="ghost" size="sm" onClick={clearAllFilters}>Clear all</Button>
              </div>

              {/* Service Category */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Service Category</h3>
                <div className="space-y-3">
                  {serviceCategories.map(category => (
                    <div key={category.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={category.id}
                        checked={selectedCategories.includes(category.id)}
                        onCheckedChange={() => toggleCategory(category.id)}
                      />
                      <Label
                        htmlFor={category.id}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {category.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Price Range</h3>
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={200}
                  step={10}
                  className="mb-2"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>

              {/* Rating */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Minimum Rating</h3>
                <div className="space-y-2">
                  {[4.5, 4.0, 3.5, 3.0].map(rating => (
                    <div key={rating} className="flex items-center space-x-2">
                      <Checkbox
                        id={`rating-${rating}`}
                        checked={minRating === rating}
                        onCheckedChange={() => setMinRating(rating)}
                      />
                      <Label
                        htmlFor={`rating-${rating}`}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {rating}+ stars
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Availability</h3>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="today"
                    checked={showAvailableToday}
                    onCheckedChange={() => setShowAvailableToday(!showAvailableToday)}
                  />
                  <Label htmlFor="today" className="text-sm font-normal cursor-pointer">
                    Available Today
                  </Label>
                </div>
              </div>

              {/* Distance */}
              <div>
                <h3 className="font-semibold mb-3">Distance</h3>
                <Select value={maxDistance} onValueChange={setMaxDistance}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select distance" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Within 1 km</SelectItem>
                    <SelectItem value="3">Within 3 km</SelectItem>
                    <SelectItem value="5">Within 5 km</SelectItem>
                    <SelectItem value="10">Within 10 km</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </Card>
          </aside>

          {/* Results */}
          <div className="flex-1">
            {/* Desktop Sort */}
            <div className="hidden md:flex items-center justify-between mb-6">
              <div className="flex items-center gap-4 ml-auto">
                <span className="text-sm text-gray-600">Sort by:</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recommended">Recommended</SelectItem>
                    <SelectItem value="rating">Highest Rating</SelectItem>
                    <SelectItem value="distance">Nearest</SelectItem>
                    <SelectItem value="new">Newest</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 pb-20 md:pb-0">
              {sortedSalons.length > 0 ? (
                sortedSalons.map(salon => (
                  <SalonCard key={salon.id} salon={salon} />
                ))
              ) : (
                <div className="col-span-full text-center py-16">
                  <p className="text-gray-500 text-lg mb-4">
                    No salons found matching your criteria
                  </p>
                  <Button onClick={clearAllFilters} variant="outline">
                    Clear all filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}