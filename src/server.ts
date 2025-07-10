import { fastifyCors } from '@fastify/cors';
import { fastify } from 'fastify';
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod';
import { env } from './env.ts';
import { createQuestionsRoute } from './http/routes/create-questions.ts';
import { createRoomsRoute } from './http/routes/create-rooms.ts';
import { getRoomsRoute } from './http/routes/get-rooms.ts';
import { getRoomsQuestions } from './http/routes/get-rooms-questions.ts';

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.register(fastifyCors, {
  origin: 'http://localhost:5173',
});

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

app.get('/health', () => {
  return 'ok';
});

app.register(getRoomsRoute);
app.register(createRoomsRoute);
app.register(getRoomsQuestions);
app.register(createQuestionsRoute);

app.listen({ port: env.PORT });
