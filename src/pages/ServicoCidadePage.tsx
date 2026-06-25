import { useParams, Link } from 'react-router-dom';
import { MapPin, Star, Phone, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';
import { sanityClient } from '@/lib/sanity';

export default function ServicoCidadePage() {
  const { slug, uf, cidade } = useParams();
  const [montadores, setMontadores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [serviceName, setServiceName] = useState('');

  const fallbackService = slug?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const formattedCity = cidade?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch service name
        const serviceQuery = `*[_type == "service" && slug.current == $slug][0]{name}`;
        const service = await sanityClient.fetch(serviceQuery, { slug });
        if (service) setServiceName(service.name);

        const query = `
          *[_type == "montador" && estado == $uf && cidade match $city && $slug in servicos[]->slug.current && status == "ATIVO"] {
            _id,
            "id": slug.current,
            "nome": firstName + " " + lastName,
            cidade,
            estado,
            avaliacao,
            "servicos": servicos[]->name,
            "foto": foto.asset->url,
            whatsapp
          }
        `;
        const data = await sanityClient.fetch(query, { 
          uf: uf?.toUpperCase(),
          city: formattedCity,
          slug
        });
        
        setMontadores(data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };
    if (uf && formattedCity && slug) fetchData();
  }, [uf, formattedCity, slug]);

  const displayService = serviceName || fallbackService;

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      {/* SEO Optimized Header */}
      <div className="mb-12 border-b pb-8">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <Link to={`/servico/${slug}`} className="hover:text-primary transition-colors">{displayService}</Link>
          <span>/</span>
          <Link to={`/estado/${uf}`} className="hover:text-primary transition-colors uppercase">{uf}</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">{formattedCity}</span>
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
          {displayService} em {formattedCity}, {uf?.toUpperCase()}
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl">
          Precisa de {displayService?.toLowerCase()} em {formattedCity}? 
          Compare os melhores profissionais avaliados da região e solicite um orçamento via WhatsApp.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {montadores.map(montador => (
          <Card key={montador.id} className="hover:shadow-lg transition-all border-gray-200 overflow-hidden group">
            <CardContent className="p-0">
              <div className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <Avatar className="h-16 w-16 border-2 border-primary/20">
                    <AvatarImage src={montador.foto} />
                    <AvatarFallback>{montador.nome.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-lg text-gray-900 leading-tight">{montador.nome}</h3>
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    </div>
                    <div className="flex items-center text-yellow-500 text-sm mb-1">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="ml-1 font-medium text-gray-700">{montador.avaliacao}</span>
                    </div>
                    <div className="flex items-center text-gray-500 text-sm">
                      <MapPin className="h-4 w-4 mr-1" />
                      {montador.cidade}, {montador.estado}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {montador.servicos.map(srv => (
                    <Badge variant="secondary" key={srv} className="bg-blue-50 text-primary hover:bg-blue-100 font-normal">
                      {srv}
                    </Badge>
                  ))}
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <Link to={`/montador/${montador.id}-${cidade}`}>
                    <Button variant="outline" className="w-full">Ver Perfil</Button>
                  </Link>
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700 text-white" 
                    onClick={() => window.open(`https://wa.me/5511999999999?text=${encodeURIComponent(`Olá, encontrei o montador ${montador.nome} no TopMontador e gostaria de solicitar um orçamento.`)}`, '_blank')}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Orçamento
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
