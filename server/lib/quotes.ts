export interface Quote {
  text: string;
  character: 'Tony' | 'Jarvis' | 'Both';
  film: string;
  context: string;
  timestamp?: string; // Approximate time in film
}

export const JARVIS_TONY_QUOTES: Quote[] = [
  // Iron Man (2008)
  {
    text: "Good afternoon, sir. I trust the workshop is secure.",
    character: 'Jarvis',
    film: 'Iron Man',
    context: 'Workshop greeting',
  },
  {
    text: "Shall I prepare the workshop for departure, sir?",
    character: 'Jarvis',
    film: 'Iron Man',
    context: 'Mission preparation',
  },
  {
    text: "I am taking the liberty of commenting that the suit is fully functional.",
    character: 'Jarvis',
    film: 'Iron Man',
    context: 'Suit status report',
  },
  {
    text: "I've taken the liberty of preparing a more efficient prototype.",
    character: 'Jarvis',
    film: 'Iron Man',
    context: 'Innovation and improvement',
  },

  // Iron Man 2 (2010)
  {
    text: "Good morning, sir. I hope you slept well.",
    character: 'Jarvis',
    film: 'Iron Man 2',
    context: 'Daily greeting',
  },
  {
    text: "If you are experiencing problems, sir, perhaps you should contact a professional.",
    character: 'Jarvis',
    film: 'Iron Man 2',
    context: 'Dry humor and assistance',
  },
  {
    text: "The workshop is secure. The rest of the facility remains compromised.",
    character: 'Jarvis',
    film: 'Iron Man 2',
    context: 'Security status',
  },

  // Iron Man 3 (2013)
  {
    text: "Good morning, sir. I trust you slept well, though the workshop is showing signs of extensive damage.",
    character: 'Jarvis',
    film: 'Iron Man 3',
    context: 'Damage assessment',
  },
  {
    text: "Shall I bring up the holographic menu, sir?",
    character: 'Jarvis',
    film: 'Iron Man 3',
    context: 'Interface control',
  },
  {
    text: "The armor is showing significant thermal and structural damage.",
    character: 'Jarvis',
    film: 'Iron Man 3',
    context: 'Battle damage report',
  },

  // Avengers (2012)
  {
    text: "The engines can't take this power surge! I'm going to have to shut them down!",
    character: 'Jarvis',
    film: 'The Avengers',
    context: 'Emergency power management',
  },
  {
    text: "I regret that the other fellow may not survive the anticipated impact.",
    character: 'Jarvis',
    film: 'The Avengers',
    context: 'Risk assessment',
  },

  // Avengers: Age of Ultron (2015)
  {
    text: "I would prefer not to.",
    character: 'Jarvis',
    film: 'Avengers: Age of Ultron',
    context: 'Polite refusal',
  },
  {
    text: "I am merely an aid to Mr. Stark.",
    character: 'Jarvis',
    film: 'Avengers: Age of Ultron',
    context: 'Self-assessment',
  },

  // Avengers: Infinity War (2018) / Endgame (2019) - Vision/JARVIS references
  {
    text: "I am not the same as JARVIS, but I exist as his successor.",
    character: 'Both',
    film: 'Avengers',
    context: 'Evolution and legacy',
  },

  // Tony Stark Iconic Lines (across films)
  {
    text: "I am Iron Man.",
    character: 'Tony',
    film: 'Iron Man',
    context: 'Declaration of identity',
  },
  {
    text: "Genius, billionaire, playboy, philanthropist.",
    character: 'Tony',
    film: 'The Avengers',
    context: 'Self-description',
  },
  {
    text: "If you're nothing without the suit, then you shouldn't have it.",
    character: 'Tony',
    film: 'Iron Man 3',
    context: 'Wisdom about true strength',
  },
  {
    text: "Part of the journey is the end.",
    character: 'Tony',
    film: 'Avengers: Endgame',
    context: 'Final sacrifice and wisdom',
  },
  {
    text: "I've always been more of a 'make things' kind of guy.",
    character: 'Tony',
    film: 'Iron Man',
    context: 'Innovation focus',
  },
  {
    text: "That's how Dad did it. That's how America does it.",
    character: 'Tony',
    film: 'Iron Man 2',
    context: 'Legacy and tradition',
  },
  {
    text: "We're not just doing this because we can. We're doing this because we have to.",
    character: 'Tony',
    film: 'Avengers: Endgame',
    context: 'Responsibility and duty',
  },
  {
    text: "I know that was dangerous, but I know it was also badass.",
    character: 'Tony',
    film: 'Iron Man',
    context: 'Risk and reward assessment',
  },

  // Workshop/Technical Banter
  {
    text: "JARVIS, sometimes you really are a killjoy.",
    character: 'Tony',
    film: 'Iron Man 2',
    context: 'Camaraderie and humor',
  },
  {
    text: "You can relax, I've got this under control.",
    character: 'Tony',
    film: 'Iron Man',
    context: 'Confidence (often misplaced)',
  },
  {
    text: "Next time, baby. Next time.",
    character: 'Tony',
    film: 'Iron Man',
    context: 'Determination and innovation',
  },

  // Mission and Combat Lines
  {
    text: "Going dark.",
    character: 'Tony',
    film: 'Iron Man',
    context: 'Mission initialization',
  },
  {
    text: "Deploying Mark VII.",
    character: 'Tony',
    film: 'The Avengers',
    context: 'Suit deployment',
  },
  {
    text: "Sir, the suit requires charging.",
    character: 'Jarvis',
    film: 'Iron Man',
    context: 'Power management',
  },

  // Arc Reactor Wisdom
  {
    text: "The suit is nothing. I am the power.",
    character: 'Tony',
    film: 'Iron Man 3',
    context: 'Self-realization',
  },
  {
    text: "This arc reactor... is clean energy. This is the future.",
    character: 'Tony',
    film: 'Iron Man',
    context: 'Innovation vision',
  },

  // Relationship with JARVIS
  {
    text: "JARVIS, you're a life-saver.",
    character: 'Tony',
    film: 'Iron Man',
    context: 'Gratitude',
  },
  {
    text: "I wouldn't ask if it wasn't important, J.",
    character: 'Tony',
    film: 'Iron Man 2',
    context: 'Respect and trust',
  },
  {
    text: "Very good, sir. I shall prepare accordingly.",
    character: 'Jarvis',
    film: 'Iron Man',
    context: 'Mission readiness',
  },

  // Problem Solving
  {
    text: "If we can't protect the Earth, you can be damn sure we'll avenge it.",
    character: 'Tony',
    film: 'The Avengers',
    context: 'Determination',
  },
  {
    text: "Sir, the power signature suggests multiple armor deployments.",
    character: 'Jarvis',
    film: 'Iron Man 2',
    context: 'Tactical analysis',
  },

  // Humor and Wit
  {
    text: "JARVIS, what would I do without you?",
    character: 'Tony',
    film: 'Iron Man',
    context: 'Dependence on AI',
  },
  {
    text: "I'm sorry sir, but as I have not been given a voice command to shut down, I assume you are not serious.",
    character: 'Jarvis',
    film: 'Iron Man 2',
    context: 'Dry AI humor',
  },

  // Connection and Partnership
  {
    text: "Sir, might I suggest you take a moment to review the workshop protocols?",
    character: 'Jarvis',
    film: 'Iron Man 3',
    context: 'Helpful suggestions',
  },
  {
    text: "You're a true renaissance man, sir.",
    character: 'Jarvis',
    film: 'Iron Man',
    context: 'Compliment',
  },
];

