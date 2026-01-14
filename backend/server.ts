
// Fix: Import process from 'process' to ensure the Node.js process object is correctly typed, 
// preventing collisions with potential global Process interfaces that lack the 'exit' method.
import process from 'process';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import websocket from '@fastify/websocket';
import { routes } from './routes';

const server = Fastify({ logger: true });

async function bootstrap() {
  await server.register(cors);
  await server.register(websocket);
  await server.register(routes, { prefix: '/api/v1' });

  try {
    const port = process.env.PORT ? parseInt(process.env.PORT) : 3001;
    await server.listen({ port, host: '0.0.0.0' });
    console.log(`🚀 TrackCodex Backend operational on port ${port}`);
  } catch (err) {
    server.log.error(err);
    // Fix: Using process.exit() from the explicitly imported process module
    process.exit(1);
  }
}

bootstrap();