export async function searchWeb(query: string): Promise<string> {
  const apiKey = process.env.TAVILY_API_KEY;
  
  if (!apiKey) {
    // Return a fallback response if no API key
    return "I'm unable to search the web at the moment, but I can assist you with my existing knowledge of the MCU and Iron Man.";
  }

  try {
    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        api_key: apiKey,
        query: `Iron Man MCU ${query}`,
        max_results: 3,
        include_answer: true
      })
    });

    if (!response.ok) {
      throw new Error('Search API error');
    }

    const data = await response.json();
    
    if (data.answer) {
      return data.answer;
    }

    if (data.results && data.results.length > 0) {
      return data.results[0].content;
    }

    return "I couldn't find specific information about that, but I'm happy to help with what I know.";
  } catch (error) {
    console.error('Search API error:', error);
    return "I'm unable to search the web at the moment.";
  }
}
