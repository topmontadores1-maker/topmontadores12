import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { sanityClient } from '@/lib/sanity';

interface Service {
  _id: string;
  name: string;
  slug: { current: string };
}

export default function HomePage() {
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState('');
  const [estado, setEstado] = useState('');
  const [cidade, setCidade] = useState('');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await sanityClient.fetch(`*[_type == "service" && active == true]{_id, name, slug}`);
        if(data && data.length > 0) {
          setServices(data);
        } else {
          console.warn("No active services found in Sanity.");
        }
      } catch (error) {
        console.error("Failed to fetch from Sanity:", error);
      }
    };
    fetchServices();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedService && estado && cidade) {
      navigate(`/servico/${selectedService}/${estado.toLowerCase()}/${cidade.toLowerCase().replace(/ /g, '-')}`);
    }
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-primary pt-20 pb-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
            Encontre os Melhores Montadores do Brasil
          </h1>
          <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto">
            Conectamos você a profissionais qualificados para montagem e instalação na sua cidade.
          </p>
          
          {/* Search Box */}
          <div className="bg-white p-4 md:p-6 rounded-2xl shadow-xl max-w-3xl mx-auto">
            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-1 relative flex items-center">
                <Wrench className="absolute left-3 text-gray-400 h-5 w-5" />
                <select 
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all appearance-none"
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  required
                >
                  <option value="" disabled>Qual serviço?</option>
                  {services.map(s => (
                    <option key={s._id} value={s.slug.current}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-1 relative flex items-center">
                <MapPin className="absolute left-3 text-gray-400 h-5 w-5" />
                <select 
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all appearance-none"
                  value={estado}
                  onChange={(e) => setEstado(e.target.value)}
                  required
                >
                  <option value="" disabled>Estado (UF)</option>
                  <option value="SP">São Paulo</option>
                  <option value="RJ">Rio de Janeiro</option>
                  <option value="MG">Minas Gerais</option>
                  <option value="PR">Paraná</option>
                  {/* ... can add more later */}
                </select>
              </div>
              <div className="md:col-span-1 relative flex items-center">
                <MapPin className="absolute left-3 text-gray-400 h-5 w-5" />
                <input 
                  type="text"
                  placeholder="Cidade"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                  required
                />
              </div>
              <div className="md:col-span-1">
                <Button type="submit" className="w-full h-full min-h-[50px] bg-secondary hover:bg-secondary/90 text-white text-lg font-semibold">
                  <Search className="mr-2 h-5 w-5" /> Buscar
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Stats/Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Wrench className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Profissionais Qualificados</h3>
              <p className="text-gray-500">Montadores verificados e com avaliações para sua segurança e tranquilidade.</p>
            </div>
            <div className="p-6">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Perto de Você</h3>
              <p className="text-gray-500">Encontre especialistas disponíveis na sua cidade rapidamente.</p>
            </div>
            <div className="p-6">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Orçamento Fácil</h3>
              <p className="text-gray-500">Fale direto com o profissional pelo WhatsApp e feche o serviço na hora.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
