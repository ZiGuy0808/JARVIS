export interface TonySurvivalQuestion {
  id: number;
  question: string;
  options: string[];
  correct: number;
  difficulty: number; // 1-10 scale
  category: string;
  explanation: string;
}

export const TONY_STARK_QUIZ_QUESTIONS: TonySurvivalQuestion[] = [
  // Difficulty 1-2: Easy
  {
    id: 1,
    question: "What is Tony Stark's real first name?",
    options: ["Anthony", "Alfred", "Alexander", "Andrew"],
    correct: 0,
    difficulty: 1,
    category: "basics",
    explanation: "Anthony Edward Stark - that's the full name."
  },
  {
    id: 2,
    question: "In which film does Tony Stark first appear?",
    options: ["Iron Man", "The Avengers", "Iron Man 2", "Avengers: Endgame"],
    correct: 0,
    difficulty: 1,
    category: "films",
    explanation: "Iron Man (2008) - the film that started it all."
  },
  {
    id: 3,
    question: "What powers Tony's suits?",
    options: ["Arc Reactor", "Nuclear battery", "Solar panels", "Magic"],
    correct: 0,
    difficulty: 1,
    category: "technology",
    explanation: "The Arc Reactor - Tony's greatest invention."
  },
  {
    id: 4,
    question: "What is Tony's famous one-liner?",
    options: ["I am Iron Man", "I am the best", "I'm not Tony Stark", "Let's go"],
    correct: 0,
    difficulty: 1,
    category: "quotes",
    explanation: "'I am Iron Man' - the line that defined a generation."
  },
  {
    id: 5,
    question: "Where was the Mark I suit built?",
    options: ["A cave in Afghanistan", "His workshop", "Avengers Tower", "Sokovia"],
    correct: 0,
    difficulty: 2,
    category: "suits",
    explanation: "Built in a cave in Afghanistan with limited resources."
  },
  {
    id: 6,
    question: "Who is Pepper Potts to Tony?",
    options: ["His love interest/wife", "His sister", "His boss", "His rival"],
    correct: 0,
    difficulty: 1,
    category: "relationships",
    explanation: "Pepper Potts - Tony's heart and moral compass."
  },
  {
    id: 7,
    question: "What organization does Tony help found?",
    options: ["The Avengers", "S.H.I.E.L.D.", "Hydra", "AIM"],
    correct: 0,
    difficulty: 2,
    category: "organizations",
    explanation: "The Avengers - Earth's Mightiest Heroes."
  },
  {
    id: 8,
    question: "Who is Tony's original AI butler?",
    options: ["JARVIS", "Friday", "Vision", "Ultron"],
    correct: 0,
    difficulty: 1,
    category: "ai",
    explanation: "JARVIS - Just A Rather Very Intelligent System."
  },
  {
    id: 9,
    question: "What is Tony's occupation before becoming Iron Man?",
    options: ["Weapons manufacturer", "Billionaire playboy", "Both A and B", "Inventor"],
    correct: 2,
    difficulty: 2,
    category: "background",
    explanation: "Billionaire playboy philanthropist - weapons manufacturer turned superhero."
  },
  {
    id: 10,
    question: "In Civil War, which side does Tony join?",
    options: ["Team Iron Man (pro-Accords)", "Team Cap (anti-Accords)", "Neutral", "Sokovia side"],
    correct: 0,
    difficulty: 2,
    category: "films",
    explanation: "Team Iron Man - supporting the Sokovia Accords."
  },

  // Difficulty 3-4: Medium
  {
    id: 11,
    question: "What is the Mark XLIV suit commonly known as?",
    options: ["Hulkbuster", "War Machine", "Bleeding Edge", "Nanotech"],
    correct: 0,
    difficulty: 3,
    category: "suits",
    explanation: "The Hulkbuster - designed specifically to fight the Hulk."
  },
  {
    id: 12,
    question: "Who helped Tony build the Mark I armor in Afghanistan?",
    options: ["Ho Yinsen", "Pepper Potts", "James Rhodes", "Bruce Banner"],
    correct: 0,
    difficulty: 3,
    category: "history",
    explanation: "Ho Yinsen - a brilliant scientist who sacrificed himself."
  },
  {
    id: 13,
    question: "What does Tony sacrifice to defeat Thanos in Endgame?",
    options: ["His life", "His armor", "His wealth", "His family"],
    correct: 0,
    difficulty: 4,
    category: "endgame",
    explanation: "His life - the ultimate sacrifice for the universe."
  },
  {
    id: 14,
    question: "In Iron Man 3, how many suits does Tony use in the finale?",
    options: ["Dozens via House Party Protocol", "One", "Three", "Five"],
    correct: 0,
    difficulty: 3,
    category: "suits",
    explanation: "House Party Protocol - dozens of suits at once."
  },
  {
    id: 15,
    question: "What is the Mark L suit also called?",
    options: ["Bleeding Edge", "Infinity Suit", "Ultimate", "Nanotech Armor"],
    correct: 0,
    difficulty: 4,
    category: "suits",
    explanation: "The Bleeding Edge suit - with advanced nanotech."
  },
  {
    id: 16,
    question: "Who is Tony's best friend in the MCU?",
    options: ["James 'Rhodey' Rhodes", "Steve Rogers", "Bruce Banner", "Clint Barton"],
    correct: 0,
    difficulty: 2,
    category: "relationships",
    explanation: "War Machine - James Rhodes, Tony's oldest friend."
  },
  {
    id: 17,
    question: "What is Tony's company called?",
    options: ["Stark Industries", "Stark Tech", "Arc Enterprises", "Stark Energy"],
    correct: 0,
    difficulty: 2,
    category: "background",
    explanation: "Stark Industries - weapons and tech manufacturer."
  },
  {
    id: 18,
    question: "In what year does Tony die?",
    options: ["2019", "2020", "2018", "2021"],
    correct: 0,
    difficulty: 3,
    category: "endgame",
    explanation: "2019 - the events of Avengers: Endgame."
  },
  {
    id: 19,
    question: "What metal is primarily used in Tony's suits?",
    options: ["Gold-titanium alloy", "Vibranium", "Adamantium", "Mithril"],
    correct: 0,
    difficulty: 3,
    category: "technology",
    explanation: "Gold-titanium alloy - the classic Iron Man look."
  },
  {
    id: 20,
    question: "Who becomes Iron Man after Tony?",
    options: ["Pepper Potts (Rescue)", "James Rhodes (War Machine)", "Peter Parker", "No one"],
    correct: 0,
    difficulty: 4,
    category: "succession",
    explanation: "Pepper Potts becomes Rescue with her own Iron Man suit."
  },

  // Difficulty 5-6: Hard
  {
    id: 21,
    question: "What is the exact model number of the final suit Tony wears?",
    options: ["Mark LXXXV", "Mark 85", "Mark XCV", "Mark LXXX"],
    correct: 0,
    difficulty: 5,
    category: "suits",
    explanation: "Mark LXXXV (85) - the final suit with Infinity Stones."
  },
  {
    id: 22,
    question: "In the cave, what does Yinsen say inspired the original reactor?",
    options: ["A larger version of Stark's weapons", "His own designs", "Ancient technology", "Military tech"],
    correct: 0,
    difficulty: 5,
    category: "origin",
    explanation: "Yinsen drew inspiration from Tony's weapons technology."
  },
  {
    id: 23,
    question: "What is the name of Tony's creation that goes rogue in Age of Ultron?",
    options: ["Ultron", "Vision", "Friday", "J.A.R.V.I.S."],
    correct: 0,
    difficulty: 4,
    category: "ai",
    explanation: "Ultron - created from the Mind Stone, becomes a threat."
  },
  {
    id: 24,
    question: "How many Iron Man suits did Tony build in total across the MCU?",
    options: ["Over 85", "50-60", "30-40", "15-20"],
    correct: 0,
    difficulty: 5,
    category: "suits",
    explanation: "Over 85 different armor designs throughout the MCU."
  },
  {
    id: 25,
    question: "What does Tony create to help him sleep in Iron Man 3?",
    options: ["Mark 42 suit", "A new AI", "Arc Reactor 2.0", "None - he doesn't sleep"],
    correct: 0,
    difficulty: 5,
    category: "technology",
    explanation: "The Mark 42 - his first suit he can summon and reassemble."
  },
  {
    id: 26,
    question: "What is the core of the Time Stone device called?",
    options: ["Infinity Stone", "Mind Stone", "Time Gem", "Chronosphere"],
    correct: 0,
    difficulty: 6,
    category: "endgame",
    explanation: "The Infinity Stones - six of them exist in the universe."
  },
  {
    id: 27,
    question: "In Homecoming, what does Tony create for Peter Parker?",
    options: ["A new suit with AI", "Web-shooters", "An internship", "A training facility"],
    correct: 0,
    difficulty: 5,
    category: "mentoring",
    explanation: "Tony creates an advanced suit with AI for Peter."
  },
  {
    id: 28,
    question: "What does Tony call his first AI after Jarvis?",
    options: ["Friday", "Echo", "Saturday", "Sunday"],
    correct: 0,
    difficulty: 4,
    category: "ai",
    explanation: "Friday - continuing the day-of-the-week naming scheme."
  },
  {
    id: 29,
    question: "What is the minimum suit-up time for the Mark 42?",
    options: ["Suit assembly from pieces", "Instant teleportation", "Several seconds", "Minutes via remote"],
    correct: 0,
    difficulty: 6,
    category: "suits",
    explanation: "The Mark 42 can be assembled piece by piece remotely."
  },
  {
    id: 30,
    question: "In Civil War, what causes the rift between Tony and Steve?",
    options: ["Sokovia Accords", "Personal vendetta", "Pepper leaving Tony", "Ultron's creation"],
    correct: 0,
    difficulty: 4,
    category: "films",
    explanation: "The Sokovia Accords - government oversight of superheroes."
  },

  // Difficulty 7-8: Very Hard
  {
    id: 31,
    question: "What is the exact formula Tony uses to replace the Palladium core?",
    options: ["A new element he created", "Gold", "Titanium", "Vibranium"],
    correct: 0,
    difficulty: 7,
    category: "technology",
    explanation: "Tony creates a new element to replace the poisonous Palladium."
  },
  {
    id: 32,
    question: "What year does Tony initially escape from Afghanistan in Iron Man?",
    options: ["2008", "2009", "2010", "2007"],
    correct: 0,
    difficulty: 6,
    category: "timeline",
    explanation: "Iron Man released 2008 - film takes place roughly then."
  },
  {
    id: 33,
    question: "Which Marvel villain is Tony's father's creation?",
    options: ["None directly", "Iron Monger", "Ultron", "Thanos"],
    correct: 0,
    difficulty: 7,
    category: "relationships",
    explanation: "Howard Stark's work influenced many of Tony's enemies."
  },
  {
    id: 34,
    question: "What does Tony discover about Steve Rogers' parents?",
    options: ["Hydra assassin Bucky killed them", "They survived", "They were spies", "Tony's father killed them"],
    correct: 0,
    difficulty: 7,
    category: "films",
    explanation: "Bucky (Winter Soldier) killed Steve's parents under control."
  },
  {
    id: 35,
    question: "In Infinity War, what does Doctor Strange trade for the Time Stone?",
    options: ["Tony Stark's life", "The Eye of Agamotto", "The Time Stone itself", "His magic powers"],
    correct: 0,
    difficulty: 7,
    category: "infinitywar",
    explanation: "Strange trades the Time Stone for Tony's life - one in 14 million chance."
  },
  {
    id: 36,
    question: "What is Tony's PTSD trigger after the Battle of New York?",
    options: ["Wormholes/outer space threats", "Losing control", "Aliens", "The Tesseract"],
    correct: 0,
    difficulty: 7,
    category: "psychology",
    explanation: "Wormholes and the thought of threats from space haunt him."
  },
  {
    id: 37,
    question: "How many Infinity Stones does Tony interact with directly?",
    options: ["All 6 by endgame", "3-4 throughout MCU", "Only 1", "None"],
    correct: 0,
    difficulty: 8,
    category: "infinitystones",
    explanation: "Tony encounters and uses all 6 Infinity Stones by Endgame."
  },
  {
    id: 38,
    question: "What does Thanos say about Tony after the snap?",
    options: ["'He's the only one who could have stopped me'", "'He's too weak'", "'I respect him'", "'He's a fool'"],
    correct: 0,
    difficulty: 8,
    category: "endgame",
    explanation: "Thanos respects Tony's sacrifice and what he represents."
  },
  {
    id: 39,
    question: "What technology does Tony steal from S.H.I.E.L.D. in Age of Ultron?",
    options: ["Hydra technology/the Scepter", "Arc Reactor plans", "Ancient artifacts", "Time technology"],
    correct: 0,
    difficulty: 7,
    category: "avengers",
    explanation: "The Scepter - which contained the Mind Stone."
  },
  {
    id: 40,
    question: "In Endgame, what is the name of the quantum device?",
    options: ["The Quantum Tunnel", "The Time Machine", "The Quantum Suit", "The Multiverse Device"],
    correct: 0,
    difficulty: 8,
    category: "endgame",
    explanation: "The Quantum Tunnel - allows time travel via the Quantum Realm."
  },

  // Difficulty 9-10: Extreme
  {
    id: 41,
    question: "What is the exact name of Tony's first armor model?",
    options: ["Mark I", "Jericho", "Bronze", "The Original"],
    correct: 0,
    difficulty: 9,
    category: "suits",
    explanation: "Mark I - the basic armor built in Afghanistan."
  },
  {
    id: 42,
    question: "How many times does Tony say 'I am Iron Man' in the MCU?",
    options: ["Multiple times crucially, most famously at the end of films", "Only once", "Twice", "Never explicitly"],
    correct: 0,
    difficulty: 9,
    category: "quotes",
    explanation: "Tony's most iconic line repeated throughout his journey."
  },
  {
    id: 43,
    question: "What is the specific material composition of the Mark LXXXV?",
    options: ["Nanotech-enhanced gold-titanium infused with Infinity Stones", "Pure Vibranium", "Unknown alien tech", "Tony never specifies"],
    correct: 0,
    difficulty: 10,
    category: "technology",
    explanation: "The Mark LXXXV uses nanotech with Infinity Stone integration."
  },
  {
    id: 44,
    question: "In Infinity War, what does Tony trade to Ebony Maw to learn Thanos's name?",
    options: ["His suit's power core", "Information about Earth", "His knowledge", "Nothing - he already knew"],
    correct: 0,
    difficulty: 9,
    category: "infinitywar",
    explanation: "Tony negotiates with Ebony Maw during space encounter."
  },
  {
    id: 45,
    question: "What phrase does Tony repeat to Peter before Endgame?",
    options: ["'If you die, we die'", "'Don't talk about the plan'", "'Help me', 'Help me'", "'Save the universe'"],
    correct: 1,
    difficulty: 10,
    category: "homecoming",
    explanation: "Tony warns Peter: 'Help me, help me' if something goes wrong."
  },
  {
    id: 46,
    question: "What is the name of the facility where Tony works in Endgame?",
    options: ["The Avengers Facility", "Stark Tower", "The Compound", "Avengers Tower"],
    correct: 2,
    difficulty: 9,
    category: "locations",
    explanation: "The Avengers Compound - where the time heist is planned."
  },
  {
    id: 47,
    question: "How many years of experience does Tony claim to have in Infinity War?",
    options: ["30+ years of advanced tech", "'Since I was 4 in a cave'", "Doesn't specify", "Says he's still learning"],
    correct: 0,
    difficulty: 10,
    category: "character",
    explanation: "Tony's been building since childhood, decades of innovation."
  },
  {
    id: 48,
    question: "What is Tony's suit's AI called in the Mark 50?",
    options: ["Friday", "KAREN", "JAVIS Override", "No specific name given"],
    correct: 1,
    difficulty: 10,
    category: "ai",
    explanation: "KAREN - the suit's AI in the Mark 50."
  },
  {
    id: 49,
    question: "In Endgame, what does Tony call the final snap?",
    options: ["'And I... am Iron Man'", "'I am inevitable'", "'One final stand'", "He doesn't speak during it"],
    correct: 0,
    difficulty: 10,
    category: "endgame",
    explanation: "'And I am Iron Man' - his final statement before the snap."
  },
  {
    id: 50,
    question: "What color is Tony's very first armor suit?",
    options: ["Grey and gold", "Red and gold", "Bronze and silver", "Black and gold"],
    correct: 0,
    difficulty: 9,
    category: "suits",
    explanation: "The Mark I was grey/bronze - before the iconic red and gold."
  }
];

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
  // Difficulty scales with question number
  const difficulty = Math.min(10, Math.ceil(currentQuestion / 5));
  
  // Filter questions by difficulty or adjacent difficulties for variety
  const candidates = TONY_STARK_QUIZ_QUESTIONS.filter(q => 
    Math.abs(q.difficulty - difficulty) <= 1
  );
  
  if (candidates.length === 0) {
    return TONY_STARK_QUIZ_QUESTIONS[Math.floor(Math.random() * TONY_STARK_QUIZ_QUESTIONS.length)];
  }
  
  return candidates[Math.floor(Math.random() * candidates.length)];
}