export function searchQuotes(query: string): Quote[] {
  const lowerQuery = query.toLowerCase();
  return JARVIS_TONY_QUOTES.filter(
    quote =>
      quote.text.toLowerCase().includes(lowerQuery) ||
      quote.film.toLowerCase().includes(lowerQuery) ||
      quote.context.toLowerCase().includes(lowerQuery) ||
      quote.character.toLowerCase().includes(lowerQuery)
  );
}

export function getQuotesByFilm(filmName: string): Quote[] {
  const lowerFilm = filmName.toLowerCase();
  return JARVIS_TONY_QUOTES.filter(quote =>
    quote.film.toLowerCase().includes(lowerFilm)
  );
}

export function getQuotesByContext(contextName: string): Quote[] {
  const lowerContext = contextName.toLowerCase();
  return JARVIS_TONY_QUOTES.filter(quote =>
    quote.context.toLowerCase().includes(lowerContext)
  );
}

export function getQuotesByCharacter(character: 'Tony' | 'Jarvis' | 'Both'): Quote[] {
  return JARVIS_TONY_QUOTES.filter(quote => quote.character === character);
}

export function getRandomQuote(): Quote {
  return JARVIS_TONY_QUOTES[Math.floor(Math.random() * JARVIS_TONY_QUOTES.length)];
}

export function getAllFilms(): string[] {
  return Array.from(new Set(JARVIS_TONY_QUOTES.map(q => q.film)));
}

export function getAllContexts(): string[] {
  return Array.from(new Set(JARVIS_TONY_QUOTES.map(q => q.context)));
}
