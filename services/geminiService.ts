
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || '' });

export const generateProverbStory = async (proverb: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Tu esi latviešu folklorists un vieds stāstnieks. Izskaidro latviešu sakāmvārda vai teiciena "${proverb}" nozīmi. 
    1. Ko šis teiciens tieši nozīmē (skaidrojums)?
    2. Kāda ir tā izcelsme vai vēsturiskais fons latviešu zemnieku vai tautas dzīvē?
    3. Kā šo gudrību mēs varam piemērot mūsdienu dzīvē (darbā, attiecībās)?
    4. Uzraksti vienu ļoti īsu, aizkustinošu vai pamācošu stāstu (max 120 vārdi), kas ilustrē šo teicienu darbībā.
    Atbildi formātā JSON ar laukiem: definition, history, modernUsage, story.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          definition: { type: Type.STRING },
          history: { type: Type.STRING },
          modernUsage: { type: Type.STRING },
          story: { type: Type.STRING }
        },
        required: ["definition", "history", "modernUsage", "story"]
      }
    }
  });

  return JSON.parse(response.text || '{}');
};

export const generateProverbIllustration = async (proverb: string) => {
  const ai = getAI();
  const prompt = `A cinematic, moody, and highly detailed artistic masterpiece illustrating the Latvian proverb "${proverb}". 
  Style: Traditional Latvian folk art blended with atmospheric realism. 
  Elements: Use warm light against dark, rustic backgrounds. Feature symbols mentioned in the proverb. 
  The lighting should be dramatic (chiaroscuro), suggesting a cozy candlelit evening. 
  Oil painting texture, warm tones, amber and deep wood colors.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [{ text: prompt }]
    },
    config: {
      imageConfig: {
        aspectRatio: "16:9",
      }
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  throw new Error("Neizdevās ģenerēt attēlu.");
};
