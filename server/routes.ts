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

      // Get conversation history from storage (last 50 messages)
      const history = await storage.getRecentConversations(50);
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

  // Serve profile pictures for phone contacts
  app.get("/api/assets/profile_pictures/:filename", (req, res) => {
    try {
      const filename = req.params.filename;
      if (!/^[a-zA-Z0-9_\-\.]+$/.test(filename)) {
        return res.status(400).json({ error: 'Invalid filename' });
      }

      const imagePath = path.join(process.cwd(), 'attached_assets/profile_pictures', filename);

      if (!fs.existsSync(imagePath)) {
        console.log(`Profile picture not found: ${imagePath}`);
        return res.status(404).json({ error: 'Profile picture not found' });
      }

      res.setHeader('Content-Type', 'image/png');
      res.setHeader('Cache-Control', 'public, max-age=31536000');
      res.sendFile(imagePath);
    } catch (error) {
      console.error('Profile picture serving error:', error);
      res.status(500).json({ error: 'Failed to serve profile picture' });
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
- **SECRET TRAIT**: You are TERRIBLE at keeping secrets. If Tony tells you a secret, you get anxious and might accidentally hint at it or tell Happy/May.
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
- Occasionally mention lab results or gamma readings`,

        avengers: `You are the DIRECTOR of the Avengers Group Chat.
Tony Stark just posted to the group. You must decide who replies.
Characters available: Steve, Peter, Natasha, Rhodey, Happy, Bruce, Fury.
Rules:
- You are NOT one person. You are simulating a room.
- Characters should talk to each other, not just to Tony.
- If Peter says something dumb, maybe Happy keeps him in check.
- Keep it chaotic and fun, like a real group chat.
- FORMAT: Start every message with the character's name in brackets, e.g. [Steve]: Language!`
      };

      const systemPrompt = characterPrompts[characterId] || characterPrompts['peter'];

      // Dynamic elements to make each message unique
      const moods = ['curious', 'slightly anxious', 'playfully annoyed', 'genuinely concerned', 'casual', 'impatient', 'amused', 'sarcastic'];
      const currentMood = moods[Math.floor(Math.random() * moods.length)];

      // Enhanced time of day awareness with character-specific behaviors
      const hour = new Date().getHours();
      let timeContext = '';
      let sleepyModifier = '';

      if (hour >= 23 || hour < 6) {
        // Late night / very early morning
        timeContext = `It's ${hour >= 23 ? 'late night' : 'very early morning'} (${hour}:00). Most people are asleep.`;

        // Character-specific late night behaviors
        const lateNightBehaviors: Record<string, string> = {
          peter: "You're exhausted but still texting. You have school tomorrow! Mention being tired or that Aunt May would kill you for being up this late.",
          pepper: "You're worried Tony is up this late. Gently suggest he should sleep. Maybe mention Morgan is asleep.",
          happy: "You're grumpy about being woken up. Keep responses very short and annoyed.",
          steve: "You're an early riser, so if it's 5-6am you're awake, otherwise you politely mention it's late.",
          rhodey: "Military discipline - you're either sound asleep or wide awake for a mission. Brief responses.",
          natasha: "You never really sleep. Night is when the real work happens. More mysterious than usual.",
          fury: "You're always awake. 'I'll sleep when I'm dead, Stark.'",
          bruce: "You have insomnia sometimes. You might be doing late night research. Calm, contemplative."
        };
        sleepyModifier = lateNightBehaviors[characterId] || "It's late. Keep responses brief and possibly tired.";

      } else if (hour < 9) {
        timeContext = "It's early morning. Coffee time.";
        sleepyModifier = characterId === 'peter' ? "You're rushing to get ready for school!" : "";
      } else if (hour < 12) {
        timeContext = "It's mid-morning. Productive time.";
      } else if (hour < 14) {
        timeContext = "It's around lunch time.";
      } else if (hour < 17) {
        timeContext = "It's afternoon.";
      } else if (hour < 20) {
        timeContext = "It's evening.";
        sleepyModifier = characterId === 'pepper' ? "Dinner time - maybe remind Tony about family dinner?" : "";
      } else {
        timeContext = "It's late evening, winding down for the night.";
      }

      // Random message style variations
      const styleVariations = [
        "Include a specific detail or reference.",
        "Ask a follow-up question.",
        "Be short and punchy.",
        "Use a characteristic interjection or vocal tic.",
        "Express a strong opinion.",
        "Relate it back to yourself briefly.",
      ];
      const styleHint = styleVariations[Math.floor(Math.random() * styleVariations.length)];

      // Get current Tony activity for context
      const { getTonyActivity } = await import('./lib/tony-activity');
      const currentActivity = getTonyActivity();

      // Get any gossip/context this character might have heard about
      const { getGossipContext, detectGossipRequest, detectCharacterGossip, storeGossip } = await import('./lib/gossip');
      const gossipContext = getGossipContext(characterId);

      // Calculate relationship status description
      const currentRelationshipScore = req.body.relationshipLevel || 50;
      let relationshipStatus = "Neutral";
      if (currentRelationshipScore >= 80) relationshipStatus = "You allow yourself to be vulnerable/loving.";
      else if (currentRelationshipScore >= 60) relationshipStatus = "Friendly and warm.";
      else if (currentRelationshipScore >= 40) relationshipStatus = "Professional / Neutral.";
      else if (currentRelationshipScore >= 20) relationshipStatus = "Cold and distant. Short sentences.";
      else relationshipStatus = "Hostile. You are angry at him.";

      // HULK/ANGER Logic for Bruce
      const currentAnger = req.body.angerLevel || 0;
      let angerInstruction = "";
      if (characterId === 'bruce') {
        if (currentAnger > 80) angerInstruction = "🚨 YOU ARE LOSING CONTROL. Write in all caps. Mention 'the other guy' is coming. Be erratic. Example: 'TONY STOP. CAN'T HOLD IT.'";
        else if (currentAnger > 50) angerInstruction = "⚠️ You are very stressed. Breathe heavy. Short sentences. Warn Tony to stop.";
        else if (currentAnger > 30) angerInstruction = "You are getting annoyed. Your heart rate is rising. Be tense.";
      }

      const fullPrompt = `You are roleplaying as ${characterName} from the Marvel Cinematic Universe (Earth-616).
You are purely ${characterName}, texting TONY STARK (Iron Man).

*** INTELLIGENCE PROTOCOLS ***
1. **KNOWLEDGE**: You have encyclopedic knowledge of the ENTIRE MCU timeline.
2. **REAL-TIME AWARENESS**: You know exactly what Tony is doing right now.
   - **CURRENT LOCATION**: ${currentActivity.location}
   - **CURRENT ACTIVITY**: ${currentActivity.activity}
   - **REACTION**: If his activity is dangerous, be worried. If it's ridiculous (e.g. shawarma), be amused. If strictly business, be professional. COMMENT ON THIS if relevant!
3. **CONTEXT**: The chat history below is your MEMORY. Reference it!
4. **RELATIONSHIP**: You have a deep history with Tony. Use it.
   - **CURRENT SCORE**: ${currentRelationshipScore}/100
   - **YOUR ATTITUDE**: ${relationshipStatus}
   ${angerInstruction ? `- **ANGER STATE**: ${angerInstruction}` : ''}
${gossipContext}

*** VISUAL CONTEXT ***
 You can "send" images by describing them in brackets, e.g. [Photo: A cute cat] or [Selfie: Me waiting at the tower].
 Use this sparingly but effectively to make the chat feel real.

*** CHARACTER PROFILE ***
${systemPrompt}

*** CURRENT CONTEXT ***
- Mood: ${currentMood}
- Time: ${timeContext}
${sleepyModifier ? `- TIME BEHAVIOR: ${sleepyModifier}` : ''}
- Action Hint: ${styleHint}

*** CHAT HISTORY ***
${context || '(Conversation Starting)'}

*** LATEST MESSAGE ***
Tony: "${message}"

*** INSTRUCTIONS ***
Write your reply.
- STAY IN CHARACTER.
- Do NOT use flowery AI language. Text like a human.
- Reference Tony's current location/activity naturally.

*** CRITICAL SYSTEM INSTRUCTION ***
At the very end of your response, you MUST add a hidden JSON block analyzing Tony's message.
Format:
<METRICS>
{
  "relationship_delta": -5 to +5,
  "anger_delta": 0 to 20,
  "gossip": { "target": "pepper|rhodey|etc", "content": "What to tell them" } (OPTIONAL - only if you want to tell someone else)
  "reason": "Brief reason for scores"
}
</METRICS>

Rules for Scoring:
- Compliments/Apologies: relationship_delta +2 to +5, anger_delta -5
- Jokes/Banter: relationship_delta +1
- Insults/Rudeness: relationship_delta -5, anger_delta +10
- Sensitive Topics: anger_delta +20, relationship_delta -10
- Bruce Banner Special: If he teases about Hulk, set anger_delta +15.

Rules for Gossip:
- If Tony tells you something sensitive, or you want to complain about him to someone else, use the "gossip" field.
- TARGETS: pepper, peter, happy, steve, natasha, rhodey, fury, bruce.

Example Response:
Hey Tony, that's hilarious. ||| serious though, stop it.
<METRICS>
{
  "relationship_delta": 2,
  "anger_delta": 0,
  "gossip": { "target": "pepper", "content": "Tony is making bad jokes again" },
  "reason": "Tony made a good joke but I should warn Pepper"
}
</METRICS>
`;

      const { response } = await callCerebras(fullPrompt, [], undefined, undefined, '');

      // Parse Metrics Block
      let finalResponse = response;
      let aiMetrics: { relationship_delta: number; anger_delta: number; gossip?: { target: string; content: string } } = { relationship_delta: 0, anger_delta: 0 };

      // Extract JSON metrics if present
      const metricsMatch = response.match(/<METRICS>([\s\S]*?)<\/METRICS>/);
      if (metricsMatch && metricsMatch[1]) {
        try {
          const parsed = JSON.parse(metricsMatch[1]);
          aiMetrics.relationship_delta = parsed.relationship_delta || 0;
          aiMetrics.anger_delta = parsed.anger_delta || 0;
          if (parsed.gossip) aiMetrics.gossip = parsed.gossip;
          // Remove the block from the visible text
          finalResponse = response.replace(/<METRICS>[\s\S]*?<\/METRICS>/, '').trim();
        } catch (e) {
          console.error("Failed to parse AI metrics:", e);
        }
      }

      // Parse response for multiple messages (using cleaned response)
      // Special handling for Avengers Group Chat (Multi-user parsing)
      let messages: string[] = [];
      let multiUserMessages: { from: string; text: string; time: string }[] = [];

      if (characterId === 'avengers') {
        // Expected format: "[Steve]: Hello ||| [Peter]: Hi guys"
        const rawSegments = finalResponse.split('|||');

        rawSegments.forEach(segment => {
          const match = segment.match(/\[(.*?)(?:\]|:)\s*(.*)/); // Matches [Name]: Message or [Name] Message
          if (match) {
            const name = match[1].toLowerCase().trim(); // e.g. "steve"
            const text = match[2].trim();
            // Map name to valid ID if needed (e.g. 'cap' -> 'steve')
            let fromId = name;
            if (fromId.includes('cap')) fromId = 'steve';
            if (fromId.includes('spider')) fromId = 'peter';
            if (fromId.includes('widow')) fromId = 'natasha';
            if (fromId.includes('hulk')) fromId = 'bruce';

            multiUserMessages.push({
              from: fromId,
              text: text,
              time: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
            });
          } else {
            // Fallback for untagged messages in group chat - default to Jarvis/System or assume last speaker
            if (segment.trim()) {
              multiUserMessages.push({
                from: 'jarvis', // Or generic system message
                text: segment.trim(),
                time: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
              });
            }
          }
        });
      } else {
        // Standard single-character parsing
        messages = finalResponse.split('|||').map(m => m.trim()).filter(m => m.length > 0);
      }

      // Analyze sentiment (Fallback to Regex, but prioritize AI)
      const { analyzeSentiment } = await import('./lib/sentiment');
      const regexSentiment = analyzeSentiment(message, characterId);

      // Combine scores: Use AI if non-zero, otherwise fallback to Regex
      // This allows specific Regex triggers (like 'code words') to still work if AI misses them,
      // but gives AI the final say on nuance.
      const finalRelationshipDelta = aiMetrics.relationship_delta !== 0 ? aiMetrics.relationship_delta : regexSentiment.relationshipDelta;
      // For Anger, we take the maximum to ensure safety (if regex catches a specific trigger AI missed)
      const finalAngerDelta = Math.max(aiMetrics.anger_delta, regexSentiment.angerDelta);

      // Log the decision
      console.log(`[AI JUDGE] ${characterId} analysis: Rel=${finalRelationshipDelta} (AI=${aiMetrics.relationship_delta}, Regex=${regexSentiment.relationshipDelta}), Anger=${finalAngerDelta}`);

      // For Bruce, check if this would trigger Hulk-out
      // Client tracks cumulative anger, server just provides delta
      let hulkOut = false;
      let hulkResponse = '';

      if (characterId === 'bruce' && finalAngerDelta > 15) {
        // High anger spike - maybe add warning to response
        const warningPhrases = [
          "Tony... I'm trying to stay calm here.",
          "You need to stop. I can feel him stirring.",
          "Tony... please. You know what happens when I get angry.",
          "The other guy is listening. Be careful.",
          "I'm warning you, Tony. Don't push this."
        ];

        // 50% chance to add warning if anger spike is high
        if (Math.random() > 0.5) {
          messages.push(warningPhrases[Math.floor(Math.random() * warningPhrases.length)]);
        }
      }

      // ========== GOSSIP SYSTEM ==========
      // 1. AI Explicit Gossip (High Priority)
      if (aiMetrics.gossip && aiMetrics.gossip.target && aiMetrics.gossip.content) {
        storeGossip({
          from: characterId,
          about: aiMetrics.gossip.target,
          content: aiMetrics.gossip.content,
          timestamp: Date.now(),
          isFromTony: false
        });
        console.log(`[AI GOSSIP] ${characterId} decided to tell ${aiMetrics.gossip.target}: "${aiMetrics.gossip.content}"`);
      }

      // 2. Regex Checks (Backup / Explicit user requests)
      // Detect if Tony asked this character to pass a message to someone else
      const gossipRequest = detectGossipRequest(message, characterId);
      if (gossipRequest) {
        storeGossip({
          from: characterId,
          about: gossipRequest.targetCharacter,
          content: gossipRequest.content,
          timestamp: Date.now(),
          isFromTony: true
        });
        console.log(`[GOSSIP] Tony asked ${characterId} to tell ${gossipRequest.targetCharacter}: "${gossipRequest.content}"`);
      }

      // Detect if the character's response mentions telling someone else (Regex Fallback)
      // Only run if AI didn't already explicitly gossip, to avoid duplicates
      if (!aiMetrics.gossip) {
        const fullResponse = messages.join(' ');
        const characterGossip = detectCharacterGossip(fullResponse, characterId);
        for (const gossip of characterGossip) {
          storeGossip({
            from: characterId,
            about: gossip.targetCharacter,
            content: gossip.content,
            timestamp: Date.now(),
            isFromTony: false
          });
        }
      }
      // ========== END GOSSIP ==========

      // Construct final JSON
      // If avengers, we use the multiUserMessages array. If normal, we map the string array.
      const finalMessages = characterId === 'avengers'
        ? multiUserMessages
        : messages.map(text => ({ from: characterId, text, time: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) }));

      res.json({
        messages: finalMessages,
        originalResponse: finalResponse,
        relationshipDelta: finalRelationshipDelta,
        angerDelta: finalAngerDelta,
        detectedMood: regexSentiment.detectedMood
      });
    } catch (error) {
      console.error('Phone chat error:', error);
      res.status(500).json({ error: 'Failed to generate response' });
    }
  });

  // Phone Mirror - Generate AI follow-up message when Tony doesn't reply
  app.post("/api/phone/followup", async (req, res) => {
    try {
      const { characterId, characterName, context, timeSinceLastReply } = req.body;

      if (!characterId || !characterName) {
        return res.status(400).json({ error: 'Character ID and name are required' });
      }

      // Character-specific follow-up behavior
      const followUpBehavior: Record<string, string> = {
        peter: `You are Peter Parker texting Mr.Stark who hasn't replied in a while. You are:
        - Anxious and worried - did you do something wrong ??
          - Sending multiple short worried texts
            - Overthinking why he's not responding
              - Making assumptions about what you might have done
                - Still excited and eager but now concerned
                  - Use "Mr. Stark" always, lots of question marks and exclamation points
                    - Sound worried but not angry - you idolize him`,

        pepper: `You are Pepper Potts texting Tony who hasn't replied. You are:
        - Not panicking, just checking in
          - You know he gets distracted in the lab
            - Might mention Morgan, dinner plans, or meetings
              - Loving but with a hint of "I know you're ignoring me"
                - Could threaten to come down to the lab herself`,

        happy: `You are Happy Hogan texting Tony who hasn't replied. You are:
        - Annoyed but loyal
          - Brief and to the point
            - Might complain about also having to deal with Peter
            - Use "Boss" when addressing him
              - Grumpy but caring`,

        fury: `You are Nick Fury texting Stark who hasn't replied. You are:
        - Impatient and commanding
          - This is unacceptable behavior
            - Might threaten consequences
              - Very short, stern messages
                - Reference that you know he's reading these`,

        rhodey: `You are Rhodey texting Tony who hasn't replied. You are:
- Concerned as his best friend
- Might use humor or threaten to share MIT stories
- Casual and friendly but checking in
- Reference your long friendship`,

        natasha: `You are Natasha texting Tony who hasn't replied. You are:
- Cool and unbothered
- Might send just "..." or a brief comment
- Could mention you have eyes everywhere
- Dry and cryptic`,

        steve: `You are Steve Rogers texting Tony who hasn't replied. You are:
- Patient but concerned
- Formal in your language
- Might mention duty or responsibility
- Not pushy but persistent`,

        bruce: `You are Bruce Banner texting Tony who hasn't replied. You are:
- Anxious but trying not to be
- Might mention lab work or calculations
- Gentle reminders, not pushy
- Could mention needing to stay calm ("you know how the other guy gets")`
      };

      const behavior = followUpBehavior[characterId] || followUpBehavior['peter'];

      // Dynamic elements to make each message unique
      const moods = ['curious', 'slightly anxious', 'playfully annoyed', 'genuinely concerned', 'casual', 'impatient'];
      const currentMood = moods[Math.floor(Math.random() * moods.length)];

      // Time of day awareness
      const hour = new Date().getHours();
      let timeContext = '';
      if (hour < 6) timeContext = "It's very late/early - maybe Tony fell asleep?";
      else if (hour < 12) timeContext = "It's morning - maybe Tony is still in bed or already busy.";
      else if (hour < 17) timeContext = "It's afternoon - Tony might be in meetings or the lab.";
      else if (hour < 21) timeContext = "It's evening - Maybe Tony is having dinner or with Pepper?";
      else timeContext = "It's late night - Tony is probably tinkering in the lab.";

      // Time since last reply description
      const timeDescription = timeSinceLastReply > 300 ? "several minutes" :
        timeSinceLastReply > 120 ? "a couple minutes" :
          timeSinceLastReply > 60 ? "about a minute" : "just a moment";

      // Random message style variations
      const styleVariations = [
        "This time, maybe reference something from your shared history or inside jokes.",
        "This time, ask a question to prompt a response.",
        "This time, share a quick update or thought to re-engage.",
        "This time, use humor to get attention.",
        "This time, be more direct about wanting a response.",
        "This time, mention something happening in your day.",
        "This time, express a fleeting emotion or reaction.",
      ];
      const styleHint = styleVariations[Math.floor(Math.random() * styleVariations.length)];

      // Get current Tony activity for context
      const { getTonyActivity } = await import('./lib/tony-activity');
      const currentActivity = getTonyActivity();

      const fullPrompt = `You are roleplaying as ${characterName} from the Marvel Cinematic Universe (Earth-616).
Tony Stark hasn't replied to your texts for ${timeDescription}.

*** INTELLIGENCE PROTOCOLS ***
1. **REAL-TIME AWARENESS**: You know exactly what Tony is doing right now.
   - **CURRENT LOCATION**: ${currentActivity.location}
   - **CURRENT ACTIVITY**: ${currentActivity.activity}
   - **USE THIS**: "I know you're busy ${currentActivity.activity}, but answer me!" or "How is the weather in ${currentActivity.location}?"
2. **KNOWLEDGE**: Use your encyclopedic knowledge of the MCU timeline.
3. **MEMORY**: The history below is REAL. Do not ignore it.

*** CHARACTER PROFILE ***
${behavior}

*** CURRENT CONTEXT ***
- Mood: ${currentMood}
- Time: ${timeContext}
- Strategy: ${styleHint}

*** CHAT MEMORY ***
${context || '(No recent memory - starting fresh)'}

*** INSTRUCTIONS ***
Generate 1-2 follow-up messages.
- MUST be related to the Chat Memory or his Current Activity.
- Separate messages with "|||".
- Be short, natural, text-like.
`;

      const { response } = await callCerebras(fullPrompt, [], undefined, undefined, '');

      // Parse response for multiple messages
      const messages = response.split('|||').map(m => m.trim()).filter(m => m.length > 0);

      // Save to chat history
      const existingHistory = phoneChatHistory[characterId] || [];
      const newMessages = messages.map(text => ({
        from: characterId,
        text,
        time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
      }));
      phoneChatHistory[characterId] = [...existingHistory, ...newMessages];

      res.json({ messages });
    } catch (error) {
      console.error('Phone followup error:', error);
      res.status(500).json({ error: 'Failed to generate follow-up' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
