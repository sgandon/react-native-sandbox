import { createOpenAI } from '@ai-sdk/openai';
import { streamObject } from 'ai';
import { z } from 'zod';

// Zod schema for patient extraction
export const PatientSchema = z.object({
  firstname: z.string().optional(),
  lastname: z.string(),
  male: z.boolean(),
});

const openai = createOpenAI({
  // custom settings, e.g.
  apiKey: process.env.OPENAI_API_KEY || process.env.EXPO_PUBLIC_OPENAI_API_KEY,
});

//const PatientsArraySchema = z.array(PatientSchema);


const payload = `[
  {
    "id": 470788,
    "first_name": "Mildred",
    "last_name": "Hudson",
    "email": "mhudson0@last.fm",
    "job_title": "Staff Accountant III",
    "company": "Kazio",
    "city": "IporÃ£",
    "date": 42004
  },
  {
    "id": 857729,
    "first_name": "WALTER",
    "last_name": "MYERS",
    "email": "wmyers1@spiegel.de",
    "job_title": "Research Assistant II",
    "company": "Gabcube",
    "city": "Aibura",
    "date": "5/25/2015"
  },
  {
    "id": 529929,
    "first_name": "Eugene",
    "last_name": "Cook",
    "email": "ecook2@yelp.com",
    "job_title": "Structural Engineer",
    "company": "Gigabox",
    "city": "Jinqu",
    "date": "10-13-2015"
  },
  {
    "id": 269130,
    "first_name": "Pamela",
    "last_name": "Owens",
    "email": "powens3@goo.ne.jp",
    "job_title": "Structural Engineer",
    "company": "Leenti",
    "city": "Changmaoling",
    "date": "5/25/2015"
  },
  {
    "id": 357099,
    "last_name": "Thompson",
    "date": "1/29/2015"
  }
]`

export async function POST(req: Request) {
  console.log('=== API ROUTE START ===');
  console.log('Request method:', req.method);
  console.log('Request URL:', req.url);
  
  try {
    console.log('Parsing request body...');
    const bodyText = await req.text();
    
    console.log('received this text from the body:', bodyText);


    // Check if OpenAI API key is available
    const apiKey = process.env.OPENAI_API_KEY || process.env.EXPO_PUBLIC_OPENAI_API_KEY;
    console.log('API key exists:', !!apiKey);
    console.log('API key length:', apiKey?.length || 0);
    
    if (!apiKey) {
      console.error('OpenAI API key not found');
      return new Response('OpenAI API key not configured', { status: 500 });
    }

    // Create the prompt on the server side
    console.log('Creating prompt...');
    const prompt = `Tu es un assistant IA spécialisé dans l'extraction de données de patients à partir de fichiers Excel.

Analyse les données suivantes et extrait les informations des patients. IMPORTANT: La première ligne peut être une ligne d'en-têtes ou peut contenir des données de patient - tu dois analyser et déterminer cela automatiquement.

Données du fichier (premières lignes): ${payload}

Instructions:
- Détermine automatiquement si la première ligne contient des en-têtes ou des données de patient
- Extrait uniquement les patients valides (avec au moins un nom de famille)
- Pour le champ 'firstname': utilise le prénom du patient (optionnel)
- Pour le champ 'lastname': utilise le nom de famille du patient (obligatoire)
- Pour le champ 'male': true si le patient est masculin, false si féminin
- Ignore les lignes vides, les en-têtes, ou toute ligne non pertinente
- Assure-toi que chaque patient a au moins un lastname non vide
- Sois flexible dans l'identification des colonnes (prénom, nom, sexe/genre peuvent être dans n'importe quelle colonne)
- Si tu ne trouves pas de patient valide, retourne un tableau vide

Retourne un tableau d'objets patients en analysant TOUTES les lignes du fichier.`;

    console.log('Prompt length:', prompt.length);
    console.log('Prompt preview (first 200 chars):', prompt);

    console.log('Calling streamObject...');
    const result = streamObject({
      model: openai('gpt-4o-mini'),
      output: 'array',
      schema: PatientSchema,
      prompt: prompt,
      experimental_telemetry: {
        isEnabled: true,
      },
      onError: (error) => {
        console.error('Error:', error);
      },
    });

    //reading the stream of patients
    // console.log('reading the stream of patients');
    // for await (const patient of elementStream) {
    //   console.log(patient);
    // }

    // console.log('streamObject result created, returning response...');
    // const response = result.toTextStreamResponse({
    //   headers: {
    //     'Content-Type': 'text/plain; charset=utf-8',
    //   },
    // });
    
    console.log('=== API ROUTE SUCCESS ===');
    return result.toTextStreamResponse();
    
  } catch (error) {
    console.error('=== API ROUTE ERROR ===');
    console.error('Error type:', typeof error);
    console.error('Error constructor:', error?.constructor?.name);
    console.error('Error message:', error instanceof Error ? error.message : 'Unknown error');
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack');
    
    return new Response(`Internal Server Error: ${error instanceof Error ? error.message : 'Unknown error'}`, { status: 500 });
  }
}
