import { useState } from 'react';
import { SalonDashboard } from '../components/sideDashboard/SalonDashboard';
import type { User, Salon } from '../../types/roles';

export function DashboardDemoPage() {
  // Demo data - Owner with multiple salons
  const [currentUser] = useState<User>({
    id: 'user-1',
    email: 'owner@luxurysalon.com',
    firstName: 'Sophia',
    lastName: 'Anderson',
    role: 'owner',
    salonId: 'salon-1',
    createdAt: new Date('2024-01-01'),
  });

  const [salons] = useState<Salon[]>([
    {
      id: 'salon-1',
      name: 'Luxury Beauty Salon - Downtown',
      address: '123 Main Street, Dubai Marina, Dubai, UAE',
      phone: '+971 4 123 4567',
      email: 'downtown@luxurysalon.com',
      logo: undefined,
      photos: [],
      ownerId: 'user-1',
      services: [
        {
          id: 'service-1',
          category: 'Hair',
          name: 'Haircut & Styling',
          price: { USD: 50, EUR: 46, AED: 184, GBP: 40, RUB: 4790 },
          duration: 60,
          description: 'Professional haircut and styling service',
        },
        {
          id: 'service-2',
          category: 'Nails',
          name: 'Manicure',
          price: { USD: 30, EUR: 28, AED: 110, GBP: 24, RUB: 2874 },
          duration: 45,
          description: 'Classic manicure service',
        },
        {
          id: 'service-3',
          category: 'Makeup',
          name: 'Bridal Makeup',
          price: { USD: 200, EUR: 184, AED: 735, GBP: 158, RUB: 19160 },
          duration: 120,
          description: 'Complete bridal makeup package',
        },
      ],
      staff: [
        {
          id: 'staff-1',
          email: 'maria@luxurysalon.com',
          firstName: 'Maria',
          lastName: 'Rodriguez',
          role: 'admin',
          salonId: 'salon-1',
          createdAt: new Date('2024-01-15'),
        },
        {
          id: 'staff-2',
          email: 'elena@luxurysalon.com',
          firstName: 'Elena',
          lastName: 'Petrova',
          role: 'master',
          salonId: 'salon-1',
          services: ['service-1'],
          createdAt: new Date('2024-02-01'),
        },
        {
          id: 'staff-3',
          email: 'anna@luxurysalon.com',
          firstName: 'Anna',
          lastName: 'Smith',
          role: 'master',
          salonId: 'salon-1',
          services: ['service-2', 'service-3'],
          createdAt: new Date('2024-02-10'),
        },
      ],
      createdAt: new Date('2024-01-01'),
    },
    {
      id: 'salon-2',
      name: 'Luxury Beauty Salon - Mall of Emirates',
      address: 'Mall of Emirates, Sheikh Zayed Road, Dubai, UAE',
      phone: '+971 4 234 5678',
      email: 'mall@luxurysalon.com',
      logo: undefined,
      photos: [],
      ownerId: 'user-1',
      services: [
        {
          id: 'service-4',
          category: 'Hair',
          name: 'Hair Coloring',
          price: { USD: 120, EUR: 110, AED: 441, GBP: 95, RUB: 11496 },
          duration: 150,
          description: 'Professional hair coloring service',
        },
      ],
      staff: [
        {
          id: 'staff-4',
          email: 'sarah@luxurysalon.com',
          firstName: 'Sarah',
          lastName: 'Johnson',
          role: 'admin',
          salonId: 'salon-2',
          createdAt: new Date('2024-03-01'),
        },
      ],
      createdAt: new Date('2024-03-01'),
    },
  ]);

  const [currentSalonId, setCurrentSalonId] = useState('salon-1');

  const handleSalonChange = (salonId: string) => {
    setCurrentSalonId(salonId);
  };

  const handleAddSalon = () => {
    alert('Add new salon flow would open here!');
  };

  const handleLogout = () => {
    alert('Logout functionality would redirect to login page');
  };

  return (
    <SalonDashboard
      currentUser={currentUser}
      salons={salons}
      currentSalonId={currentSalonId}
      onSalonChange={handleSalonChange}
      onAddSalon={handleAddSalon}
      onLogout={handleLogout}
    />
  );
}
