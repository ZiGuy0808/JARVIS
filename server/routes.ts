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

export async function registerRoutes(app: Express): Promise<Server> {
  // Chat endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, tonyLocation } = req.body;

      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'Message is required' });
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

      res.json({ response, isEasterEgg, didSearch });
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
      const activity = getTonyActivity();
      res.json(activity);
    } catch (error) {
      console.error('Tony activity error:', error);
      res.status(500).json({ error: 'Failed to fetch Tony Stark activity' });
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

  // Quiz session tracking
  const sessionQuestions = new Map<string, Set<number>>();

  // Get new session ID
  app.get("/api/tony-quiz/start", (req, res) => {
    try {
      const mode = (req.query.mode as string) || 'regular';
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionQuestions.set(sessionId, new Set());
      
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

      const usedIds = sessionQuestions.get(sessionId) || new Set();
      
      let question;
      if (mode === 'endless') {
        // For endless mode after 10 questions, occasionally use web-searched extreme questions
        if (questionNumber >= 10) {
          const { getExtremeWebSearchQuestion } = await import('./lib/tony-stark-quiz');
          const webQuestion = await getExtremeWebSearchQuestion(usedIds, questionNumber);
          if (webQuestion) {
            question = webQuestion;
          } else {
            question = getRandomUnusedQuestion(usedIds);
          }
        } else {
          question = getRandomUnusedQuestion(usedIds);
        }
      } else {
        // For regular mode, use progressive difficulty
        question = getQuestionByDifficulty(questionNumber);
      }
      
      if (question) {
        usedIds.add(question.id);
        sessionQuestions.set(sessionId, usedIds);
      }
      
      // For endless mode, emphasize the extreme difficulty
      let difficultyIndicator = `Difficulty: ${question.difficulty}/10`;
      if (mode === 'endless') {
        if (questionNumber >= 10) {
          difficultyIndicator = '🔥💀 EXTREME MODE - WEB-SEARCHED NIGHTMARES 💀🔥';
        } else {
          difficultyIndicator = '🔥 EXTREMELY HARD MODE - NO MERCY 🔥';
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

  const httpServer = createServer(app);

  return httpServer;
}
