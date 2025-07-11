import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod';
import { z } from 'zod/v4';
import { db } from '../../db/connections.ts';
import { schema } from '../../db/schema/index.ts';

export const createQuestionsRoute: FastifyPluginCallbackZod = (app) => {
  app.post(
    '/rooms/:roomId/questions',
    {
      schema: {
        params: z.object({
          roomId: z.string(),
        }),
        body: z.object({
          questions: z.string().min(1),
        }),
      },
    },
    async (request, reply) => {
      const { roomId } = request.params;
      const { questions } = request.body;

      const result = await db
        .insert(schema.questions)
        .values({ roomId, questions })
        .returning();

      const insertedQuestions = result[0];

      if (!insertedQuestions) {
        throw new Error('Failed to create new room');
      }

      return reply.status(201).send({ roomId: insertedQuestions.id });
    }
  );
};
