import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './src/sanity-schemas';

export default defineConfig({
  name: 'default',
  title: 'Top Montadores Admin',

  projectId: import.meta.env.VITE_SANITY_PROJECT_ID || 'zs5uy5y6',
  dataset: import.meta.env.VITE_SANITY_DATASET || 'production',

  plugins: [structureTool()],

  schema: {
    types: schemaTypes,
  },
});
