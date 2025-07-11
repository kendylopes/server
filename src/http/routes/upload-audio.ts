import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod';
import { z } from 'zod/v4';

export const uploadAudioRoute: FastifyPluginCallbackZod = (app) => {
  app.post(
    '/rooms/:roomId/audio',
    {
      schema: {
        params: z.object({
          roomId: z.string(),
        })
        
      },
    },
    async (request, reply) => {
      const { roomId } = request.params;
      const audio = await request.file();

      if(!audio){
        throw new Error('Audio is required.');
      }
       
    }
  );
};
