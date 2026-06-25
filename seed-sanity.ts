import { createClient } from '@sanity/client';

const sanityClient = createClient({
  projectId: 'zs5uy5y6',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
  token: 'sklybDIWKyMPasuzOLGqPY9moJbleJU1kT0N0cMvh5JJkFbn3qGVf7L3xI5FJ5SgCo40DrtYJDZZgxLx0NYuLHiFx4zQFxNAwAny6nLzZBT2WrNLllVMztfZusanGnwbueelBu5W3xz1tt6te1PHQ7rwWrdffTRNa04HJhOIXhHPBKEZwmnE',
});

async function seed() {
  console.log('Seeding Sanity with initial data...');

  try {
    // 1. Create Services
    const services = [
      {
        _type: 'service',
        name: 'Montagem de Móveis',
        slug: { _type: 'slug', current: 'montagem-de-moveis' },
        active: true,
      },
      {
        _type: 'service',
        name: 'Instalação de TV',
        slug: { _type: 'slug', current: 'instalacao-de-tv' },
        active: true,
      },
      {
        _type: 'service',
        name: 'Instalação de Painel',
        slug: { _type: 'slug', current: 'instalacao-de-painel' },
        active: true,
      },
      {
        _type: 'service',
        name: 'Instalação de Cortinas',
        slug: { _type: 'slug', current: 'instalacao-de-cortinas' },
        active: true,
      },
      {
        _type: 'service',
        name: 'Montagem Corporativa',
        slug: { _type: 'slug', current: 'montagem-corporativa' },
        active: true,
      },
    ];

    const createdServices = [];
    for (const service of services) {
      console.log(`Creating service: ${service.name}`);
      const created = await sanityClient.create(service);
      createdServices.push(created);
    }

    // 2. Create Montadores
    const montadores = [
      {
        _type: 'montador',
        firstName: 'João',
        lastName: 'Silva',
        slug: { _type: 'slug', current: 'joao-silva-campinas' },
        cidade: 'Campinas',
        estado: 'SP',
        whatsapp: '5511999999999',
        email: 'joao@example.com',
        document: '12345678909',
        status: 'ATIVO',
        avaliacao: 4.8,
        numeroAvaliacoes: 42,
        horarios: 'Segunda a Sábado, 08:00 às 18:00',
        servicos: [
          { _type: 'reference', _ref: createdServices[0]._id }, // Montagem de Móveis
          { _type: 'reference', _ref: createdServices[1]._id }, // Instalação de TV
        ]
      },
      {
        _type: 'montador',
        firstName: 'Carlos',
        lastName: 'Santos',
        slug: { _type: 'slug', current: 'carlos-santos-sao-paulo' },
        cidade: 'São Paulo',
        estado: 'SP',
        whatsapp: '5511988888888',
        email: 'carlos@example.com',
        document: '09876543212',
        status: 'ATIVO',
        avaliacao: 5.0,
        numeroAvaliacoes: 120,
        horarios: 'Segunda a Sexta, 09:00 às 19:00',
        servicos: [
          { _type: 'reference', _ref: createdServices[4]._id }, // Montagem Corporativa
          { _type: 'reference', _ref: createdServices[0]._id }, // Montagem de Móveis
        ]
      },
      {
        _type: 'montador',
        firstName: 'Pedro',
        lastName: 'Oliveira',
        slug: { _type: 'slug', current: 'pedro-oliveira-belo-horizonte' },
        cidade: 'Belo Horizonte',
        estado: 'MG',
        whatsapp: '5531977777777',
        email: 'pedro@example.com',
        document: '45612378900',
        status: 'ATIVO',
        avaliacao: 4.5,
        numeroAvaliacoes: 15,
        horarios: 'Segunda a Sábado, 08:00 às 17:00',
        servicos: [
          { _type: 'reference', _ref: createdServices[0]._id }, // Montagem de Móveis
          { _type: 'reference', _ref: createdServices[3]._id }, // Instalação de Cortinas
        ]
      }
    ];

    for (const montador of montadores) {
      console.log(`Creating montador: ${montador.firstName} ${montador.lastName}`);
      await sanityClient.create(montador);
    }

    console.log('Successfully seeded Sanity data!');
  } catch (error) {
    console.error('Error seeding data:', error);
  }
}

seed();
