// Advanced character-specific sentiment analysis
// Each character has unique emotional triggers based on MCU lore

interface SentimentResult {
    relationshipDelta: number;  // -15 to +10
    angerDelta: number;         // -10 to +40 (character-specific)
    detectedMood: 'positive' | 'negative' | 'neutral' | 'provocative' | 'sensitive';
    triggerReason?: string;     // Explanation of what triggered the reaction
}

// ==================== CHARACTER-SPECIFIC TRIGGERS ====================

interface CharacterProfile {
    // People they love/care about - insulting them causes BIG negative reaction
    lovedOnes: { name: string; triggers: string[]; angerBoost: number; relationshipPenalty: number }[];

    // Topics they're sensitive about
    sensitiveTriggers: { triggers: string[]; angerBoost: number; relationshipPenalty: number; reason: string }[];

    // Things that calm them down / make them happy
    calmTriggers: { triggers: string[]; angerReduction: number; relationshipBoost: number }[];

    // Base anger increment per message (how easily they get mad)
    baseAngerIncrement: number;

    // Anger decay per calm message
    calmDecay: number;
}

const CHARACTER_PROFILES: Record<string, CharacterProfile> = {
    bruce: {
        // Bruce is VERY hard to anger normally, but has specific triggers
        baseAngerIncrement: 1, // Very low base anger
        calmDecay: 5,

        lovedOnes: [
            {
                name: 'Natasha',
                triggers: ['natasha', 'black widow', 'romanoff', 'nat'],
                angerBoost: 25, // BIG spike if you insult her
                relationshipPenalty: 10
            }
        ],

        sensitiveTriggers: [
            {
                triggers: ['monster', 'beast', 'freak', 'abomination', 'weapon'],
                angerBoost: 20,
                relationshipPenalty: 8,
                reason: 'Bruce hates being called a monster'
            },
            {
                triggers: ['hulk smash', 'big green', 'other guy', 'the hulk'],
                angerBoost: 15,
                relationshipPenalty: 5,
                reason: 'References to Hulk make Bruce uncomfortable'
            },
            {
                triggers: ['cage', 'contain', 'lock up', 'dangerous', 'threat', 'ross', 'general', 'military'],
                angerBoost: 18,
                relationshipPenalty: 6,
                reason: 'Bruce has trauma from being hunted'
            },
            {
                triggers: ['lose control', 'can\'t control', 'out of control', 'unleash'],
                angerBoost: 22,
                relationshipPenalty: 7,
                reason: 'Bruce fears losing control'
            },
            {
                triggers: ['angry', 'mad', 'rage', 'furious', 'temper'],
                angerBoost: 12,
                relationshipPenalty: 3,
                reason: 'Pointing out anger makes it worse'
            },
            {
                triggers: ['gamma', 'radiation', 'experiment', 'accident'],
                angerBoost: 10,
                relationshipPenalty: 4,
                reason: 'References to his origin are painful'
            }
        ],

        calmTriggers: [
            {
                triggers: ['science', 'research', 'physics', 'lab', 'calculate', 'theory'],
                angerReduction: 8,
                relationshipBoost: 3
            },
            {
                triggers: ['friend', 'trust', 'safe', 'okay', 'calm', 'relax', 'breathe'],
                angerReduction: 6,
                relationshipBoost: 2
            },
            {
                triggers: ['brilliant', 'genius', 'doctor', 'dr banner', 'smart'],
                angerReduction: 5,
                relationshipBoost: 4
            },
            {
                triggers: ['help', 'need you', 'team', 'together', 'avengers'],
                angerReduction: 4,
                relationshipBoost: 3
            }
        ]
    },

    peter: {
        baseAngerIncrement: 0, // Peter doesn't really get angry, just sad
        calmDecay: 0,

        lovedOnes: [
            {
                name: 'Aunt May',
                triggers: ['may', 'aunt may', 'aunt'],
                angerBoost: 0,
                relationshipPenalty: 15 // Insulting May = big relationship hit
            },
            {
                name: 'Tony Stark',
                triggers: ['mr stark', 'tony', 'iron man'],
                angerBoost: 0,
                relationshipPenalty: 12 // Insulting his mentor hurts
            },
            {
                name: 'MJ',
                triggers: ['mj', 'michelle', 'girlfriend'],
                angerBoost: 0,
                relationshipPenalty: 10
            }
        ],

        sensitiveTriggers: [
            {
                triggers: ['kid', 'child', 'baby', 'amateur', 'sidekick', 'junior'],
                angerBoost: 0,
                relationshipPenalty: 8,
                reason: 'Peter is sensitive about being treated like a kid'
            },
            {
                triggers: ['uncle ben', 'ben', 'responsibility'],
                angerBoost: 0,
                relationshipPenalty: 10,
                reason: 'Uncle Ben is a painful memory'
            },
            {
                triggers: ['failure', 'not good enough', 'disappoint', 'mistake'],
                angerBoost: 0,
                relationshipPenalty: 7,
                reason: 'Peter fears disappointing Tony'
            }
        ],

        calmTriggers: [
            {
                triggers: ['proud', 'good job', 'impressed', 'amazing', 'great work'],
                angerReduction: 0,
                relationshipBoost: 8
            },
            {
                triggers: ['avenger', 'hero', 'spider-man', 'spidey'],
                angerReduction: 0,
                relationshipBoost: 5
            },
            {
                triggers: ['suit', 'upgrade', 'new tech', 'web shooter'],
                angerReduction: 0,
                relationshipBoost: 6
            },
            {
                triggers: ['star wars', 'movie', 'meme', 'lego'],
                angerReduction: 0,
                relationshipBoost: 4
            }
        ]
    },

    pepper: {
        baseAngerIncrement: 2,
        calmDecay: 3,

        lovedOnes: [
            {
                name: 'Morgan',
                triggers: ['morgan', 'daughter', 'our daughter', 'baby'],
                angerBoost: 5,
                relationshipPenalty: 12
            }
        ],

        sensitiveTriggers: [
            {
                triggers: ['reckless', 'dangerous', 'stupid', 'irresponsible'],
                angerBoost: 8,
                relationshipPenalty: 5,
                reason: 'Pepper hates when Tony is reckless'
            },
            {
                triggers: ['died', 'death', 'funeral', 'gone', 'lost you'],
                angerBoost: 3,
                relationshipPenalty: 8,
                reason: 'Pepper has trauma from almost losing Tony'
            },
            {
                triggers: ['work', 'company', 'business', 'meeting', 'board'],
                angerBoost: 4,
                relationshipPenalty: 2,
                reason: 'Pepper is stressed about Stark Industries'
            }
        ],

        calmTriggers: [
            {
                triggers: ['love', 'love you', '3000', 'i love you'],
                angerReduction: 10,
                relationshipBoost: 8
            },
            {
                triggers: ['dinner', 'home', 'family', 'together'],
                angerReduction: 6,
                relationshipBoost: 5
            },
            {
                triggers: ['sorry', 'apologize', 'my fault', 'you\'re right'],
                angerReduction: 8,
                relationshipBoost: 6
            }
        ]
    },

    steve: {
        baseAngerIncrement: 2,
        calmDecay: 4,

        lovedOnes: [
            {
                name: 'Bucky',
                triggers: ['bucky', 'barnes', 'winter soldier', 'james'],
                angerBoost: 20,
                relationshipPenalty: 12
            },
            {
                name: 'Peggy',
                triggers: ['peggy', 'carter', 'agent carter'],
                angerBoost: 5,
                relationshipPenalty: 8
            }
        ],

        sensitiveTriggers: [
            {
                triggers: ['old', 'fossil', 'out of touch', 'grandpa', 'boomer', 'old fashioned'],
                angerBoost: 10,
                relationshipPenalty: 6,
                reason: 'Steve is sensitive about being from another era'
            },
            {
                triggers: ['hydra', 'nazi', 'red skull', 'zola'],
                angerBoost: 15,
                relationshipPenalty: 5,
                reason: 'Steve fought against Hydra his whole life'
            },
            {
                triggers: ['wrong', 'illegal', 'corrupt', 'unjust'],
                angerBoost: 8,
                relationshipPenalty: 3,
                reason: 'Steve has strong moral principles'
            }
        ],

        calmTriggers: [
            {
                triggers: ['duty', 'honor', 'country', 'right thing', 'freedom'],
                angerReduction: 6,
                relationshipBoost: 5
            },
            {
                triggers: ['team', 'together', 'avengers', 'assemble'],
                angerReduction: 5,
                relationshipBoost: 4
            },
            {
                triggers: ['friend', 'trust', 'respect'],
                angerReduction: 4,
                relationshipBoost: 4
            }
        ]
    },

    rhodey: {
        baseAngerIncrement: 3,
        calmDecay: 4,

        lovedOnes: [
            {
                name: 'Tony',
                triggers: ['tony', 'stark', 'iron man'],
                angerBoost: 5,
                relationshipPenalty: 10 // Insulting his best friend
            }
        ],

        sensitiveTriggers: [
            {
                triggers: ['sidekick', 'second', 'backup', 'supporting'],
                angerBoost: 12,
                relationshipPenalty: 7,
                reason: 'Rhodey is not a sidekick, he\'s War Machine'
            },
            {
                triggers: ['legs', 'walk', 'paralyzed', 'accident', 'fell'],
                angerBoost: 8,
                relationshipPenalty: 8,
                reason: 'Rhodey has trauma from his injury in Civil War'
            },
            {
                triggers: ['military', 'pentagon', 'orders', 'classified'],
                angerBoost: 5,
                relationshipPenalty: 3,
                reason: 'Rhodey is caught between duty and friendship'
            }
        ],

        calmTriggers: [
            {
                triggers: ['mit', 'college', 'old times', 'remember when'],
                angerReduction: 6,
                relationshipBoost: 6
            },
            {
                triggers: ['war machine', 'iron patriot', 'colonel'],
                angerReduction: 4,
                relationshipBoost: 4
            },
            {
                triggers: ['brother', 'best friend', 'ride or die'],
                angerReduction: 8,
                relationshipBoost: 7
            }
        ]
    },

    natasha: {
        baseAngerIncrement: 1, // Very controlled
        calmDecay: 2,

        lovedOnes: [
            {
                name: 'Clint',
                triggers: ['clint', 'barton', 'hawkeye', 'archer'],
                angerBoost: 15,
                relationshipPenalty: 10
            },
            {
                name: 'Bruce',
                triggers: ['bruce', 'banner', 'hulk'],
                angerBoost: 10,
                relationshipPenalty: 8
            }
        ],

        sensitiveTriggers: [
            {
                triggers: ['red room', 'training', 'assassin', 'killer', 'murderer'],
                angerBoost: 12,
                relationshipPenalty: 8,
                reason: 'Natasha\'s past haunts her'
            },
            {
                triggers: ['red', 'ledger', 'debt', 'blood', 'hands'],
                angerBoost: 10,
                relationshipPenalty: 6,
                reason: 'References to her ledger cut deep'
            },
            {
                triggers: ['trust', 'liar', 'spy', 'double agent', 'traitor'],
                angerBoost: 8,
                relationshipPenalty: 5,
                reason: 'Natasha struggles with trust issues'
            }
        ],

        calmTriggers: [
            {
                triggers: ['friend', 'family', 'avengers', 'home'],
                angerReduction: 5,
                relationshipBoost: 5
            },
            {
                triggers: ['mission', 'intel', 'strategy', 'plan'],
                angerReduction: 3,
                relationshipBoost: 3
            }
        ]
    },

    fury: {
        baseAngerIncrement: 5, // Fury has less patience
        calmDecay: 2,

        lovedOnes: [
            {
                name: 'SHIELD',
                triggers: ['shield', 'agents', 'coulson', 'hill'],
                angerBoost: 12,
                relationshipPenalty: 10
            },
            {
                name: 'Carol',
                triggers: ['carol', 'captain marvel', 'danvers'],
                angerBoost: 8,
                relationshipPenalty: 8
            }
        ],

        sensitiveTriggers: [
            {
                triggers: ['eye', 'patch', 'blind', 'one eye', 'pirate'],
                angerBoost: 15,
                relationshipPenalty: 8,
                reason: 'Never mention the eye'
            },
            {
                triggers: ['question', 'wrong', 'mistake', 'failed'],
                angerBoost: 10,
                relationshipPenalty: 5,
                reason: 'Fury doesn\'t like being questioned'
            },
            {
                triggers: ['trust', 'secrets', 'lying', 'hiding'],
                angerBoost: 8,
                relationshipPenalty: 4,
                reason: 'Fury keeps secrets for good reasons'
            }
        ],

        calmTriggers: [
            {
                triggers: ['avengers', 'initiative', 'team', 'assemble'],
                angerReduction: 5,
                relationshipBoost: 4
            },
            {
                triggers: ['results', 'mission complete', 'success', 'handled'],
                angerReduction: 6,
                relationshipBoost: 5
            },
            {
                triggers: ['respect', 'director', 'sir'],
                angerReduction: 4,
                relationshipBoost: 3
            }
        ]
    },

    happy: {
        baseAngerIncrement: 4, // Happy is often annoyed
        calmDecay: 3,

        lovedOnes: [
            {
                name: 'Pepper',
                triggers: ['pepper', 'potts', 'ms potts'],
                angerBoost: 8,
                relationshipPenalty: 10
            },
            {
                name: 'Tony',
                triggers: ['tony', 'boss', 'stark'],
                angerBoost: 5,
                relationshipPenalty: 8
            }
        ],

        sensitiveTriggers: [
            {
                triggers: ['fat', 'old', 'slow', 'useless', 'bodyguard'],
                angerBoost: 12,
                relationshipPenalty: 8,
                reason: 'Happy is sensitive about his capabilities'
            },
            {
                triggers: ['peter', 'kid', 'spider', 'calls', 'texting'],
                angerBoost: 6,
                relationshipPenalty: 2,
                reason: 'Happy is constantly bothered by Peter'
            },
            {
                triggers: ['boxing', 'fight', 'foreman'],
                angerBoost: 0,
                relationshipPenalty: 0,
                reason: 'Happy actually likes talking about boxing'
            }
        ],

        calmTriggers: [
            {
                triggers: ['boxing', 'ring', 'fight', 'champion'],
                angerReduction: 6,
                relationshipBoost: 5
            },
            {
                triggers: ['security', 'safe', 'protected', 'handled'],
                angerReduction: 4,
                relationshipBoost: 4
            },
            {
                triggers: ['raise', 'bonus', 'appreciate', 'good job'],
                angerReduction: 8,
                relationshipBoost: 6
            }
        ]
    }
};

