export default {
  name: 'montador',
  title: 'Montador',
  type: 'document',
  fields: [
    {
      name: 'firstName',
      title: 'First Name',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'lastName',
      title: 'Last Name',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: (doc: any) => `${doc.firstName}-${doc.lastName}-${doc.cidade}`,
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'whatsapp',
      title: 'WhatsApp',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (Rule: any) => Rule.email(),
    },
    {
      name: 'document',
      title: 'CPF/CNPJ',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'cep',
      title: 'CEP',
      type: 'string',
    },
    {
      name: 'estado',
      title: 'Estado (UF)',
      type: 'string',
      validation: (Rule: any) => Rule.required().min(2).max(2).uppercase(),
    },
    {
      name: 'cidade',
      title: 'Cidade',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'neighborhood',
      title: 'Bairro',
      type: 'string',
    },
    {
      name: 'street',
      title: 'Rua',
      type: 'string',
    },
    {
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Ativo', value: 'ATIVO' },
          { title: 'Inativo', value: 'INATIVO' },
          { title: 'Pendente', value: 'PENDENTE' },
        ],
      },
      initialValue: 'PENDENTE',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'servicos',
      title: 'Serviços Atendidos',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'service' }] }],
      validation: (Rule: any) => Rule.required().min(1),
    },
    {
      name: 'avaliacao',
      title: 'Avaliação Média',
      type: 'number',
      initialValue: 5.0,
    },
    {
      name: 'numeroAvaliacoes',
      title: 'Número de Avaliações',
      type: 'number',
      initialValue: 0,
    },
    {
      name: 'horarios',
      title: 'Horários de Atendimento',
      type: 'string',
      initialValue: 'Segunda a Sábado, 08:00 às 18:00',
    },
    {
      name: 'foto',
      title: 'Foto de Perfil',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'galeria',
      title: 'Galeria de Trabalhos',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    },
  ],
  preview: {
    select: {
      title: 'firstName',
      subtitle: 'lastName',
      media: 'foto',
    },
    prepare(selection: any) {
      const { title, subtitle, media } = selection;
      return {
        title: `${title} ${subtitle}`,
        media,
      };
    },
  },
};
