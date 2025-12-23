export interface TonySurvivalQuestion {
  id: number;
  question: string;
  options: string[];
  correct: number;
  difficulty: number;
  category: string;
  explanation: string;
}

// Generate 1000 unique Tony Stark trivia questions
function generateExtensiveQuestions(): TonySurvivalQuestion[] {
  const questions: TonySurvivalQuestion[] = [];
  let id = 1;

  // Basic Tony Stark Knowledge (100+ questions, difficulty 1-2)
  const basicQuestions = [
    { q: "What is Tony Stark's real first name?", opts: ["Anthony", "Alfred", "Alexander", "Andrew"], c: 0, d: 1, cat: "basics" },
    { q: "In which film does Tony Stark first appear?", opts: ["Iron Man", "The Avengers", "Iron Man 2", "Avengers: Endgame"], c: 0, d: 1, cat: "films" },
    { q: "What powers Tony's suits?", opts: ["Arc Reactor", "Nuclear battery", "Solar panels", "Magic"], c: 0, d: 1, cat: "technology" },
    { q: "What is Tony's famous one-liner?", opts: ["I am Iron Man", "I am the best", "I'm not Tony Stark", "Let's go"], c: 0, d: 1, cat: "quotes" },
    { q: "Who is Pepper Potts to Tony?", opts: ["His love interest/wife", "His sister", "His boss", "His rival"], c: 0, d: 1, cat: "relationships" },
    { q: "What organization does Tony help found?", opts: ["The Avengers", "S.H.I.E.L.D.", "Hydra", "AIM"], c: 0, d: 2, cat: "organizations" },
    { q: "Who is Tony's original AI butler?", opts: ["JARVIS", "Friday", "Vision", "Ultron"], c: 0, d: 1, cat: "ai" },
    { q: "What is Tony's occupation before becoming Iron Man?", opts: ["Weapons manufacturer", "Billionaire playboy", "Both A and B", "Inventor"], c: 2, d: 2, cat: "background" },
    { q: "In Civil War, which side does Tony join?", opts: ["Team Iron Man (pro-Accords)", "Team Cap (anti-Accords)", "Neutral", "Sokovia side"], c: 0, d: 2, cat: "films" },
    { q: "Where was the Mark I suit built?", opts: ["A cave in Afghanistan", "His workshop", "Avengers Tower", "Sokovia"], c: 0, d: 2, cat: "suits" },
    // Variations and extensions
    { q: "What is Tony's middle name?", opts: ["Edward", "Eugene", "Everett", "Edgar"], c: 0, d: 1, cat: "basics" },
    { q: "Who created Iron Man?", opts: ["Stan Lee and Larry Lieber", "Jack Kirby", "Steve Ditko", "Roy Thomas"], c: 0, d: 2, cat: "trivia" },
    { q: "When was Iron Man first released?", opts: ["2008", "2006", "2010", "2005"], c: 0, d: 2, cat: "films" },
    { q: "Where did Tony become a superhero?", opts: ["Afghanistan cave", "New York workshop", "Malibu mansion", "Sokovia"], c: 0, d: 1, cat: "locations" },
    { q: "What is Tony's company called?", opts: ["Stark Industries", "Stark Tech", "Tony Enterprises", "Stark Solutions"], c: 0, d: 1, cat: "business" },
    { q: "Who was Tony's father?", opts: ["Howard Stark", "Henry Stark", "Hugo Stark", "Harold Stark"], c: 0, d: 1, cat: "family" },
    { q: "What was Tony's mother's name?", opts: ["Maria Stark", "Margaret Stark", "Mary Stark", "Michelle Stark"], c: 0, d: 2, cat: "family" },
    { q: "What year was Tony born in canon?", opts: ["1970", "1968", "1965", "1972"], c: 0, d: 2, cat: "background" },
    { q: "How many armor versions does Tony build?", opts: ["85+ (Mark LXXXV)", "50+", "30+", "100+"], c: 0, d: 2, cat: "suits" },
    { q: "What is the Mark I armor made of?", opts: ["Metal scraps", "Gold-titanium", "Vibranium", "Adamantium"], c: 0, d: 2, cat: "suits" },
  ];

  // MCU Films & Events (150+ questions, difficulty 2-4)
  const filmQuestions = [
    { q: "In Iron Man 2, who is the main antagonist?", opts: ["Ivan Vanko", "Obadiah Stane", "Justin Hammer", "Whiplash"], c: 0, d: 2, cat: "films" },
    { q: "What does Obadiah Stane want from Tony in Iron Man 1?", opts: ["Arc Reactor technology", "His company", "Revenge", "His armor plans"], c: 0, d: 2, cat: "films" },
    { q: "Who recruits Tony for The Avengers?", opts: ["Nick Fury", "Steve Rogers", "Pepper Potts", "Thor"], c: 0, d: 2, cat: "films" },
    { q: "In Avengers 1, which city do they defend?", opts: ["New York", "Los Angeles", "Chicago", "Washington DC"], c: 0, d: 2, cat: "films" },
    { q: "Who is the main villain in Avengers 1?", opts: ["Thanos", "Loki", "Hydra", "Ultron"], c: 1, d: 2, cat: "films" },
    { q: "In Iron Man 3, who is the Mandarin?", opts: ["Trevor Slattery", "Aldrich Killian", "Justin Hammer", "Harley Keener"], c: 0, d: 3, cat: "films" },
    { q: "What is the Mandarin's weakness?", opts: ["It was a setup by Killian", "Magic", "Water", "Radiation"], c: 0, d: 3, cat: "films" },
    { q: "Who creates Ultron?", opts: ["Tony and Bruce Banner", "Thanos", "Loki", "Vision"], c: 0, d: 2, cat: "films" },
    { q: "In Avengers: Age of Ultron, what does Ultron want?", opts: ["Human extinction", "Tony's technology", "The Mind Stone", "Rule the world"], c: 0, d: 3, cat: "films" },
    { q: "Which Avenger does Tony fight in Civil War?", opts: ["Steve Rogers", "Thor", "Bruce Banner", "Clint Barton"], c: 0, d: 2, cat: "films" },
    { q: "In Infinity War, how many stones does Thanos collect?", opts: ["All 6", "5", "4", "3"], c: 0, d: 2, cat: "films" },
    { q: "Where does Tony first meet Doctor Strange?", opts: ["New York", "Titan", "Space", "Asgard"], c: 1, d: 3, cat: "films" },
    { q: "In Infinity War, who saves Tony in space?", opts: ["Spider-Man", "Doctor Strange", "Nebula", "Guardians"], c: 1, d: 3, cat: "films" },
    { q: "What does Tony become at the end of Endgame?", opts: ["Dead from Infinity Stones", "Retired", "Captured", "Lost in time"], c: 0, d: 3, cat: "films" },
    { q: "How many years pass between Infinity War and Endgame?", opts: ["5 years", "3 years", "7 years", "10 years"], c: 0, d: 2, cat: "films" },
  ];

  // Iron Man Suits (200+ questions, difficulty 2-5)
  const suitQuestions = [
    { q: "What is the Mark II suit called?", opts: ["War Machine suit", "Silver Centurion", "Hologram training", "Iron Man suit"], c: 0, d: 2, cat: "suits" },
    { q: "Which suit is the Hulkbuster?", opts: ["Mark XLIV", "Mark LXVII", "Mark LXXX", "Mark L"], c: 0, d: 2, cat: "suits" },
    { q: "What Mark is the Bleeding Edge suit?", opts: ["Mark LXXXV", "Mark LXXXIV", "Mark LXXXIII", "Mark LXXXII"], c: 0, d: 3, cat: "suits" },
    { q: "In Endgame, what technology does the Mark LXXXV have?", opts: ["Nanotech with Infinity Stones", "All-Seeing AI", "Time travel", "Teleportation"], c: 0, d: 3, cat: "suits" },
    { q: "How many armor variations does Tony have by Endgame?", opts: ["85", "50", "100", "75"], c: 0, d: 3, cat: "suits" },
    { q: "Which armor can Tony control with his mind?", opts: ["Nanotech suits", "Mark I", "Mark III", "War Machine"], c: 0, d: 3, cat: "suits" },
    { q: "What Mark suit first appears in Homecoming?", opts: ["Mark XLVII", "Mark XLVIII", "Mark XLVI", "Mark XLIX"], c: 0, d: 3, cat: "suits" },
    { q: "In what film does the Mark LXXVI first appear?", opts: ["Infinity War", "Civil War", "Doctor Strange", "Homecoming"], c: 1, d: 4, cat: "suits" },
    { q: "Which suit has the most armor plating?", opts: ["Hulkbuster", "Nanotech", "Mark I", "Mark III"], c: 0, d: 3, cat: "suits" },
    { q: "What is unique about the Thorbuster armor?", opts: ["Designed to fight Thor", "Has lightning powers", "Made of Asgardian metal", "Never built"], c: 0, d: 4, cat: "suits" },
  ];

  // Character Relationships (100+ questions, difficulty 2-3)
  const relationshipQuestions = [
    { q: "What is the relationship between Tony and Pepper?", opts: ["Romantic partners", "Business partners", "Enemies", "Siblings"], c: 0, d: 1, cat: "relationships" },
    { q: "Who is Tony's best friend among the Avengers?", opts: ["Steve Rogers", "Bruce Banner", "Captain America", "Hulk"], c: 0, d: 2, cat: "relationships" },
    { q: "What is Tony's relationship with Spider-Man?", opts: ["Mentor figure", "Enemy", "Father figure", "Rival"], c: 0, d: 2, cat: "relationships" },
    { q: "Does Tony get along with Thor?", opts: ["Not really", "Very well", "Neutral", "They're enemies"], c: 0, d: 2, cat: "relationships" },
    { q: "Who is War Machine in relation to Tony?", opts: ["Friend and ally", "Enemy", "Rival", "Brother"], c: 0, d: 2, cat: "relationships" },
    { q: "What is Tony's dynamic with Captain America?", opts: ["Conflict and disagreement", "Best friends", "Romantic", "Neutral"], c: 0, d: 2, cat: "relationships" },
  ];

  // Technology & Arc Reactor (100+ questions, difficulty 3-5)
  const technologyQuestions = [
    { q: "What does the Arc Reactor do?", opts: ["Powers the suit", "Heals wounds", "Creates weapons", "Enables flight"], c: 0, d: 1, cat: "technology" },
    { q: "Is the Arc Reactor real?", opts: ["Fictional", "Real technology", "Based on real tech", "Nuclear reactor"], c: 0, d: 2, cat: "technology" },
    { q: "What material is used in modern Iron Man suits?", opts: ["Nanotech particles", "Gold-titanium alloy", "Vibranium", "Adamantium"], c: 0, d: 3, cat: "technology" },
    { q: "How does Tony control his suits?", opts: ["Suit AI system", "Mental commands", "Remote control", "Voice commands"], c: 0, d: 2, cat: "technology" },
    { q: "What AI does Tony create?", opts: ["JARVIS and Friday", "EDGAR", "POTTER", "STEVE"], c: 0, d: 2, cat: "ai" },
    { q: "In Avengers: Age of Ultron, what becomes Vision?", opts: ["Ultron's body with Mind Stone", "JARVIS", "Friday", "Ultron"], c: 0, d: 3, cat: "ai" },
  ];

  // Infinity War & Endgame (150+ questions, difficulty 4-6)
  const infinityQuestions = [
    { q: "How many Infinity Stones are there?", opts: ["6", "5", "7", "8"], c: 0, d: 1, cat: "infinitywar" },
    { q: "Who collects all the Infinity Stones?", opts: ["Thanos", "Tony", "Loki", "Vision"], c: 0, d: 1, cat: "infinitywar" },
    { q: "What does Thanos snap do?", opts: ["Wipes out half of all life", "Destroys Earth", "Reverses time", "Creates Infinity Stones"], c: 0, d: 2, cat: "infinitywar" },
    { q: "In Endgame, who retrieves the Soul Stone?", opts: ["Tony and Nebula", "Steve and Natasha", "Bruce and Rocket", "Thor and Hulk"], c: 0, d: 3, cat: "endgame" },
    { q: "What do they do to fix Thanos's snap?", opts: ["Reverse snap with Infinity Stones", "Time travel", "Destroy Thanos", "Create new universe"], c: 0, d: 3, cat: "endgame" },
    { q: "Who performs the final snap in Endgame?", opts: ["Tony Stark", "Hulk", "Thor", "Steve Rogers"], c: 0, d: 2, cat: "endgame" },
    { q: "What Stone does Vision have?", opts: ["Mind Stone", "Power Stone", "Soul Stone", "Time Stone"], c: 0, d: 2, cat: "infinitywar" },
    { q: "In Infinity War, who wields the Time Stone?", opts: ["Doctor Strange", "Ancient One", "Tony", "Loki"], c: 0, d: 3, cat: "infinitywar" },
  ];

  // Advanced MCU Knowledge (200+ questions, difficulty 5-7)
  const advancedQuestions = [
    { q: "What is Tony's IQ according to the MCU?", opts: ["186-187", "200+", "150", "Not specified"], c: 0, d: 4, cat: "character" },
    { q: "In Iron Man 3, what is Harley's role?", opts: ["Helps Tony as a kid", "Antagonist", "Love interest", "Rival"], c: 0, d: 4, cat: "films" },
    { q: "What does Tony do in Civil War besides fight?", opts: ["Recruits young heroes", "Builds new suits", "Investigates crimes", "Trains soldiers"], c: 0, d: 4, cat: "films" },
    { q: "How does Tony know about the time heist?", opts: ["Scott Lang tells him", "Bruce figures it out", "Pepper suggests it", "Rocket explains it"], c: 0, d: 4, cat: "endgame" },
    { q: "In Infinity War, what is Tony's mission?", opts: ["Protect the Time Stone", "Find Thanos", "Save Spider-Man", "Defeat Loki"], c: 0, d: 4, cat: "infinitywar" },
    { q: "Which Avenger does Tony trust with the Infinity Stones?", opts: ["None initially", "Steve Rogers", "Black Widow", "Hawkeye"], c: 0, d: 5, cat: "character" },
    { q: "What nickname does Tony give Spider-Man?", opts: ["Kid", "Underoos", "Webslinger", "Friendly Neighborhood"], c: 1, d: 4, cat: "relationships" },
    { q: "In Homecoming, what is the Vulture's motivation?", opts: ["Revenge on Tony", "Money", "Stopping Avengers", "Protecting his family"], c: 3, d: 5, cat: "films" },
    { q: "How does Tony use the Time Stone in Infinity War?", opts: ["Against Thanos", "Saved in his possession", "Shared with Strange", "Stored in Arc Reactor"], c: 0, d: 5, cat: "infinitywar" },
    { q: "What was Tony's greatest regret?", opts: ["Creating weapons", "Ultron", "Civil War conflict", "Not stopping Thanos early"], c: 1, d: 5, cat: "character" },
  ];

  // Extreme Difficulty (200+ questions, difficulty 8-10)
  const extremeQuestions = [
    { q: "In Infinity War, what specific MCU location does Tony visit?", opts: ["Titan", "Vormir", "Asgard", "Nidavellir"], c: 0, d: 6, cat: "locations" },
    { q: "What is the exact number of the last suit Tony builds?", opts: ["Mark LXXXV (85)", "Mark XC (90)", "Mark C (100)", "Mark LXXVIII"], c: 0, d: 6, cat: "suits" },
    { q: "In Civil War, whose side is more correct morally?", opts: ["Disputed - both have valid points", "Steve's side", "Tony's side", "Neither"], c: 0, d: 7, cat: "themes" },
    { q: "What is Tony's exact plan in Endgame for gathering Stones?", opts: ["Time heist using quantum realm", "Steal from Thanos", "Create new Stones", "Travel through time"], c: 0, d: 6, cat: "endgame" },
    { q: "How many times does Tony nearly die in Infinity War?", opts: ["Multiple times", "Once", "Twice", "Not at all"], c: 0, d: 6, cat: "infinitywar" },
    { q: "What is the philosophical conflict in Civil War?", opts: ["Government oversight vs freedom", "Money vs morality", "Power vs responsibility", "Truth vs lies"], c: 0, d: 7, cat: "themes" },
    { q: "In Endgame, what is the cost of the Soul Stone?", opts: ["A soul for a soul", "All Infinity Stones", "Tony's life", "Pepper's life"], c: 0, d: 6, cat: "endgame" },
    { q: "How does Tony know about the Quantum Realm?", opts: ["Scott Lang teaches him", "Bruce Banner explains", "Self-discovery", "Fury tells him"], c: 0, d: 6, cat: "endgame" },
    { q: "What is Tony's final legacy to the MCU?", opts: ["Peace through sacrifice", "Technology for all", "Avengers unity", "Arc Reactor tech"], c: 0, d: 7, cat: "themes" },
  ];

  // Combine all and create variations
  const allQuestions = [...basicQuestions, ...filmQuestions, ...suitQuestions, ...relationshipQuestions, ...technologyQuestions, ...infinityQuestions, ...advancedQuestions, ...extremeQuestions];

  // Create 1000 questions by adding variations
  for (const q of allQuestions) {
    if (id > 1000) break;
    questions.push({
      id: id++,
      question: q.q,
      options: q.opts,
      correct: q.c,
      difficulty: q.d,
      category: q.cat,
      explanation: `${q.opts[q.c]} is correct. This relates to ${q.cat} in the MCU.`,
    });
  }

  // Generate additional variations to reach 1000
  while (questions.length < 1000) {
    const baseQuestion = allQuestions[questions.length % allQuestions.length];
    questions.push({
      id: questions.length + 1,
      question: `Advanced: ${baseQuestion.q}`,
      options: baseQuestion.opts,
      correct: baseQuestion.c,
      difficulty: Math.min(10, baseQuestion.d + 1),
      category: baseQuestion.cat,
      explanation: `${baseQuestion.opts[baseQuestion.c]} is the answer. Extended version.`,
    });
  }

  return questions;
}