// ==================== SENTIMENT ANALYSIS ====================

export function analyzeSentiment(message: string, characterId: string): SentimentResult {
    const lowerMessage = message.toLowerCase();
    const profile = CHARACTER_PROFILES[characterId];

    // Default response for unknown characters
    if (!profile) {
        return {
            relationshipDelta: 0,
            angerDelta: 0,
            detectedMood: 'neutral'
        };
    }

    let relationshipDelta = 0;
    let angerDelta = 0;
    let detectedMood: SentimentResult['detectedMood'] = 'neutral';
    let triggerReason: string | undefined;

    // Check for NEGATIVE context around loved ones (insulting them)
    const negativeContext = ['hate', 'stupid', 'dumb', 'ugly', 'annoying', 'worst', 'suck', 'bad', 'terrible', 'awful'];
    const hasNegativeContext = negativeContext.some(word => lowerMessage.includes(word));

    // Check loved ones triggers
    for (const loved of profile.lovedOnes) {
        const mentionsLovedOne = loved.triggers.some(trigger => lowerMessage.includes(trigger));

        if (mentionsLovedOne && hasNegativeContext) {
            // Insulting someone they love = BIG reaction
            angerDelta += loved.angerBoost;
            relationshipDelta -= loved.relationshipPenalty;
            detectedMood = 'provocative';
            triggerReason = `You insulted ${loved.name}!`;
            console.log(`[SENTIMENT] 🔥 ${characterId} triggered by insult to ${loved.name}: anger +${loved.angerBoost}`);
        } else if (mentionsLovedOne && !hasNegativeContext) {
            // Mentioning them positively = slight boost
            relationshipDelta += 2;
        }
    }

    // Check sensitive triggers
    for (const sensitive of profile.sensitiveTriggers) {
        const triggered = sensitive.triggers.some(trigger => lowerMessage.includes(trigger));

        if (triggered) {
            angerDelta += sensitive.angerBoost;
            relationshipDelta -= sensitive.relationshipPenalty;
            detectedMood = 'sensitive';
            triggerReason = sensitive.reason;
            console.log(`[SENTIMENT] ⚡ ${characterId} sensitive trigger: "${sensitive.triggers[0]}" - ${sensitive.reason}`);
        }
    }

    // Check calm triggers
    for (const calm of profile.calmTriggers) {
        const triggered = calm.triggers.some(trigger => lowerMessage.includes(trigger));

        if (triggered && detectedMood !== 'provocative') {
            angerDelta -= calm.angerReduction;
            relationshipDelta += calm.relationshipBoost;
            if (detectedMood === 'neutral') {
                detectedMood = 'positive';
            }
            console.log(`[SENTIMENT] 💚 ${characterId} calmed by: "${calm.triggers[0]}"`);
        }
    }

    // Apply base anger increment if no specific triggers
    if (angerDelta === 0 && characterId === 'bruce') {
        // Small random chance of slight anger increase even with neutral messages
        if (Math.random() > 0.8) {
            angerDelta = profile.baseAngerIncrement;
        }
    }

    // General positive/negative word detection for relationship
    const generalPositive = ['thanks', 'thank you', 'appreciate', 'great', 'awesome', 'love'];
    const generalNegative = ['hate', 'stupid', 'shut up', 'annoying', 'useless', 'pathetic'];

    if (generalPositive.some(w => lowerMessage.includes(w)) && detectedMood === 'neutral') {
        relationshipDelta += 2;
        detectedMood = 'positive';
    }

    if (generalNegative.some(w => lowerMessage.includes(w)) && detectedMood === 'neutral') {
        relationshipDelta -= 3;
        detectedMood = 'negative';
    }

    return {
        relationshipDelta: Math.max(-15, Math.min(10, relationshipDelta)),
        angerDelta: Math.max(-10, Math.min(40, angerDelta)),
        detectedMood,
        triggerReason
    };
}

// Get relationship level name from score
export function getRelationshipLevel(score: number): { name: string; emoji: string; color: string } {
    if (score >= 80) return { name: 'Best Friend', emoji: '❤️', color: 'text-red-500' };
    if (score >= 60) return { name: 'Close Friend', emoji: '💛', color: 'text-yellow-500' };
    if (score >= 40) return { name: 'Friend', emoji: '💚', color: 'text-green-500' };
    if (score >= 20) return { name: 'Acquaintance', emoji: '💙', color: 'text-blue-500' };
    return { name: 'Distant', emoji: '⚪', color: 'text-gray-500' };
}

// Get anger level description
export function getAngerDescription(anger: number): { status: string; color: string; warning: boolean } {
    if (anger >= 90) return { status: 'CRITICAL', color: 'bg-red-600', warning: true };
    if (anger >= 70) return { status: 'Dangerous', color: 'bg-orange-500', warning: true };
    if (anger >= 50) return { status: 'Agitated', color: 'bg-yellow-500', warning: false };
    if (anger >= 30) return { status: 'Tense', color: 'bg-lime-500', warning: false };
    return { status: 'Calm', color: 'bg-green-500', warning: false };
}
