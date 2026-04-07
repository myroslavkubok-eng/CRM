import { Link } from 'react-router-dom';

const logo = "/icons/logo.svg";

export function Footer() {
  return (
    <footer className="bg-gray-50 py-12 border-t border-gray-200">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {/* Logo & Description */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img src={logo} alt="Katia Booking Logo" className="w-10 h-10 rounded-full" />
              <span className="text-xl font-bold text-gray-900">Katia Booking</span>
            </div>
            <p className="text-sm text-gray-600">The best platform for salon booking</p>
          </div>

          {/* Category */}
          <div>
            <h4 className="font-bold text-gray-900 mb-4">Category</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link to="/salons?category=hairstylist" className="hover:text-purple-600">Hair Stylist</Link></li>
              <li><Link to="/salons?category=manicure" className="hover:text-purple-600">Manicure</Link></li>
              <li><Link to="/salons?category=spa" className="hover:text-purple-600">Spa</Link></li>
              <li><Link to="/salons?category=massage" className="hover:text-purple-600">Massage</Link></li>
              <li><Link to="/salons?category=barber" className="hover:text-purple-600">Barber</Link></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-gray-900 mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link to="/become-partner" className="hover:text-purple-600">Become a Partner</Link></li>
              <li><Link to="/auth" className="hover:text-purple-600">Login as Client</Link></li>
              <li><Link to="/salon-dashboard" className="hover:text-purple-600">Login as Salon</Link></li>
              <li><Link to="/about" className="hover:text-purple-600">About Us</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-bold text-gray-900 mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link to="/help" className="hover:text-purple-600">Help Center</Link></li>
              <li><Link to="/contact" className="hover:text-purple-600">Contact Us</Link></li>
              <li><Link to="/privacy" className="hover:text-purple-600">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-purple-600">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8 text-center text-sm text-gray-600">
          © 2025 Katia Booking. All rights reserved
        </div>
      </div>
    </footer>
  );
}