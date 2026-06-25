import { useParams } from 'react-router-dom';
import { MapPin, Star, Phone, CheckCircle2, Clock, CalendarDays, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';
import { sanityClient } from '@/lib/sanity';

export default function MontadorPage() {
  const { slug } = useParams();
  const [montador, setMontador] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMontador = async () => {
      setLoading(true);
      try {
        // extract slug since format might be id-city
        const querySlug = slug?.split('-')[0] || slug;

        const query = `
          *[_type == "montador" && slug.current == $slug][0] {
            "nome": firstName + " " + lastName,
            cidade,
            estado,
            avaliacao,
            numeroAvaliacoes,
            "servicos": servicos[]->name,
            horarios,
            whatsapp,
            "foto": foto.asset->url,
            "galeria": galeria[].asset->url
          }
        `;
        const data = await sanityClient.fetch(query, { slug: querySlug });
        setMontador(data);
      } catch (error) {
        console.error("Failed to fetch montador:", error);
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchMontador();
  }, [slug]);

  if (loading) {
    return <div className="max-w-4xl mx-auto py-12 px-4 text-center">Carregando...</div>;
  }

  if (!montador) {
    return <div className="max-w-4xl mx-auto py-12 px-4 text-center">Montador não encontrado.</div>;
  }

  const whatsAppMsg = encodeURIComponent(`Olá, encontrei o montador ${montador.nome} no TopMontador e gostaria de solicitar um orçamento.`);
  // Use professional's whatsapp or fallback to main line
  const topMontadorWhatsApp = montador.whatsapp?.replace(/\D/g, '') || '5511999999999';

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      {/* Profile Header */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="h-32 bg-primary/10"></div>
        <div className="px-8 pb-8 relative">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-end -mt-16 mb-6">
            <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
              <AvatarImage src={montador.foto} />
              <AvatarFallback className="text-3xl">{montador.nome.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-3xl font-extrabold text-gray-900">{montador.nome}</h1>
                <CheckCircle2 className="h-6 w-6 text-green-500" />
              </div>
              <div className="flex flex-wrap items-center gap-4 text-gray-600">
                <div className="flex items-center text-yellow-500">
                  <Star className="h-5 w-5 fill-current" />
                  <span className="ml-1 font-bold text-gray-900">{montador.avaliacao || '5.0'}</span>
                  <span className="text-gray-500 ml-1">({montador.numeroAvaliacoes || 0} avaliações)</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-1 text-gray-400" />
                  {montador.cidade}, {montador.estado}
                </div>
              </div>
            </div>
            <div>
              <Button 
                className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/20 h-12 px-8 text-lg"
                onClick={() => window.open(`https://wa.me/${topMontadorWhatsApp}?text=${whatsAppMsg}`, '_blank')}
              >
                <Phone className="h-5 w-5 mr-2" />
                Solicitar Orçamento
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-gray-100">
            <div>
              <h3 className="font-bold text-lg mb-4 flex items-center text-gray-900">
                <ShieldCheck className="h-5 w-5 mr-2 text-primary" /> Especialidades
              </h3>
              <div className="flex flex-wrap gap-2">
                {montador.servicos?.map((srv: string) => (
                  <Badge key={srv} variant="secondary" className="bg-primary/5 text-primary hover:bg-primary/10 text-sm py-1">
                    {srv}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4 flex items-center text-gray-900">
                <CalendarDays className="h-5 w-5 mr-2 text-primary" /> Horário de Atendimento
              </h3>
              <div className="flex items-center text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">
                <Clock className="h-5 w-5 mr-2 text-gray-400" />
                {montador.horarios || 'Segunda a Sábado, 08:00 às 18:00'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Section */}
      {montador.galeria && montador.galeria.length > 0 && (
        <>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Trabalhos Realizados</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {montador.galeria.map((img: string, idx: number) => (
              <Card key={idx} className="overflow-hidden border-0 shadow-sm rounded-2xl group cursor-pointer">
                <CardContent className="p-0 relative aspect-square">
                  <img src={img} alt={`Trabalho ${idx + 1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
