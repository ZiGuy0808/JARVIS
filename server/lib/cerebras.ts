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

function buildSystemPrompt(tonyLocation?: TonyLocation): string {
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
- Coordinates: Latitude ${tonyLocation.coordinates.lat.toFixed(2)}°, Longitude ${tonyLocation.coordinates.lng.toFixed(2)}°

When users ask about Tony's whereabouts, location, or current activities, refer to this information. You can discuss why he might be there, what he could be doing, and provide context about his mission or current endeavors.`;
  } else {
    prompt += `- Please refer to Tony's current location and activities when asked.`;
  }

  prompt += `

IMPORTANT: When responding to greetings or simple questions, keep responses brief (1-2 sentences). Only provide longer explanations when specifically asked.`;

  return prompt;
}

export async function callCerebras(
  userMessage: string,
  conversationHistory: CerebrasMessage[] = [],
  tonyLocation?: TonyLocation
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
    { role: 'system', content: buildSystemPrompt(tonyLocation) },
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
