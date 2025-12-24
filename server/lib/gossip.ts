// Cross-character gossip/context system
// Detects when characters mention each other and stores shareable context

interface GossipEntry {
    from: string;          // Who said it (character ID)
    about: string;         // Who it's about (character ID)
    content: string;       // What was said
    timestamp: number;     // When it was said
    isFromTony: boolean;   // Was this Tony saying something, or the character?
}

// In-memory gossip storage (persists for server lifetime)
// In production, this should be in a database
const gossipStorage: GossipEntry[] = [];

// Character name mappings for detection
const CHARACTER_NAMES: Record<string, string[]> = {
    pepper: ['pepper', 'pep', 'potts', 'wife', 'mrs stark'],
    peter: ['peter', 'parker', 'spider-man', 'spidey', 'kid', 'underoos'],
    happy: ['happy', 'hogan', 'hap'],
    steve: ['steve', 'rogers', 'cap', 'captain', 'captain america', 'capsicle'],
    rhodey: ['rhodey', 'rhodes', 'james', 'war machine', 'iron patriot', 'platypus'],
    natasha: ['natasha', 'nat', 'romanoff', 'black widow', 'widow'],
    fury: ['fury', 'nick', 'director', 'pirate'],
    bruce: ['bruce', 'banner', 'hulk', 'big guy', 'other guy', 'green guy']
};

// Phrases that indicate sharing/telling
const SHARE_INDICATORS = [
    'tell', 'let .* know', 'say .* to', 'mention .* to', 'pass .* along',
    'give .* a message', 'inform', 'let .* hear', 'relay'
];

// Detect if a message is asking to share something with another character
export function detectGossipRequest(
    message: string,
    fromCharacterId: string
): { targetCharacter: string; content: string } | null {
    const lowerMessage = message.toLowerCase();

    // Check if message contains a share indicator
    const hasShareIndicator = SHARE_INDICATORS.some(pattern => {
        const regex = new RegExp(pattern, 'i');
        return regex.test(lowerMessage);
    });

    if (!hasShareIndicator) return null;

    // Find which character is being mentioned
    for (const [charId, names] of Object.entries(CHARACTER_NAMES)) {
        // Don't detect self-references
        if (charId === fromCharacterId) continue;

        const mentionsCharacter = names.some(name => lowerMessage.includes(name));

        if (mentionsCharacter) {
            // Extract what to tell them (simplified extraction)
            // Look for patterns like "tell X that Y" or "tell X I Y"
            const patterns = [
                /tell (?:him|her|them|[a-z]+) (?:that )?(.+)/i,
                /let (?:him|her|them|[a-z]+) know (?:that )?(.+)/i,
                /say (?:to (?:him|her|them|[a-z]+) )?(?:that )?(.+)/i,
                /mention (?:to (?:him|her|them|[a-z]+) )?(?:that )?(.+)/i,
            ];

            for (const pattern of patterns) {
                const match = message.match(pattern);
                if (match && match[1]) {
                    return {
                        targetCharacter: charId,
                        content: match[1].trim()
                    };
                }
            }

            // Fallback: just note that something about them was mentioned
            return {
                targetCharacter: charId,
                content: `something related to: "${message}"`
            };
        }
    }

    return null;
}

// Detect if a character's response mentions wanting to tell another character
export function detectCharacterGossip(
    response: string,
    fromCharacterId: string
): { targetCharacter: string; content: string }[] {
    const results: { targetCharacter: string; content: string }[] = [];
    const lowerResponse = response.toLowerCase();

    // Phrases indicating the character will tell someone
    const willTellPatterns = [
        "i'll tell", "i will tell", "i'm going to tell", "i'll let .* know",
        "i should tell", "i need to tell", "gonna tell", "i'll mention",
        "i'll pass that along", "i'll relay", "wait till .* hears"
    ];

    const hasTellIntent = willTellPatterns.some(pattern => {
        const regex = new RegExp(pattern, 'i');
        return regex.test(lowerResponse);
    });

    if (!hasTellIntent) return results;

    // Find which character they're going to tell
    for (const [charId, names] of Object.entries(CHARACTER_NAMES)) {
        if (charId === fromCharacterId) continue;

        const mentionsCharacter = names.some(name => lowerResponse.includes(name));

        if (mentionsCharacter) {
            results.push({
                targetCharacter: charId,
                content: `${getCharacterDisplayName(fromCharacterId)} said they would tell you about a recent conversation with Tony.`
            });
        }
    }

    return results;
}

// Store gossip entry
export function storeGossip(entry: GossipEntry): void {
    // Limit storage to prevent memory issues
    if (gossipStorage.length > 100) {
        gossipStorage.shift(); // Remove oldest
    }

    gossipStorage.push(entry);
    console.log(`[GOSSIP] Stored: ${entry.from} → ${entry.about}: "${entry.content.substring(0, 50)}..."`);
}

// Get gossip relevant to a character (things others have said about them)
export function getGossipForCharacter(characterId: string, maxAge: number = 3600000): GossipEntry[] {
    const now = Date.now();

    return gossipStorage.filter(entry =>
        entry.about === characterId &&
        (now - entry.timestamp) < maxAge
    );
}

// Get recent gossip context string for AI prompt
export function getGossipContext(characterId: string): string {
    const gossip = getGossipForCharacter(characterId);

    if (gossip.length === 0) return '';

    const lines = gossip.map(g => {
        const source = g.isFromTony
            ? 'Tony told ' + getCharacterDisplayName(g.from)
            : getCharacterDisplayName(g.from) + ' mentioned';
        return `- ${source}: "${g.content}"`;
    });

    return `\n*** RECENT GOSSIP/CONTEXT ***
You've heard through the grapevine (or been told directly):
${lines.join('\n')}
You can reference this naturally if it comes up, but don't force it.`;
}

// Clear old gossip (call periodically)
export function clearOldGossip(maxAge: number = 3600000): void {
    const now = Date.now();
    const before = gossipStorage.length;

    // Filter in place
    for (let i = gossipStorage.length - 1; i >= 0; i--) {
        if ((now - gossipStorage[i].timestamp) > maxAge) {
            gossipStorage.splice(i, 1);
        }
    }

    const removed = before - gossipStorage.length;
    if (removed > 0) {
        console.log(`[GOSSIP] Cleared ${removed} old entries`);
    }
}

// Helper: Get display name for character
function getCharacterDisplayName(charId: string): string {
    const names: Record<string, string> = {
        pepper: 'Pepper',
        peter: 'Peter',
        happy: 'Happy',
        steve: 'Steve',
        rhodey: 'Rhodey',
        natasha: 'Natasha',
        fury: 'Fury',
        bruce: 'Bruce'
    };
    return names[charId] || charId;
}
