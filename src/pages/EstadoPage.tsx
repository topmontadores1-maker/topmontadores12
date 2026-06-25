import { useParams, Link } from 'react-router-dom';
import { MapPin, Users, Wrench } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import { sanityClient } from '@/lib/sanity';

export default function EstadoPage() {
  const { uf } = useParams();
  const [cidades, setCidades] = useState<{nome: string, slug: string, montadores: number}[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCidades = async () => {
      setLoading(true);
      try {
        const query = `
          *[_type == "montador" && estado == $uf && status == "ATIVO"] {
            cidade
          }
        `;
        const montadores = await sanityClient.fetch(query, { uf: uf?.toUpperCase() });
        
        const cityCounts: Record<string, number> = {};
        montadores.forEach((m: any) => {
          const city = m.cidade;
          if (cityCounts[city]) {
            cityCounts[city]++;
          } else {
            cityCounts[city] = 1;
          }
        });

        const formattedCidades = Object.keys(cityCounts).map(city => ({
          nome: city,
          slug: city.toLowerCase().replace(/\s+/g, '-'),
          montadores: cityCounts[city]
        })).sort((a, b) => b.montadores - a.montadores);

        setCidades(formattedCidades);
      } catch (error) {
        console.error("Failed to fetch cities:", error);
      } finally {
        setLoading(false);
      }
    };
    if (uf) fetchCidades();
  }, [uf]);

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-12 border-b pb-8">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4 uppercase">
          Montadores em {uf}
        </h1>
        <p className="text-xl text-gray-600">
          Encontre os melhores profissionais de montagem no estado.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cidades.map(cidade => (
          <Link key={cidade.slug} to={`/estado/${uf}/${cidade.slug}`}>
            <Card className="hover:shadow-lg transition-shadow border-gray-200">
              <CardContent className="p-6 flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-3 rounded-xl text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{cidade.nome}</h3>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <Users className="h-4 w-4" /> {cidade.montadores} profissionais
                    </p>
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