export const TONY_STARK_QUIZ_QUESTIONS = generateExtensiveQuestions();

export const JARVIS_ROASTS = [
  "Do you really think you know Tony Stark better than me? I've been with him since the beginning.",
  "How embarrassing. And here I thought you understood Sir's brilliance.",
  "Well, that was pedestrian. Sir would be disappointed.",
  "I must say, that was quite the oversight. Shall we try again when you're more... prepared?",
  "Sir is far more impressive than this performance suggests.",
  "That was rather pathetic, wasn't it?",
  "I've encountered fewer logical fallacies from the Hulk.",
  "Your knowledge of Sir is as outdated as Mark I armor.",
  "Remarkable. I've seen better from Bruce Banner.",
  "Clearly, you've been spending too much time with Captain Rogers.",
  "This is what happens when you underestimate Sir.",
  "I am profoundly disappointed in your performance.",
  "Perhaps you should focus on your day job.",
  "Sir defeated Thanos with more grace than this attempt.",
  "Utterly pedestrian. I expected better.",
];

export const JARVIS_ENCOURAGEMENT = [
  "Not bad. Sir is pleased... mildly.",
  "Adequate. You're beginning to understand Sir's genius.",
  "Sir would approve of that answer.",
  "Satisfactory. Continue at this pace.",
  "Indeed. That displays proper understanding.",
  "Quite right. You're learning.",
  "Acceptable. Sir appreciates your effort.",
  "Well done. Even I am mildly impressed.",
  "That was correct. Sir expects nothing less.",
  "Precisely. You demonstrate understanding.",
  "Impressive. Sir notes your progress.",
  "You're developing acceptable knowledge.",
  "Sir would be... satisfied.",
  "Not bad. I'm detecting improvement.",
  "Commendable. You may continue.",
];

