export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correct: number;
  category: 'iron-man' | 'mcu' | 'tony-stark' | 'suits' | 'general';
  difficulty: 'easy' | 'medium' | 'hard';
  explanation: string;
}

export const MCU_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "What is Tony Stark's armor called?",
    options: ["Iron Man Suit", "Arc Reactor Armor", "Stark Suit", "All of the above"],
    correct: 3,
    category: 'iron-man',
    difficulty: 'easy',
    explanation: "Tony Stark's armor is commonly referred to as all of these names, but is officially part of the Iron Man legacy."
  },
  {
    id: 2,
    question: "Where was the first Iron Man suit (Mark I) built?",
    options: ["Tony's workshop", "A cave in Afghanistan", "Avengers Tower", "Sokovia"],
    correct: 1,
    category: 'suits',
    difficulty: 'easy',
    explanation: "Tony Stark built the Mark I suit in a cave in Afghanistan while being held captive, using scrap materials and his ingenuity."
  },
  {
    id: 3,
    question: "What powers Tony Stark's suits?",
    options: ["Battery", "Arc Reactor", "Nuclear energy", "Vibranium"],
    correct: 1,
    category: 'iron-man',
    difficulty: 'easy',
    explanation: "The Arc Reactor is the power source for Tony's suits. It's a miniaturized version of what he created in the cave."
  },
  {
    id: 4,
    question: "In Avengers: Infinity War, what is the Mark L suit also called?",
    options: ["Bleeding Edge", "Infinity Suit", "Nanotech Armor", "Ultimate Iron Man"],
    correct: 0,
    category: 'suits',
    difficulty: 'medium',
    explanation: "The Mark L (50) is called the 'Bleeding Edge' suit, featuring advanced nanotech technology."
  },
  {
    id: 5,
    question: "Which Mark is the Hulkbuster suit?",
    options: ["Mark XLI", "Mark XLII", "Mark XLIV", "Mark XLV"],
    correct: 2,
    category: 'suits',
    difficulty: 'medium',
    explanation: "The Hulkbuster is the Mark XLIV suit, designed specifically to combat the Hulk."
  },
  {
    id: 6,
    question: "What is Tony Stark's famous catchphrase?",
    options: ["Let's do this", "Genius, billionaire, playboy, philanthropist", "I am Iron Man", "One man army"],
    correct: 2,
    category: 'tony-stark',
    difficulty: 'easy',
    explanation: "'I am Iron Man' is Tony's iconic catchphrase, first said at the end of the first Iron Man movie."
  },
  {
    id: 7,
    question: "What year did Tony Stark die in Avengers: Endgame?",
    options: ["2019", "2020", "2021", "2022"],
    correct: 0,
    category: 'mcu',
    difficulty: 'medium',
    explanation: "The events of Avengers: Endgame take place in 2019, where Tony Stark makes his final sacrifice."
  },
  {
    id: 8,
    question: "How many Iron Man suits did Tony build in total?",
    options: ["15", "23", "85", "Over 85"],
    correct: 3,
    category: 'iron-man',
    difficulty: 'hard',
    explanation: "Tony Stark built over 85 different Iron Man suits throughout the MCU films, reaching the Mark LXXXV."
  },
  {
    id: 9,
    question: "What is Pepper Potts' superhero alter ego?",
    options: ["Rescue", "Iron Widow", "Captain Marvel", "She doesn't have one"],
    correct: 0,
    category: 'mcu',
    difficulty: 'medium',
    explanation: "Pepper Potts becomes the superhero Rescue, piloting her own Iron Man suit in Avengers: Endgame."
  },
  {
    id: 10,
    question: "In which film does Tony Stark first appear?",
    options: ["The Incredible Hulk", "Iron Man", "Avengers", "Captain America: The First Avenger"],
    correct: 1,
    category: 'mcu',
    difficulty: 'easy',
    explanation: "Tony Stark first appears as Iron Man in the film 'Iron Man' (2008), the first MCU movie."
  },
  {
    id: 11,
    question: "What is the name of Tony's AI assistant?",
    options: ["Jarvis", "Friday", "Vision", "All of the above"],
    correct: 3,
    category: 'iron-man',
    difficulty: 'medium',
    explanation: "Tony's AI is called Jarvis initially, then Friday, and the consciousness of Jarvis becomes Vision."
  },
  {
    id: 12,
    question: "In Civil War, which side does Tony Stark choose?",
    options: ["Team Cap", "Team Iron Man", "Neutral", "Sokovia Accords side"],
    correct: 1,
    category: 'mcu',
    difficulty: 'easy',
    explanation: "Tony Stark leads Team Iron Man in Captain America: Civil War, supporting the Sokovia Accords."
  },
  {
    id: 13,
    question: "What is the Mark LXXXV suit used for in Endgame?",
    options: ["Fighting Thanos", "Collecting stones", "Delivering the final snap", "Traveling in time"],
    correct: 2,
    category: 'suits',
    difficulty: 'hard',
    explanation: "The Mark LXXXV is the suit Tony uses to wield the Infinity Stones and deliver the final snap against Thanos."
  },
  {
    id: 14,
    question: "What does JARVIS stand for?",
    options: ["Just A Rather Very Intelligent System", "Jarvis Automated Response Vehicle Intelligence Service", "Joint Advanced Robot Very Intelligent System", "Justice And Response Very Intelligence System"],
    correct: 0,
    category: 'iron-man',
    difficulty: 'hard',
    explanation: "JARVIS stands for 'Just A Rather Very Intelligent System', Tony's original AI butler."
  },
  {
    id: 15,
    question: "Who created the first Iron Man suit with Tony?",
    options: ["Captain America", "Yinsen", "Pepper Potts", "Rhodey"],
    correct: 1,
    category: 'suits',
    difficulty: 'medium',
    explanation: "Ho Yinsen, a scientist Tony met in Afghanistan, helped him create the Mark I armor before sacrificing himself."
  },
  {
    id: 16,
    question: "What year was Iron Man released?",
    options: ["2006", "2007", "2008", "2009"],
    correct: 2,
    category: 'mcu',
    difficulty: 'medium',
    explanation: "Iron Man was released in 2008 and launched the entire Marvel Cinematic Universe."
  },
  {
    id: 17,
    question: "In Iron Man 3, what does Tony build with his armor technology?",
    options: ["A new AI", "Extremis soldiers", "Hundreds of armor suits", "A time machine"],
    correct: 2,
    category: 'suits',
    difficulty: 'hard',
    explanation: "In Iron Man 3, Tony builds the House Party Protocol, creating dozens of Iron Man suits controlled remotely."
  },
  {
    id: 18,
    question: "What metal are Tony's suits primarily made of?",
    options: ["Vibranium", "Gold-titanium alloy", "Adamantium", "Mithril"],
    correct: 1,
    category: 'suits',
    difficulty: 'hard',
    explanation: "Tony's suits are made of a gold-titanium alloy, which provides durability and maintains its iconic appearance."
  },
  {
    id: 19,
    question: "Which Iron Man suit is red and silver?",
    options: ["Mark I", "Mark III", "Mark V", "Mark II"],
    correct: 1,
    category: 'suits',
    difficulty: 'easy',
    explanation: "Most Iron Man suits are red and gold, but the Mark II was silver, shown in Iron Man 2."
  },
  {
    id: 20,
    question: "What is Tony's alter ego's full name?",
    options: ["Tony Stark", "Anthony Edward Stark", "Anthony Stark", "Tony Edward Stark"],
    correct: 1,
    category: 'tony-stark',
    difficulty: 'hard',
    explanation: "Tony Stark's full name is Anthony Edward Stark, as revealed throughout the MCU."
  }
];

export function getQuizzesByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): QuizQuestion[] {
  return MCU_QUIZ_QUESTIONS.filter(q => q.difficulty === difficulty);
}

export function getRandomQuiz(count: number = 10): QuizQuestion[] {
  const shuffled = [...MCU_QUIZ_QUESTIONS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export function getQuizzesByCategory(category: string): QuizQuestion[] {
  return MCU_QUIZ_QUESTIONS.filter(q => q.category === category);
}
