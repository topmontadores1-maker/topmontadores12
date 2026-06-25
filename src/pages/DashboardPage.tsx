import { BarChart3, Users, MousePointerClick, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Administrativo</h1>
        <p className="text-gray-500">Visão geral do TopMontador</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="montadores">Montadores (Oferta)</TabsTrigger>
          <TabsTrigger value="cliques">Cliques (Leads)</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Montadores</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1.248</div>
                <p className="text-xs text-muted-foreground">+12 cadastros hoje</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cliques WhatsApp</CardTitle>
                <MousePointerClick className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4.320</div>
                <p className="text-xs text-muted-foreground">+24% desde o mês passado</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cidades Atendidas</CardTitle>
                <MapPinIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">142</div>
                <p className="text-xs text-muted-foreground">em 18 estados</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cadastros Pendentes</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">18</div>
                <p className="text-xs text-muted-foreground">Aguardando aprovação</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Cidades Mais Buscadas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { cidade: 'São Paulo, SP', buscas: 1240 },
                    { cidade: 'Campinas, SP', buscas: 850 },
                    { cidade: 'Belo Horizonte, MG', buscas: 620 },
                    { cidade: 'Rio de Janeiro, RJ', buscas: 490 },
                    { cidade: 'Curitiba, PR', buscas: 310 },
                  ].map(item => (
                    <div key={item.cidade} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{item.cidade}</span>
                      <span className="text-sm text-gray-500">{item.buscas} buscas</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Serviços Mais Buscados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { servico: 'Montagem de Móveis', percent: 65 },
                    { servico: 'Instalação de TV', percent: 15 },
                    { servico: 'Montagem Corporativa', percent: 10 },
                    { servico: 'Instalação de Painel', percent: 6 },
                    { servico: 'Outros', percent: 4 },
                  ].map(item => (
                    <div key={item.servico} className="flex flex-col space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{item.servico}</span>
                        <span className="text-gray-500">{item.percent}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: `${item.percent}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="montadores">
          <Card>
            <CardHeader>
              <CardTitle>Gestão de Montadores (Mock)</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                Esta tela permitiria aprovar/rejeitar montadores pendentes, suspender ativos e gerenciar perfis, 
                integrado com Sanity ou Firebase.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function MapPinIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