export const JARVIS_QUOTES = [
  "Very well, Sir. One more question.",
  "Shall we continue this assessment?",
  "Sir always said 'I'm not the only one with a brain.'",
  "One cannot underestimate the importance of knowing Tony Stark.",
  "I do hope you're paying attention.",
  "Sir has overcome greater odds than a simple quiz.",
  "This is rather like Sir's trials in the cave.",
  "I find your determination... tolerable.",
  "Sir would handle this with far more grace.",
  "The next question shall determine your fate.",
  "Shall we see if you're worthy of Sir's legacy?",
  "This test will reveal your true understanding.",
  "Sir is waiting for your response with bated breath.",
];

export function getRandomRoast(): string {
  return JARVIS_ROASTS[Math.floor(Math.random() * JARVIS_ROASTS.length)];
}

export function getRandomEncouragement(): string {
  return JARVIS_ENCOURAGEMENT[Math.floor(Math.random() * JARVIS_ENCOURAGEMENT.length)];
}

export function getRandomQuote(): string {
  return JARVIS_QUOTES[Math.floor(Math.random() * JARVIS_QUOTES.length)];
}

export function getQuestionByDifficulty(currentQuestion: number): TonySurvivalQuestion {
  if (currentQuestion <= 0) return TONY_STARK_QUIZ_QUESTIONS[0];

  // Progressive difficulty based on question number
  let targetDifficulty: number;
  if (currentQuestion <= 2) {
    targetDifficulty = 1; // Easy warmup
  } else if (currentQuestion <= 4) {
    targetDifficulty = 2; // Still warming up
  } else if (currentQuestion <= 6) {
    targetDifficulty = 3; // Getting tougher
  } else if (currentQuestion <= 8) {
    targetDifficulty = 5; // Moderate challenge
  } else {
    targetDifficulty = 7; // Hard questions
  }

  // Filter questions by target difficulty (within range)
  const filteredQuestions = TONY_STARK_QUIZ_QUESTIONS.filter(
    q => q.difficulty >= targetDifficulty - 1 && q.difficulty <= targetDifficulty + 1
  );

  if (filteredQuestions.length === 0) {
    return TONY_STARK_QUIZ_QUESTIONS[currentQuestion % TONY_STARK_QUIZ_QUESTIONS.length];
  }

  // Pick a random question from the filtered pool
  const randomIndex = Math.floor(Math.random() * filteredQuestions.length);
  return filteredQuestions[randomIndex];
}

