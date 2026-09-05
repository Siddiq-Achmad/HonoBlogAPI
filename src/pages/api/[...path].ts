import type { APIRoute } from 'astro';
import { app } from '../../index.js';

export const ALL: APIRoute = async ({ request }) => {
  return await app.fetch(request);
};
