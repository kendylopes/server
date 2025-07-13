import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod';
import { z } from 'zod/v4';
import { db } from '../../db/connections.ts';
import { schema } from '../../db/schema/index.ts';
import { generateAnswer, generateEmbeddings } from '../../services/gemini.ts';
import { and, eq, sql } from 'drizzle-orm';

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

      const embeddings = await generateEmbeddings(questions)

      const embeddingAsString = `[${embeddings.join(',')}]`

      const chunks = await db
      .select({
        id:schema.audioChunks.id,
        transcription: schema.audioChunks.transcription,
        similarity: sql<number>`1-(${schema.audioChunks.embeddings} <=> ${embeddingAsString}::vector)`,
      })
      .from(schema.audioChunks)
      .where(
        and(
          eq(schema.audioChunks.roomId, roomId),
          sql`1-(${schema.audioChunks.embeddings} <=> ${embeddingAsString}::vector) > 0.1`
        )
      )
      .orderBy(sql`${schema.audioChunks.embeddings} <=> ${embeddingAsString}::vector`)  
      .limit(3)

      let answer: string | null = null

      if(chunks.length>0){
        const transcriptions = chunks.map(chunk=>chunk.transcription)    

        answer = await generateAnswer(questions, transcriptions)
      }

      const result = await db
        .insert(schema.questions)
        .values({ roomId, questions, answer })
        .returning();

      const insertedQuestions = result[0];

      if (!insertedQuestions) {
        throw new Error('Failed to create new room');
      }

      return reply.status(201).send({
        questionId: insertedQuestions.id,
        answer,
      });
    }
  );
};