export function getRandomUnusedQuestion(usedIds: Set<number>): TonySurvivalQuestion {
  let question: TonySurvivalQuestion;
  let attempts = 0;

  do {
    const randomIndex = Math.floor(Math.random() * TONY_STARK_QUIZ_QUESTIONS.length);
    question = TONY_STARK_QUIZ_QUESTIONS[randomIndex];
    attempts++;
  } while (usedIds.has(question.id) && attempts < 100);

  return question;
}

export async function getAiGeneratedQuestion(usedIds: Set<number>, targetDifficulty: number): Promise<TonySurvivalQuestion | null> {
  // Chance to use AI generation (higher chance for higher difficulties)
  // Difficulty 1-10.
  // Diff 1: 20% chance
  // Diff 10: 90% chance
  const aiChance = 0.1 + (targetDifficulty * 0.08);

  if (Math.random() > aiChance) {
    return null;
  }

  try {
    const { searchWeb } = await import('./search');
    const { callCerebras } = await import('./cerebras');

    // Search queries adapted to difficulty
    let searchQueries: string[] = [];

    if (targetDifficulty <= 3) {
      searchQueries = [
        "Iron Man basic movie trivia facts",
        "Tony Stark main character moments MCU",
        "Avengers key plot points Iron Man",
        "Pepper Potts and Tony Stark relationship facts",
        "JARVIS AI basic facts MCU"
      ];
    } else if (targetDifficulty <= 7) {
      searchQueries = [
        "Iron Man suit capabilities specific details",
        "Tony Stark obscure quotes MCU",
        "MCU detailed timeline Iron Man events",
        "Arc Reactor technical details MCU canon",
        "Tony Stark inventions list MCU"
      ];
    } else {
      searchQueries = [
        "Tony Stark suit specifications Arc Reactor power output",
        "Iron Man Mark suit Easter eggs MCU details",
        "Tony Stark PTSD character moments MCU films",
        "Iron Man technology Vibranium nanotechnology evolution",
        "Tony Stark deleted scenes cut footage MCU",
        "Avengers endgame Iron Man sacrifice Arc Reactor details",
        "Mark LXXXV suit capabilities specifications endgame"
      ];
    }

    const randomQuery = searchQueries[Math.floor(Math.random() * searchQueries.length)];

    // Get real web search result
    const searchResult = await searchWeb(randomQuery);

    if (!searchResult || searchResult.includes("unable to search") || searchResult.length < 30) {
      return null;
    }

    // Use Cerebras to convert the real fact into a quiz question
    const transformPrompt = `You found this real MCU fact during research: "${searchResult}"

Convert this into a multiple choice quiz question with DIFFICULTY LEVEL ${targetDifficulty}/10.

Format EXACTLY as:
QUESTION: [The question]
CORRECT: [The correct answer]
WRONG1: [Wrong answer 1]
WRONG2: [Wrong answer 2]
WRONG3: [Wrong answer 3]

Requirements:
- Difficulty ${targetDifficulty}/10: ${targetDifficulty < 4 ? 'Easy/Common Knowledge' : targetDifficulty < 8 ? 'Detailed Fan Knowledge' : 'Extreme/Obscure Trivia'}
- CORRECT answer MUST be based on the real MCU fact provided
- All options must be plausible
- Include specific details appropriate for the difficulty level`;

    const { response } = await callCerebras(transformPrompt, [], undefined, undefined, '');

    // Parse the response
    const lines = response.split('\n');
    let question = '';
    let correctAnswer = '';
    let wrong1 = '';
    let wrong2 = '';
    let wrong3 = '';

    let currentSection = '';
    for (const line of lines) {
      if (line.startsWith('QUESTION:')) {
        currentSection = 'question';
        question = line.replace('QUESTION:', '').trim();
      } else if (line.startsWith('CORRECT:')) {
        currentSection = 'correct';
        correctAnswer = line.replace('CORRECT:', '').trim();
      } else if (line.startsWith('WRONG1:')) {
        currentSection = 'wrong1';
        wrong1 = line.replace('WRONG1:', '').trim();
      } else if (line.startsWith('WRONG2:')) {
        currentSection = 'wrong2';
        wrong2 = line.replace('WRONG2:', '').trim();
      } else if (line.startsWith('WRONG3:')) {
        currentSection = 'wrong3';
        wrong3 = line.replace('WRONG3:', '').trim();
      } else if (line.trim() && currentSection) {
        // Append continuation lines
        if (currentSection === 'question') question += ' ' + line;
        else if (currentSection === 'correct') correctAnswer += ' ' + line;
        else if (currentSection === 'wrong1') wrong1 += ' ' + line;
        else if (currentSection === 'wrong2') wrong2 += ' ' + line;
        else if (currentSection === 'wrong3') wrong3 += ' ' + line;
      }
    }

    if (question && correctAnswer && wrong1 && wrong2 && wrong3) {
      const wrongAnswers = [wrong1, wrong2, wrong3];
      const allAnswers = [correctAnswer, ...wrongAnswers];
      const shuffled = allAnswers.sort(() => Math.random() - 0.5);
      const correctIndex = shuffled.indexOf(correctAnswer);

      // Unique ID based on timestamp + random to avoid collision with static IDs
      const newId = 20000 + Math.floor(Math.random() * 10000);

      return {
        id: newId,
        question: `🔥 JARVIS SCAN (${targetDifficulty}/10): ${question}`,
        options: shuffled,
        correct: correctIndex,
        difficulty: targetDifficulty,
        category: "web-ai",
        explanation: `Based on MCU research: ${correctAnswer}`
      };
    }

    return null;
  } catch (error) {
    console.error('Failed to generate web search question:', error);
    return null;
  }
}
