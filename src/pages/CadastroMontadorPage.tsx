import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { sanityClient } from '@/lib/sanity';

const formSchema = z.object({
  firstName: z.string().min(2, 'Nome é obrigatório'),
  lastName: z.string().min(2, 'Sobrenome é obrigatório'),
  whatsapp: z.string().min(10, 'WhatsApp é obrigatório'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  document: z.string().min(11, 'CPF/CNPJ é obrigatório'),
  cep: z.string().min(8, 'CEP é obrigatório'),
  state: z.string().min(2),
  city: z.string().min(2),
  neighborhood: z.string().min(2),
  street: z.string().min(2),
  services: z.array(z.string()).min(1, 'Selecione pelo menos um serviço'),
});

export default function CadastroMontadorPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [servicesList, setServicesList] = useState<{_id: string, name: string}[]>([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await sanityClient.fetch(`*[_type == "service" && active == true]{_id, name}`);
        setServicesList(data);
      } catch (error) {
        console.error("Failed to fetch services for form:", error);
      }
    };
    fetchServices();
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      whatsapp: '',
      email: '',
      document: '',
      cep: '',
      state: '',
      city: '',
      neighborhood: '',
      street: '',
      services: [],
    },
  });

  const checkCEP = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const cep = e.target.value.replace(/\D/g, '');
    if (cep.length === 8) {
      try {
        const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await res.json();
        if (!data.erro) {
          form.setValue('state', data.uf);
          form.setValue('city', data.localidade);
          form.setValue('neighborhood', data.bairro);
          form.setValue('street', data.logradouro);
        } else {
          toast.error('CEP não encontrado');
        }
      } catch (err) {
        toast.error('Erro ao buscar CEP');
      }
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      // Create a sanity document
      await sanityClient.create({
        _type: 'montador',
        firstName: values.firstName,
        lastName: values.lastName,
        whatsapp: values.whatsapp,
        email: values.email,
        document: values.document,
        cep: values.cep,
        estado: values.state,
        cidade: values.city,
        neighborhood: values.neighborhood,
        street: values.street,
        status: 'PENDENTE',
        servicos: values.services.map(id => ({
          _type: 'reference',
          _ref: id
        })),
        slug: {
          _type: 'slug',
          current: `${values.firstName}-${values.lastName}-${values.city}`.toLowerCase().replace(/\s+/g, '-')
        }
      });
      
      setIsSuccess(true);
      toast.success('Cadastro enviado com sucesso!');
    } catch (error) {
      console.error(error);
      toast.error('Ocorreu um erro ao enviar seu cadastro. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-4">
        <Card className="text-center py-12 border-none shadow-xl bg-white/50 backdrop-blur">
          <CardContent>
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Obrigado pelo cadastro!</h2>
            <p className="text-lg text-gray-600">Nossa equipe fará a validação dos seus dados e entraremos em contato em breve.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-primary text-white rounded-t-xl pb-8">
          <CardTitle className="text-2xl">Cadastro de Montador</CardTitle>
          <CardDescription className="text-white/80">
            Junte-se a melhor plataforma de montadores do Brasil.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-8">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName">Nome</Label>
                <Input id="firstName" {...form.register('firstName')} />
                {form.formState.errors.firstName && <p className="text-sm text-red-500">{form.formState.errors.firstName.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Sobrenome</Label>
                <Input id="lastName" {...form.register('lastName')} />
                {form.formState.errors.lastName && <p className="text-sm text-red-500">{form.formState.errors.lastName.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp</Label>
                <Input id="whatsapp" placeholder="(11) 99999-9999" {...form.register('whatsapp')} />
                {form.formState.errors.whatsapp && <p className="text-sm text-red-500">{form.formState.errors.whatsapp.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail (Opcional)</Label>
                <Input id="email" type="email" {...form.register('email')} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="document">CPF ou CNPJ</Label>
                <Input id="document" {...form.register('document')} />
                {form.formState.errors.document && <p className="text-sm text-red-500">{form.formState.errors.document.message}</p>}
              </div>
            </div>

            <div className="pt-6 border-t">
              <h3 className="text-lg font-semibold mb-4">Endereço</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="cep">CEP</Label>
                  <Input id="cep" {...form.register('cep')} onChange={(e) => {
                    form.register('cep').onChange(e);
                    checkCEP(e);
                  }} />
                  {form.formState.errors.cep && <p className="text-sm text-red-500">{form.formState.errors.cep.message}</p>}
                </div>
                <div className="space-y-2 hidden md:block"></div>
                
                <div className="space-y-2">
                  <Label htmlFor="state">Estado</Label>
                  <Input id="state" {...form.register('state')} readOnly className="bg-gray-50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">Cidade</Label>
                  <Input id="city" {...form.register('city')} readOnly className="bg-gray-50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="neighborhood">Bairro</Label>
                  <Input id="neighborhood" {...form.register('neighborhood')} readOnly className="bg-gray-50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="street">Rua</Label>
                  <Input id="street" {...form.register('street')} readOnly className="bg-gray-50" />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t">
              <h3 className="text-lg font-semibold mb-4">Serviços Atendidos</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {servicesList.map((service) => (
                  <div key={service._id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={service._id} 
                      onCheckedChange={(checked) => {
                        const current = form.getValues('services');
                        const updated = checked 
                          ? [...current, service._id] 
                          : current.filter(id => id !== service._id);
                        form.setValue('services', updated, { shouldValidate: true });
                      }}
                    />
                    <label htmlFor={service._id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      {service.name}
                    </label>
                  </div>
                ))}
              </div>
              {form.formState.errors.services && <p className="text-sm text-red-500 mt-2">{form.formState.errors.services.message}</p>}
            </div>

            <Button type="submit" className="w-full h-12 text-lg" disabled={isSubmitting}>
              {isSubmitting ? 'Enviando...' : 'Finalizar Cadastro'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
