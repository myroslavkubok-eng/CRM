import { createContext, useContext, useState, ReactNode } from 'react';

export interface Service {
  id: string;
  name: string;
  category: string;
  price: number;
  duration: number;
  description?: string;
  discount?: number;
  originalPrice?: number;
}

interface ServicesContextType {
  services: Service[];
  addService: (service: Service) => void;
  updateService: (service: Service) => void;
  deleteService: (id: string) => void;
  getServiceById: (id: string) => Service | undefined;
  getServicesByCategory: (category: string) => Service[];
}

const ServicesContext = createContext<ServicesContextType | undefined>(undefined);

export function ServicesProvider({ children }: { children: ReactNode }) {
  const [services, setServices] = useState<Service[]>([
    {
      id: '1',
      name: 'Haircut & Style',
      category: 'Hair stylist',
      price: 65,
      duration: 60,
      description: 'Professional haircut with styling'
    },
    {
      id: '2',
      name: 'Beard Trim',
      category: 'Barber',
      price: 35,
      duration: 30,
      description: 'Precision beard trimming and shaping'
    },
    {
      id: '3',
      name: 'Manicure',
      category: 'Manicure',
      price: 36,
      duration: 45,
      description: 'Classic manicure with polish',
      discount: 20,
      originalPrice: 45
    },
    {
      id: '4',
      name: 'Pedicure',
      category: 'Pedicure',
      price: 55,
      duration: 60,
      description: 'Relaxing pedicure treatment'
    },
    {
      id: '5',
      name: 'Full Color',
      category: 'Hair stylist',
      price: 90,
      duration: 120,
      description: 'Complete hair coloring service with premium products',
      discount: 25,
      originalPrice: 120
    },
    {
      id: '6',
      name: 'Facial Treatment',
      category: 'Facial',
      price: 85,
      duration: 60,
      description: 'Deep cleansing facial with mask'
    },
    {
      id: '7',
      name: 'Eyelash Extensions',
      category: 'Eyelashes',
      price: 68,
      duration: 90,
      description: 'Full set classic eyelash extensions',
      discount: 15,
      originalPrice: 80
    },
    {
      id: '8',
      name: 'Spa Massage',
      category: 'Spa',
      price: 95,
      duration: 75,
      description: 'Relaxing full body massage with aromatherapy oils'
    },
    {
      id: '9',
      name: 'Eyebrow Shaping',
      category: 'Brow',
      price: 25,
      duration: 20,
      description: 'Professional eyebrow shaping and tinting'
    },
    {
      id: '10',
      name: 'Laser Hair Removal',
      category: 'Laser',
      price: 150,
      duration: 45,
      description: 'Advanced laser hair removal treatment',
      discount: 10,
      originalPrice: 167
    },
    {
      id: '11',
      name: 'Makeup Application',
      category: 'Make up',
      price: 75,
      duration: 60,
      description: 'Professional makeup for special events'
    },
    {
      id: '12',
      name: 'Deep Tissue Massage',
      category: 'Massage',
      price: 110,
      duration: 90,
      description: 'Therapeutic deep tissue massage'
    },
    {
      id: '13',
      name: 'Waxing Full Body',
      category: 'Waxing',
      price: 120,
      duration: 75,
      description: 'Complete full body waxing service'
    },
    {
      id: '14',
      name: 'Microblading',
      category: 'PMU',
      price: 350,
      duration: 150,
      description: 'Semi-permanent eyebrow microblading',
      discount: 15,
      originalPrice: 412
    },
    {
      id: '15',
      name: 'Tattoo Small',
      category: 'Tattoo',
      price: 100,
      duration: 60,
      description: 'Small custom tattoo design'
    }
  ]);

  const addService = (service: Service) => {
    setServices([...services, service]);
  };

  const updateService = (updatedService: Service) => {
    setServices(services.map(service => 
      service.id === updatedService.id ? updatedService : service
    ));
  };

  const deleteService = (id: string) => {
    setServices(services.filter(service => service.id !== id));
  };

  const getServiceById = (id: string) => {
    return services.find(service => service.id === id);
  };

  const getServicesByCategory = (category: string) => {
    return services.filter(service => service.category === category);
  };

  return (
    <ServicesContext.Provider
      value={{
        services,
        addService,
        updateService,
        deleteService,
        getServiceById,
        getServicesByCategory
      }}
    >
      {children}
    </ServicesContext.Provider>
  );
}

export function useServices() {
  const context = useContext(ServicesContext);
  if (context === undefined) {
    throw new Error('useServices must be used within a ServicesProvider');
  }
  return context;
}
