import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { callCerebras } from "./lib/cerebras";
import { getWeather } from "./lib/weather";
import { getTonyActivity } from "./lib/tony-activity";
import { searchWeb } from "./lib/search";

export async function registerRoutes(app: Express): Promise<Server> {
  // Chat endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const { message } = req.body;

      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'Message is required' });
      }

      // Check if we need to search the web for MCU references
      const needsSearch = 
        message.toLowerCase().includes('quote') ||
        message.toLowerCase().includes('movie') ||
        message.toLowerCase().includes('scene') ||
        message.toLowerCase().includes('what did') ||
        message.toLowerCase().includes('when did');

      let searchContext = '';
      if (needsSearch) {
        searchContext = await searchWeb(message);
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

      // Call Cerebras AI
      const { response, isEasterEgg } = await callCerebras(enhancedMessage, conversationHistory);

      // Save conversation to storage
      await storage.addConversation({ role: 'user', content: message });
      await storage.addConversation({ role: 'assistant', content: response });

      res.json({ response, isEasterEgg });
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

  const httpServer = createServer(app);

  return httpServer;
}
