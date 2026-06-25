import { createClient } from '@sanity/client';

export const sanityClient = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID || 'zs5uy5y6',
  dataset: import.meta.env.VITE_SANITY_DATASET || 'production',
  useCdn: false, // set to false since we need fresh data
  apiVersion: '2023-05-03', // use current date (YYYY-MM-DD) to target the latest API version
  token: import.meta.env.VITE_SANITY_API_TOKEN || 'sklybDIWKyMPasuzOLGqPY9moJbleJU1kT0N0cMvh5JJkFbn3qGVf7L3xI5FJ5SgCo40DrtYJDZZgxLx0NYuLHiFx4zQFxNAwAny6nLzZBT2WrNLllVMztfZusanGnwbueelBu5W3xz1tt6te1PHQ7rwWrdffTRNa04HJhOIXhHPBKEZwmnE',
});
