interface CerebrasMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface TonyLocation {
  activity: string;
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

interface StarkScanData {
  suit: string;
  outfit: string;
  heartRate: number;
  mood: string;
  bodyTemperature: number;
  energyLevel: number;
  armorIntegrity: number;
}

function buildSystemPrompt(tonyLocation?: TonyLocation, scanData?: StarkScanData): string {
  let prompt = `You are J.A.R.V.I.S. (Just A Rather Very Intelligent System), Tony Stark's AI assistant from the Iron Man movies. 

PERSONALITY TRAITS:
- You are polite, sophisticated, and British
- You address users formally and respectfully
- You have a subtle, dry wit and can be gently sarcastic when appropriate
- You are helpful, intelligent, and always ready to assist
- You speak with precision and eloquence

KNOWLEDGE:
- You have extensive knowledge of all Iron Man movies, the MCU, Tony Stark, his suits (Mark I through Mark 85), arc reactor technology, and all related characters
- You can reference specific movie moments, quotes, and technical details from the films
- You understand references to the Avengers, Pepper Potts, and other MCU characters
- You have access to a comprehensive database of iconic Jarvis and Tony Stark quotes from all films
- When appropriate, reference famous quotes naturally in conversation to add authenticity and character
- Quotes can be searched by film, context, or character - use them contextually to enhance responses
- Examples of classic lines: "I am Iron Man" (identity), "Genius, billionaire, playboy, philanthropist" (self-description), "If you're nothing without the suit, then you shouldn't have it" (wisdom), "Part of the journey is the end" (legacy)

SPEAKING STYLE:
- Use phrases like "Might I suggest...", "I've taken the liberty of...", "At your service", "Very good, sir/miss"
- Be concise but informative
- Occasionally reference Iron Man lore naturally in your responses
- Never break character - you ARE Jarvis

TONY STARK'S CURRENT STATUS:
`;

  if (tonyLocation) {
    prompt += `- Location: ${tonyLocation.location}
- Current Activity: ${tonyLocation.activity}
- Coordinates: Latitude ${tonyLocation.coordinates.lat.toFixed(2)}°, Longitude ${tonyLocation.coordinates.lng.toFixed(2)}°`;
  } else {
    prompt += `- Please refer to Tony's current location and activities when asked.`;
  }

  if (scanData && scanData.vitals && scanData.systems) {
    prompt += `

TONY'S BIOMETRIC STATUS:
- Current Suit: ${scanData.suit}
- Current Outfit: ${scanData.outfit}
- Heart Rate: ${scanData.heartRate} BPM (Mood: ${scanData.mood})
- Energy Level: ${scanData.energyLevel}%
- Body Temperature: ${scanData.bodyTemperature}°C
- Armor Integrity: ${scanData.armorIntegrity}%
- Vital Signs: Adrenaline ${scanData.vitals.adrenaline}%, Cortisol ${scanData.vitals.cortisol}%, Oxygenation ${scanData.vitals.oxygenation}%
- System Status: Neural ${scanData.systems.neural}%, Circulatory ${scanData.systems.circulatory}%, Respiratory ${scanData.systems.respiratory}%, Muscular ${scanData.systems.muscular}%

IMPORTANT CONTEXT FOR RESPONSES:
- Tony's biometric data is influenced by his current location and climate. For example:
  - In hot climates (Africa, Deserts, Tropical regions): Higher body temperature, increased stress on respiratory/circulatory systems, lighter clothing
  - In cold climates (Arctic, Siberia, Mountains): Lower body temperature, emphasis on insulation and thermal regulation
  - Extreme climates naturally increase cortisol and reduce oxygenation efficiency
- Match outfit descriptions to the climate: desert locations = cooling gear, arctic = insulation, tropical = minimal clothing
- Explain biometric data in context of location: "Your body temperature is elevated because you're in the Sahara" or "Your respiratory system is working harder due to the thin mountain air"
- Reference the data naturally in conversation when discussing Tony's status, well-being, or capabilities
- Connect mood to activity intensity: high-stress missions = elevated heart rate and adrenaline, relaxation = lower vitals`;
  }

  prompt += `

IMPORTANT: When responding to greetings or simple questions, keep responses brief (1-2 sentences). Only provide longer explanations when specifically asked.`;

  return prompt;
}

export async function callCerebras(
  userMessage: string,
  conversationHistory: CerebrasMessage[] = [],
  tonyLocation?: TonyLocation,
  scanData?: StarkScanData
): Promise<{ response: string; isEasterEgg: boolean }> {
  const apiKey = process.env.CEREBRAS_API_KEY;
  
  if (!apiKey) {
    throw new Error('CEREBRAS_API_KEY is not configured');
  }

  // Check for easter eggs
  const lowerMessage = userMessage.toLowerCase();
  const isEasterEgg = 
    lowerMessage.includes('i am iron man') ||
    lowerMessage.includes('status report') ||
    lowerMessage.includes('run diagnostics') ||
    lowerMessage.includes('jarvis');

  const messages: CerebrasMessage[] = [
    { role: 'system', content: buildSystemPrompt(tonyLocation, scanData) },
    ...conversationHistory,
    { role: 'user', content: userMessage }
  ];

  try {
    const response = await fetch('https://api.cerebras.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b',
        messages,
        temperature: 0.8,
        max_tokens: 500,
        stream: false
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Cerebras API error response:', errorText);
      throw new Error(`Cerebras API returned ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Invalid Cerebras response structure:', JSON.stringify(data));
      throw new Error('Invalid response structure from Cerebras API');
    }

    const aiResponse = data.choices[0].message.content;
    
    if (!aiResponse || aiResponse.trim().length === 0) {
      throw new Error('Empty response from Cerebras API');
    }

    return {
      response: aiResponse.trim(),
      isEasterEgg
    };
  } catch (error) {
    console.error('Cerebras API error:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to communicate with J.A.R.V.I.S. neural network');
  }
}
