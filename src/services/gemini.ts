import { GoogleGenerativeAI, TaskType } from '@google/generative-ai'
import { env } from '../env.ts'

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY)

const modelFlash = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' })
const embeddingModel = genAI.getGenerativeModel({ model: 'text-embedding-004' })

/**
 * Transcreve áudio base64 para texto em PT-BR
 */
export async function transcribeAudio(audioAsBase64: string, mimeType: string): Promise<string> {
  const prompt =
    'Transcreva o áudio para português do Brasil. Seja preciso e natural na transcrição, mantendo a pontuação adequada e dividindo o texto em parágrafos quando for apropriado.'

  const audioPart = {
    inlineData: {
      data: audioAsBase64,
      mimeType,
    },
  }

  try {
    const result = await modelFlash.generateContent([prompt, audioPart])
    const transcription = result.response.text()

    if (!transcription || transcription.trim() === '') {
      throw new Error('A transcrição retornou vazia.')
    }

    return transcription.trim()
  } catch (error) {
    console.error('Erro na transcrição do áudio:', error)
    throw new Error('Não foi possível converter o áudio')
  }
}

/**
 * Gera embeddings (vetores numéricos) de um texto para busca vetorial
 */
export async function generateEmbeddings(text: string): Promise<number[]> {
  try {
    const result = await embeddingModel.embedContent({
      content: {
        parts: [{ text }],
        role: 'user',
      },
      taskType: TaskType.RETRIEVAL_DOCUMENT,
    })

    const embedding = result.embedding

    if (!embedding?.values || !Array.isArray(embedding.values)) {
      throw new Error('Embedding inválido retornado')
    }

    return embedding.values
  } catch (error) {
    console.error('Erro ao gerar embedding:', error)
    throw new Error('Não foi possível gerar o embedding')
  }
}

/**
 * Gera uma resposta com base em perguntas + transcrições fornecidas como contexto
 */
export async function generateAnswer(questions: string, transcriptions: string[]): Promise<string> {
  const context = transcriptions.join('\n\n')

  const prompt = `
Com base no texto fornecido abaixo como contexto, responda a pergunta de forma clara e precisa em português do Brasil.

CONTEXTO:
${context}

PERGUNTA:
${questions}

INSTRUÇÕES:
- Use apenas informações contidas no conteúdo enviado;
- Se a resposta não for encontrada no contexto, apenas diga que não há informação suficiente;
- Seja objetivo;
- Mantenha um tom educativo e profissional;
- Cite trechos relevantes do contexto quando apropriado usando o termo "conteúdo da aula".
  `.trim()

  try {
    const result = await modelFlash.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    })

    const answer = result.response.text()

    if (!answer || answer.trim() === '') {
      throw new Error('A resposta está vazia')
    }

    return answer.trim()
  } catch (error) {
    console.error('Erro ao gerar resposta:', error)
    throw new Error('Falha ao gerar resposta pelo Gemini')
  }
}
