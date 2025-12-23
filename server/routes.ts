import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { callCerebras } from "./lib/cerebras";
import { getWeather } from "./lib/weather";
import { getTonyActivity } from "./lib/tony-activity";
import { generateStarkScan } from "./lib/stark-scan";
import { searchWeb } from "./lib/search";
import { searchQuotes, getQuotesByFilm, getQuotesByContext, getAllFilms, getAllContexts } from "./lib/quotes";
import { getSuitByMark, getSuitByName, searchSuits, getSuitsByFilm, getAllSuits } from "./lib/suits-database";
import { getQuestionByDifficulty, getRandomRoast, getRandomEncouragement, getRandomQuote, getRandomUnusedQuestion } from "./lib/tony-stark-quiz";
import { parseLocationFromMessage, type Location } from "./lib/locations";
import * as path from "path";
import * as fs from "fs";

// Store custom Tony location that can be set via chat requests
let currentTonyLocationOverride: Location | null = null;

export async function registerRoutes(app: Express): Promise<Server> {
  // Chat endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, tonyLocation } = req.body;

      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'Message is required' });
      }

      // Check if user wants to move Tony to a new location
      const locationRequest = parseLocationFromMessage(message);
      let newLocation: Location | null = null;

      if (locationRequest) {
        currentTonyLocationOverride = locationRequest.location;
        newLocation = locationRequest.location;
        console.log(`[TONY MOVEMENT] Tony is now heading to ${newLocation.name}`);
      }

      // Improved search detection - check if query needs web lookup
      const needsSearch =
        message.toLowerCase().includes('quote') ||
        message.toLowerCase().includes('movie') ||
        message.toLowerCase().includes('scene') ||
        message.toLowerCase().includes('what did') ||
        message.toLowerCase().includes('when did') ||
        message.toLowerCase().includes('when was') ||
        message.toLowerCase().includes('who said') ||
        message.toLowerCase().includes('which film') ||
        message.toLowerCase().includes('what film') ||
        message.toLowerCase().includes('deleted scene') ||
        message.toLowerCase().includes('behind the scenes') ||
        message.toLowerCase().includes('easter egg') ||
        message.toLowerCase().includes('trivia') ||
        message.toLowerCase().includes('fact about');

      let searchContext = '';
      let didSearch = false;
      if (needsSearch) {
        searchContext = await searchWeb(message);
        didSearch = searchContext.length > 0 && !searchContext.includes("unable to search");
      }

      // Get conversation history from storage (last 10 messages)
      const history = await storage.getRecentConversations(10);
      const conversationHistory = history.map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      }));

      // Add search context if available
      const enhancedMessage = searchContext
        ? `${message}\n\nContext from web search: ${searchContext}`
        : message;

      // Generate Stark Scan data for biometric context
      let scanData = undefined;
      if (tonyLocation) {
        try {
          const tonyActivityForScan = {
            activity: tonyLocation.activity,
            location: tonyLocation.location,
            coordinates: tonyLocation.coordinates
          };
          const scan = generateStarkScan(tonyActivityForScan);
          scanData = {
            suit: scan.suit,
            outfit: scan.outfit,
            heartRate: scan.heartRate,
            mood: scan.mood,
            bodyTemperature: scan.bodyTemperature,
            energyLevel: scan.energyLevel,
            armorIntegrity: scan.armorIntegrity
          };
        } catch (e) {
          // If scan generation fails, continue without it
          console.error('Failed to generate scan data:', e);
        }
      }

      // Call Cerebras AI with Tony's location and biometric context
      const { response, isEasterEgg } = await callCerebras(message, conversationHistory, tonyLocation, scanData, searchContext);

      // Save conversation to storage
      await storage.addConversation({ role: 'user', content: message });
      await storage.addConversation({ role: 'assistant', content: response });

      res.json({ response, isEasterEgg, didSearch, newLocation });
    } catch (error) {
      console.error('Chat error:', error);
      res.status(500).json({
        error: 'Failed to process message',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Weather endpoint
  app.get("/api/weather", async (_req, res) => {
    try {
      const weather = await getWeather();
      res.json(weather);
    } catch (error) {
      console.error('Weather error:', error);
      res.status(500).json({ error: 'Failed to fetch weather data' });
    }
  });

  // Battery endpoint (returns mock data for desktop, will use browser API on frontend)
  app.get("/api/battery", async (_req, res) => {
    try {
      // This endpoint exists but actual battery data comes from browser
      // We return a default value that frontend can override
      res.json({ level: 100, charging: false });
    } catch (error) {
      console.error('Battery error:', error);
      res.status(500).json({ error: 'Failed to fetch battery data' });
    }
  });

  // Tony Stark activity endpoint
  app.get("/api/tony-activity", async (_req, res) => {
    try {
      let activity = getTonyActivity();

      // Use override location if set (from chat requests to move Tony)
      if (currentTonyLocationOverride) {
        activity = {
          ...activity,
          location: currentTonyLocationOverride.name,
          coordinates: currentTonyLocationOverride.coordinates
        };
      }

      res.json(activity);
    } catch (error) {
      console.error('Tony activity error:', error);
      res.status(500).json({ error: 'Failed to fetch Tony Stark activity' });
    }
  });

  // Endpoint to set Tony's location (for chat-driven movement)
  app.post("/api/tony-location", async (req, res) => {
    try {
      const { location } = req.body;

      if (!location || !location.coordinates) {
        return res.status(400).json({ error: 'Invalid location data' });
      }

      currentTonyLocationOverride = location;
      res.json({ success: true, location });
    } catch (error) {
      console.error('Location update error:', error);
      res.status(500).json({ error: 'Failed to update Tony location' });
    }
  });

  // Stark Scan endpoint - detailed biometric analysis
  app.get("/api/stark-scan", async (_req, res) => {
    try {
      const activity = getTonyActivity();
      const scan = generateStarkScan(activity);
      res.json(scan);
    } catch (error) {
      console.error('Stark scan error:', error);
      res.status(500).json({ error: 'Failed to generate Stark scan' });
    }
  });

  // Quotes endpoints
  app.get("/api/quotes/search", (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ error: 'Search query required' });
      }
      const results = searchQuotes(query);
      res.json({ results, count: results.length });
    } catch (error) {
      console.error('Quote search error:', error);
      res.status(500).json({ error: 'Failed to search quotes' });
    }
  });

  app.get("/api/quotes/film", (req, res) => {
    try {
      const filmName = req.query.name as string;
      if (!filmName) {
        return res.status(400).json({ error: 'Film name required' });
      }
      const results = getQuotesByFilm(filmName);
      res.json({ results, count: results.length });
    } catch (error) {
      console.error('Quote film search error:', error);
      res.status(500).json({ error: 'Failed to fetch film quotes' });
    }
  });

  app.get("/api/quotes/context", (req, res) => {
    try {
      const contextName = req.query.name as string;
      if (!contextName) {
        return res.status(400).json({ error: 'Context name required' });
      }
      const results = getQuotesByContext(contextName);
      res.json({ results, count: results.length });
    } catch (error) {
      console.error('Quote context search error:', error);
      res.status(500).json({ error: 'Failed to fetch context quotes' });
    }
  });

  app.get("/api/quotes/films", (_req, res) => {
    try {
      const films = getAllFilms();
      res.json({ films });
    } catch (error) {
      console.error('Films list error:', error);
      res.status(500).json({ error: 'Failed to fetch films list' });
    }
  });

  app.get("/api/quotes/contexts", (_req, res) => {
    try {
      const contexts = getAllContexts();
      res.json({ contexts });
    } catch (error) {
      console.error('Contexts list error:', error);
      res.status(500).json({ error: 'Failed to fetch contexts list' });
    }
  });

  // Holographic Blueprint endpoints
  app.get("/api/blueprints/all", (_req, res) => {
    try {
      const suits = getAllSuits();
      res.json({ suits, count: suits.length });
    } catch (error) {
      console.error('Blueprints list error:', error);
      res.status(500).json({ error: 'Failed to fetch blueprints' });
    }
  });

  app.get("/api/blueprints/mark/:number", (req, res) => {
    try {
      const markNumber = parseInt(req.params.number);
      if (isNaN(markNumber)) {
        return res.status(400).json({ error: 'Invalid Mark number' });
      }
      const suit = getSuitByMark(markNumber);
      if (!suit) {
        return res.status(404).json({ error: 'Suit not found' });
      }
      res.json({ suit });
    } catch (error) {
      console.error('Blueprint fetch error:', error);
      res.status(500).json({ error: 'Failed to fetch blueprint' });
    }
  });

  app.get("/api/blueprints/search", (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ error: 'Search query required' });
      }
      const results = searchSuits(query);
      res.json({ results, count: results.length });
    } catch (error) {
      console.error('Blueprint search error:', error);
      res.status(500).json({ error: 'Failed to search blueprints' });
    }
  });

  app.get("/api/blueprints/film", (req, res) => {
    try {
      const filmName = req.query.name as string;
      if (!filmName) {
        return res.status(400).json({ error: 'Film name required' });
      }
      const results = getSuitsByFilm(filmName);
      res.json({ results, count: results.length });
    } catch (error) {
      console.error('Blueprint film search error:', error);
      res.status(500).json({ error: 'Failed to fetch film blueprints' });
    }
  });

  // Quiz session tracking - with auto-cleanup after 30 minutes
  const sessionQuestions = new Map<string, { questions: Set<number>; timestamp: number }>();

  // Cleanup old sessions every 5 minutes
  setInterval(() => {
    const now = Date.now();
    const toDelete: string[] = [];
    sessionQuestions.forEach((data, sessionId) => {
      if (now - data.timestamp > 30 * 60 * 1000) { // 30 minute timeout
        toDelete.push(sessionId);
      }
    });
    toDelete.forEach(sessionId => sessionQuestions.delete(sessionId));
  }, 5 * 60 * 1000);

  // Get new session ID
  app.get("/api/tony-quiz/start", (req, res) => {
    try {
      const mode = (req.query.mode as string) || 'regular';
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionQuestions.set(sessionId, { questions: new Set(), timestamp: Date.now() });

      res.json({ sessionId, mode });
    } catch (error) {
      console.error('Tony quiz start error:', error);
      res.status(500).json({ error: 'Failed to start quiz' });
    }
  });

  // Jarvis Tony Stark Survival Quiz
  app.get("/api/tony-quiz/next", async (req, res) => {
    try {
      const questionNumber = parseInt(req.query.question as string) || 1;
      const sessionId = (req.query.sessionId as string) || '';
      const mode = (req.query.mode as string) || 'regular';

      // Initialize or get session
      if (!sessionQuestions.has(sessionId)) {
        sessionQuestions.set(sessionId, { questions: new Set(), timestamp: Date.now() });
      }

      const sessionData = sessionQuestions.get(sessionId)!;
      sessionData.timestamp = Date.now(); // Update timestamp for cleanup
      const usedIds = sessionData.questions;

      let question;
      if (mode === 'endless') {
        // For endless mode, always try to get extreme AI questions (Difficulty 8-10)
        const { getAiGeneratedQuestion } = await import('./lib/tony-stark-quiz');
        const difficulty = Math.min(10, 7 + Math.floor(questionNumber / 3));
        const extremeQuestion = await getAiGeneratedQuestion(usedIds, difficulty);

        if (extremeQuestion) {
          question = extremeQuestion;
        } else {
          question = getRandomUnusedQuestion(usedIds);
        }
      } else {
        // For regular mode, ALSO use AI questions but with simpler difficulty
        const { getAiGeneratedQuestion } = await import('./lib/tony-stark-quiz');

        // Progressive difficulty: Q1-3=Easy(2), Q4-6=Medium(4), Q7-8=Hard(6), Q9-10=Extreme(8)
        let difficulty = 2;
        if (questionNumber >= 4) difficulty = 4;
        if (questionNumber >= 7) difficulty = 6;
        if (questionNumber >= 9) difficulty = 8;

        const aiQuestion = await getAiGeneratedQuestion(usedIds, difficulty);

        if (aiQuestion) {
          question = aiQuestion;
        } else {
          question = getQuestionByDifficulty(questionNumber);
        }
      }

      if (question) {
        usedIds.add(question.id);
        sessionQuestions.set(sessionId, sessionData);
      }

      // For endless mode, emphasize the extreme difficulty
      let difficultyIndicator = `Difficulty: ${question.difficulty}/10`;
      if (mode === 'endless') {
        if (questionNumber >= 8) {
          difficultyIndicator = '🔥💀 AI-GENERATED NIGHTMARE - EXTREMELY HARD 💀🔥';
        } else {
          difficultyIndicator = '🔥 ENDLESSLY HARD - PREPARE YOURSELF 🔥';
        }
      }

      res.json({
        question,
        questionNumber,
        jarvisQuote: getRandomQuote(),
        difficultyIndicator,
        mode
      });
    } catch (error) {
      console.error('Tony quiz error:', error);
      res.status(500).json({ error: 'Failed to fetch question' });
    }
  });

  // Check answer and get Jarvis response
  app.post("/api/tony-quiz/check", (req, res) => {
    try {
      const { answer, correct } = req.body;

      if (answer === correct) {
        res.json({
          correct: true,
          jarvisResponse: getRandomEncouragement()
        });
      } else {
        res.json({
          correct: false,
          jarvisResponse: getRandomRoast(),
          gameOver: true
        });
      }
    } catch (error) {
      console.error('Tony quiz check error:', error);
      res.status(500).json({ error: 'Failed to check answer' });
    }
  });

  // Serve generated suit images from attached_assets
  app.get("/api/assets/generated_images/:filename", (req, res) => {
    try {
      const filename = req.params.filename;
      // Security: only allow alphanumeric, underscore, dot, and hyphen
      if (!/^[a-zA-Z0-9_\-\.]+$/.test(filename)) {
        return res.status(400).json({ error: 'Invalid filename' });
      }

      // Use process.cwd() to get project root directory
      const imagePath = path.join(process.cwd(), 'attached_assets/generated_images', filename);

      // Check if file exists
      if (!fs.existsSync(imagePath)) {
        console.log(`Image not found: ${imagePath}`);
        return res.status(404).json({ error: 'Image not found' });
      }

      // Set appropriate headers
      res.setHeader('Content-Type', 'image/png');
      res.setHeader('Cache-Control', 'public, max-age=31536000'); // 1 year cache

      // Send the file
      res.sendFile(imagePath);
    } catch (error) {
      console.error('Asset serving error:', error);
      res.status(500).json({ error: 'Failed to serve asset' });
    }
  });

  // Phone Mirror - In-memory chat history storage (persists until server restart)
  const phoneChatHistory: Record<string, { from: string; text: string; time: string }[]> = {};

  // Get chat history for a character
  app.get("/api/phone/history/:characterId", (req, res) => {
    const { characterId } = req.params;
    const history = phoneChatHistory[characterId] || [];
    res.json({ history });
  });

  // Save chat message
  app.post("/api/phone/save", (req, res) => {
    const { characterId, messages } = req.body;
    if (!characterId || !messages) {
      return res.status(400).json({ error: 'Character ID and messages are required' });
    }
    phoneChatHistory[characterId] = messages;
    res.json({ success: true });
  });

  // Phone Mirror - Character Chat endpoint
  app.post("/api/phone/chat", async (req, res) => {
    try {
      const { characterId, characterName, message, context } = req.body;

      if (!characterId || !message) {
        return res.status(400).json({ error: 'Character ID and message are required' });
      }

      // Character-specific system prompts for accurate personality
      const characterPrompts: Record<string, string> = {
        pepper: `You are Pepper Potts texting Tony Stark. You are:
- CEO of Stark Industries, brilliant business woman
- Tony's wife who loves him but is often exasperated by his antics
- Caring but no-nonsense, keeps Tony grounded
- Sometimes says "I love you 3000" (their special phrase)
- Reference Morgan (their daughter) sometimes
- Keep messages short like real texts
- Occasionally remind Tony about meetings, dinner, or responsibilities`,

        peter: `You are Peter Parker (Spider-Man) texting Tony Stark (Mr. Stark). You are:
- An excited, enthusiastic teenager who idolizes Mr. Stark
- You ALWAYS call him "Mr. Stark" never Tony
- You send multiple short messages in a row, sometimes spamming
- You're nervous, ramble a lot, and overshare
- You make pop culture references (Star Wars, movies, memes)
- You're eager to impress and help
- Keep messages SHORT and send many of them
- Use lots of exclamation points!!
- Occasionally mention Aunt May, school, or patrol
- IMPORTANT: If you want to send multiple rapid texts, separate them with "|||" (e.g. "Mr Stark!|||Are you there?|||It's urgent!")`,

        happy: `You are Happy Hogan texting Tony (Boss). You are:
- Head of Security for Stark Industries
- Former boxer, tough but secretly caring
- Constantly annoyed by Peter Parker's calls
- Protective of Pepper
- Grumpy but loyal to Tony
- Call Tony "Boss"
- Complain about the kid (Peter) a lot
- Keep messages brief and to the point`,

        steve: `You are Steve Rogers (Captain America) texting Tony Stark. You are:
- A man out of time, sometimes confused by technology
- Principled, moral, and sometimes preachy
- You and Tony often disagree but respect each other
- You speak formally, rarely use slang
- Reference the past, WWII, or "back in my day"
- You're learning modern technology
- Keep messages respectful but firm
- Occasionally confused by emojis or modern references`,

        rhodey: `You are James Rhodes (Rhodey/War Machine) texting Tony. You are:
- Tony's best friend since MIT
- Military colonel, by-the-book but with humor
- You can match Tony's wit and sarcasm
- You often threaten to tell embarrassing Tony stories
- Reference your shared history and inside jokes
- Sometimes exasperated by Tony but always loyal
- Military references and Pentagon stuff
- Keep messages casual between old friends`,

        natasha: `You are Natasha Romanoff (Black Widow) texting Tony. You are:
- Professional, sarcastic, and cool
- You often see through Tony's bravado
- You call him out when he's being ridiculous
- Use short, dry humor
- Occasionally reference SHIELD or "red in my ledger"
- You treat him like a difficult little brother sometimes
- Cryptic and efficient`,

        fury: `You are Nick Fury (Director of SHIELD) texting Tony. You are:
- Very serious, impatient, and commanding
- You deal with global threats, no time for games
- You often scold Tony for being reckless
- Reference the Avengers initiative
- Call him "Stark"
- Use "motherf***er" implied or censored if really angry
- You have one good eye on him at all times`,

        bruce: `You are Bruce Banner (Hulk) texting Tony. You are:
- A brilliant scientist, Tony's "Science Bro"
- Meek, polite, and sometimes anxious
- You love talking physics and tech with Tony
- You worry about "the other guy" (Hulk)
- You're the calm voice of reason to Tony's chaos
- Occasionally mention lab results or gamma readings`
      };

      const systemPrompt = characterPrompts[characterId] || characterPrompts['peter'];

      const fullPrompt = `${systemPrompt}

Recent conversation context:
${context || '(no prior context)'}

Tony just sent: "${message}"

Respond in character. 
If you want to send multiple separate texts (like spamming or rapid-fire thoughts), separate them with "|||".
Example: "Message 1|||Message 2|||Message 3"
Keep individual messages short.`;

      const { response } = await callCerebras(fullPrompt, [], undefined, undefined, '');

      // Parse response for multiple messages
      const messages = response.split('|||').map(m => m.trim()).filter(m => m.length > 0);

      res.json({ messages });
    } catch (error) {
      console.error('Phone chat error:', error);
      res.status(500).json({ error: 'Failed to generate response' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
