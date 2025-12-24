// Simple sentiment and anger analysis for phone chat
// Returns deltas for relationship and anger based on message content

interface SentimentResult {
    relationshipDelta: number;  // -10 to +10
    angerDelta: number;         // 0 to +30 (Bruce only)
    detectedMood: 'positive' | 'negative' | 'neutral' | 'provocative';
}

// Words that increase Bruce's anger
const ANGER_TRIGGERS = [
    'hulk', 'green', 'smash', 'angry', 'monster', 'beast', 'rage',
    'transform', 'gamma', 'other guy', 'big guy', 'green guy',
    'lose control', 'calm down', 'relax', 'chill out',
    'scary', 'dangerous', 'threat', 'weapon', 'experiment',
    'abomination', 'ross', 'general', 'military', 'cage', 'contain'
];

// Words that decrease anger / calm Bruce
const CALM_TRIGGERS = [
    'science', 'research', 'lab', 'calculations', 'physics',
    'friend', 'trust', 'help', 'together', 'team',
    'sorry', 'understand', 'safe', 'okay', 'fine',
    'brilliant', 'genius', 'smart', 'doctor'
];

// Positive words for relationship
const POSITIVE_WORDS = [
    'love', 'thanks', 'thank', 'appreciate', 'great', 'awesome',
    'amazing', 'incredible', 'friend', 'buddy', 'pal', 'miss you',
    'proud', 'happy', 'glad', 'excited', 'help', 'sorry',
    'trust', 'care', 'support', 'team', 'together'
];

// Negative words for relationship
const NEGATIVE_WORDS = [
    'hate', 'stupid', 'idiot', 'dumb', 'useless', 'pathetic',
    'annoying', 'shut up', 'go away', 'leave', 'boring',
    'worst', 'terrible', 'awful', 'disappointment', 'failure',
    'blame', 'fault', 'mistake', 'wrong', 'liar'
];

// Provocative phrases specifically designed to trigger Hulk
const PROVOCATIVE_PHRASES = [
    'make you angry', 'gonna hulk', 'turn green', 'lose it',
    'bet you can\'t', 'prove you\'re', 'scared', 'coward',
    'can\'t control', 'always angry', 'just a monster'
];

export function analyzeSentiment(message: string, characterId: string): SentimentResult {
    const lowerMessage = message.toLowerCase();

    let relationshipDelta = 0;
    let angerDelta = 0;
    let detectedMood: SentimentResult['detectedMood'] = 'neutral';

    // Count positive and negative words
    let positiveCount = 0;
    let negativeCount = 0;

    for (const word of POSITIVE_WORDS) {
        if (lowerMessage.includes(word)) {
            positiveCount++;
        }
    }

    for (const word of NEGATIVE_WORDS) {
        if (lowerMessage.includes(word)) {
            negativeCount++;
        }
    }

    // Calculate relationship delta
    if (positiveCount > negativeCount) {
        relationshipDelta = Math.min(5, positiveCount * 2);
        detectedMood = 'positive';
    } else if (negativeCount > positiveCount) {
        relationshipDelta = -Math.min(8, negativeCount * 3);
        detectedMood = 'negative';
    }

    // Special handling for Bruce Banner - anger meter
    if (characterId === 'bruce') {
        // Check for provocative phrases first (big anger boost)
        for (const phrase of PROVOCATIVE_PHRASES) {
            if (lowerMessage.includes(phrase)) {
                angerDelta += 20;
                detectedMood = 'provocative';
            }
        }

        // Check anger triggers
        for (const trigger of ANGER_TRIGGERS) {
            if (lowerMessage.includes(trigger)) {
                angerDelta += 8;
            }
        }

        // Check calm triggers (reduce anger)
        for (const trigger of CALM_TRIGGERS) {
            if (lowerMessage.includes(trigger)) {
                angerDelta -= 5;
            }
        }

        // Ensure anger delta is at least 0 (can't go negative for individual message)
        // But calm triggers can offset anger triggers
        angerDelta = Math.max(-10, angerDelta);

        // Add small random fluctuation
        angerDelta += Math.floor(Math.random() * 3) - 1;

        // If message is just neutral small talk, small anger increase (Bruce is always a bit on edge)
        if (angerDelta === 0 && detectedMood === 'neutral') {
            angerDelta = Math.random() > 0.7 ? 2 : 0;
        }
    }

    return {
        relationshipDelta,
        angerDelta,
        detectedMood
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
