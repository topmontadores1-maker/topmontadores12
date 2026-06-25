import { useParams, Link } from 'react-router-dom';
import { Wrench, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';
import { sanityClient } from '@/lib/sanity';

export default function ServicoPage() {
  const { slug } = useParams();
  const [cidadesAtendidas, setCidadesAtendidas] = useState<{nome: string, uf: string, slug: string}[]>([]);
  const [loading, setLoading] = useState(true);
  const [serviceName, setServiceName] = useState('');
  
  const fallbackService = slug?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch service name
        const serviceQuery = `*[_type == "service" && slug.current == $slug][0]{name}`;
        const service = await sanityClient.fetch(serviceQuery, { slug });
        if (service) setServiceName(service.name);

        // Fetch cities that have montadores for this service
        const cidadesQuery = `
          *[_type == "montador" && $slug in servicos[]->slug.current && status == "ATIVO"] {
            cidade,
            estado
          }
        `;
        const montadores = await sanityClient.fetch(cidadesQuery, { slug });
        
        // Group distinct cities
        const citiesMap = new Map();
        montadores.forEach((m: any) => {
          const key = `${m.cidade}-${m.estado}`;
          if (!citiesMap.has(key)) {
            citiesMap.set(key, {
              nome: m.cidade,
              uf: m.estado,
              slug: m.cidade.toLowerCase().replace(/\s+/g, '-')
            });
          }
        });

        setCidadesAtendidas(Array.from(citiesMap.values()).sort((a, b) => a.nome.localeCompare(b.nome)));
      } catch (error) {
        console.error("Failed to fetch service data:", error);
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchData();
  }, [slug]);

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-primary rounded-3xl p-8 md:p-12 mb-12 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10">
          <Wrench className="h-48 w-48" />
        </div>
        <div className="relative z-10 max-w-3xl">
          <Badge className="bg-white/20 text-white hover:bg-white/30 mb-4 px-3 py-1 text-sm font-medium">Serviço Especializado</Badge>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            {serviceName || fallbackService}
          </h1>
          <p className="text-xl text-white/80">
            Encontre profissionais especializados neste serviço na sua região.
          </p>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-6">Cidades com atendimento</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cidadesAtendidas.map(cidade => (
          <Link key={`${cidade.uf}-${cidade.slug}`} to={`/servico/${slug}/${cidade.uf.toLowerCase()}/${cidade.slug}`}>
            <Card className="hover:shadow-md transition-all">
              <CardContent className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-gray-100 p-2 rounded-lg text-gray-500">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{cidade.nome}</h3>
                    <p className="text-sm text-gray-500">{cidade.uf}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
