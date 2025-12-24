import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { X, ChevronLeft, Send, Phone, Signal, Wifi, Battery, User } from 'lucide-react';

// Character data with Tony's nicknames and personalities
// Using real Marvel movie images
const CONTACTS = [
    {
        id: 'pepper',
        nickname: 'Pep ❤️',
        realName: 'Pepper Potts',
        avatarUrl: '/api/assets/profile_pictures/pepper.png',
        status: 'CEO, Stark Industries',
        color: 'from-orange-500 to-red-500',
        spamLevel: 'low', // Pepper is patient
        history: [
            { from: 'pepper', text: "Tony, you missed the board meeting. Again.", time: '9:14 AM' },
            { from: 'tony', text: "In my defense, I was saving the world.", time: '9:15 AM' },
            { from: 'pepper', text: "You were in the lab eating a cheeseburger.", time: '9:15 AM' },
            { from: 'tony', text: "...A world-saving cheeseburger.", time: '9:16 AM' },
            { from: 'pepper', text: "I love you 3000, but you're impossible.", time: '9:17 AM' },
            { from: 'tony', text: "That's why you married me 😎", time: '9:17 AM' },
            { from: 'pepper', text: "Dinner reservation at 8. Don't be late.", time: '9:18 AM' },
            { from: 'tony', text: "I'm never late. I arrive precisely when I mean to.", time: '9:18 AM' },
            { from: 'pepper', text: "That's Gandalf. You're always late.", time: '9:19 AM' },
        ]
    },
    {
        id: 'peter',
        nickname: 'Underoos 🕷️',
        realName: 'Peter Parker',
        avatarUrl: '/api/assets/profile_pictures/peter.png',
        status: 'Friendly Neighborhood...',
        color: 'from-red-500 to-blue-600',
        spamLevel: 'extreme', // Peter SPAMS like crazy
        history: [
            { from: 'peter', text: "Mr. Stark!!", time: '3:42 PM' },
            { from: 'peter', text: "Mr. Stark are you there??", time: '3:42 PM' },
            { from: 'peter', text: "I found something REALLY weird", time: '3:42 PM' },
            { from: 'peter', text: "Like REALLY really weird", time: '3:42 PM' },
            { from: 'peter', text: "Should I check it out?", time: '3:43 PM' },
            { from: 'peter', text: "I'm gonna check it out", time: '3:43 PM' },
            { from: 'peter', text: "Actually maybe I shouldn't", time: '3:43 PM' },
            { from: 'peter', text: "But it could be important!!", time: '3:43 PM' },
            { from: 'peter', text: "OK I'm checking it out", time: '3:44 PM' },
            { from: 'peter', text: "Mr Stark???", time: '3:44 PM' },
            { from: 'peter', text: "Hello????", time: '3:44 PM' },
            { from: 'tony', text: "Kid. Breathe.", time: '3:45 PM' },
            { from: 'peter', text: "OH HI MR STARK", time: '3:45 PM' },
            { from: 'peter', text: "So anyway there's this thing", time: '3:45 PM' },
            { from: 'peter', text: "And it's glowing", time: '3:45 PM' },
            { from: 'peter', text: "Should it be glowing?", time: '3:45 PM' },
            { from: 'tony', text: "Probably not. Stay there.", time: '3:46 PM' },
            { from: 'peter', text: "OMG are you coming here??", time: '3:46 PM' },
            { from: 'peter', text: "This is SO COOL", time: '3:46 PM' },
            { from: 'peter', text: "Wait Mr Stark one more thing", time: '3:47 PM' },
            { from: 'peter', text: "Can I get a raise on my suit allowance?", time: '3:47 PM' },
            { from: 'peter', text: "I promise I won't web-sling into any more buildings", time: '3:47 PM' },
            { from: 'tony', text: "You don't get a salary, kid.", time: '3:48 PM' },
            { from: 'peter', text: "That seems like an oversight tbh", time: '3:48 PM' },
        ]
    },
    {
        id: 'happy',
        nickname: 'Hap 🥊',
        realName: 'Happy Hogan',
        avatarUrl: '/api/assets/profile_pictures/happy.png',
        status: 'Head of Security',
        color: 'from-amber-600 to-amber-800',
        spamLevel: 'medium', // Happy complains but doesn't spam too much
        history: [
            { from: 'happy', text: "Boss, the kid won't stop calling me.", time: '2:15 PM' },
            { from: 'tony', text: "That's your job, Hap.", time: '2:16 PM' },
            { from: 'happy', text: "He called 47 times today. FORTY SEVEN.", time: '2:16 PM' },
            { from: 'tony', text: "Only 47? He's slowing down.", time: '2:17 PM' },
            { from: 'happy', text: "This isn't funny Tony", time: '2:17 PM' },
            { from: 'tony', text: "It's a little funny", time: '2:18 PM' },
            { from: 'happy', text: "He sent me 23 pictures of a cat he found.", time: '2:18 PM' },
            { from: 'happy', text: "TWENTY THREE PICTURES. OF ONE CAT.", time: '2:18 PM' },
            { from: 'tony', text: "Was it a nice cat?", time: '2:19 PM' },
            { from: 'happy', text: "That's not the point!", time: '2:19 PM' },
            { from: 'happy', text: "I'm putting in for a raise.", time: '2:20 PM' },
            { from: 'tony', text: "Approved. Now answer the kid's calls.", time: '2:20 PM' },
            { from: 'happy', text: "...I hate this job sometimes.", time: '2:21 PM' },
            { from: 'tony', text: "No you don't. You love it.", time: '2:21 PM' },
            { from: 'happy', text: "Fine. I love it. But I still want that raise.", time: '2:22 PM' },
        ]
    },
    {
        id: 'steve',
        nickname: 'Capsicle 🧊',
        realName: 'Steve Rogers',
        avatarUrl: '/api/assets/profile_pictures/steve.png',
        status: 'Star Spangled Man',
        color: 'from-blue-600 to-red-500',
        spamLevel: 'low', // Cap is patient and formal
        history: [
            { from: 'steve', text: "Tony, we need to talk about the Accords.", time: '10:30 AM' },
            { from: 'tony', text: "Do we though?", time: '10:35 AM' },
            { from: 'steve', text: "This is serious.", time: '10:35 AM' },
            { from: 'tony', text: "I'm always serious. I'm the most serious person you know.", time: '10:36 AM' },
            { from: 'steve', text: "Tony.", time: '10:36 AM' },
            { from: 'tony', text: "Cap.", time: '10:37 AM' },
            { from: 'steve', text: "I don't think we should sign.", time: '10:38 AM' },
            { from: 'tony', text: "And I think we should. There. We talked.", time: '10:38 AM' },
            { from: 'steve', text: "This isn't a game.", time: '10:39 AM' },
            { from: 'tony', text: "You think I don't know that? I've seen what happens when we don't have oversight.", time: '10:40 AM' },
            { from: 'steve', text: "And I've seen what happens when we do. HYDRA, remember?", time: '10:41 AM' },
            { from: 'tony', text: "...Fair point, Capsicle.", time: '10:42 AM' },
            { from: 'steve', text: "Did you just call me Capsicle?", time: '10:42 AM' },
            { from: 'tony', text: "Would you prefer Spangles?", time: '10:43 AM' },
        ]
    },
    {
        id: 'rhodey',
        nickname: 'Rhodey 🎖️',
        realName: 'James Rhodes',
        avatarUrl: '/api/assets/profile_pictures/rhodey.png',
        status: 'War Machine Online',
        color: 'from-gray-600 to-gray-800',
        spamLevel: 'medium', // Rhodey checks in like an old friend
        history: [
            { from: 'rhodey', text: "Tony, the Pentagon wants an update on the suit tech.", time: '11:30 AM' },
            { from: 'tony', text: "Tell them it's classified. Under Stark Industries.", time: '11:32 AM' },
            { from: 'rhodey', text: "I AM the Pentagon liaison, Tony.", time: '11:32 AM' },
            { from: 'tony', text: "Then you should know better than to ask 😏", time: '11:33 AM' },
            { from: 'rhodey', text: "One day I'm gonna drop you from 30,000 feet.", time: '11:34 AM' },
            { from: 'tony', text: "You love me too much.", time: '11:34 AM' },
            { from: 'rhodey', text: "...That's debatable.", time: '11:35 AM' },
            { from: 'tony', text: "Remember MIT? You definitely love me.", time: '11:36 AM' },
            { from: 'rhodey', text: "We agreed never to speak of MIT again.", time: '11:36 AM' },
            { from: 'tony', text: "Right. The incident. With the dean's car.", time: '11:37 AM' },
            { from: 'rhodey', text: "TONY.", time: '11:37 AM' },
            { from: 'tony', text: "And the fire extinguisher.", time: '11:38 AM' },
            { from: 'rhodey', text: "I'm blocking you.", time: '11:38 AM' },
            { from: 'tony', text: "You've been threatening that for 20 years, platypus.", time: '11:39 AM' },
        ]
    },
    {
        id: 'natasha',
        nickname: 'Nat 🕷️',
        realName: 'Natasha Romanoff',
        avatarUrl: '/api/assets/profile_pictures/natasha.png',
        status: 'SHIELD Agent (Level 7)',
        color: 'from-gray-800 to-red-900',
        spamLevel: 'none', // Nat sends one message and waits
        history: [
            { from: 'natasha', text: "Stark, check your secure server.", time: '4:20 PM' },
            { from: 'tony', text: "I'm busy building a lego death star.", time: '4:21 PM' },
            { from: 'natasha', text: "That was Ned. We saw the footage.", time: '4:22 PM' },
            { from: 'tony', text: "Spy satellites? Creepy.", time: '4:22 PM' },
            { from: 'natasha', text: "Standard protocol. Just read the file.", time: '4:23 PM' },
            { from: 'tony', text: "Fine. But you owe me a drink.", time: '4:23 PM' },
            { from: 'natasha', text: "I owe you nothing. Read the file.", time: '4:24 PM' },
            { from: 'tony', text: "So chilly. Remind me to install seat warmers in your jet.", time: '4:25 PM' },
        ]
    },
    {
        id: 'fury',
        nickname: 'Pirate 👁️',
        realName: 'Nick Fury',
        avatarUrl: '/api/assets/profile_pictures/fury.png',
        status: 'Director of SHIELD',
        color: 'from-gray-900 to-black',
        spamLevel: 'demanding', // Fury demands responses
        history: [
            { from: 'fury', text: "Stark. Report.", time: '6:00 AM' },
            { from: 'tony', text: "It's 6 AM. I'm sleeping.", time: '6:05 AM' },
            { from: 'fury', text: "You're awake. I can see your activity log.", time: '6:05 AM' },
            { from: 'tony', text: "Those are automated systems.", time: '6:06 AM' },
            { from: 'fury', text: "Don't play games with me.", time: '6:06 AM' },
            { from: 'tony', text: "You're no fun. What's the emergency?", time: '6:07 AM' },
            { from: 'fury', text: "Global security breach. Get to the Helicarrier.", time: '6:07 AM' },
            { from: 'tony', text: "Can I bring my coffee?", time: '6:08 AM' },
            { from: 'fury', text: "Just get here. Or I'll send a team.", time: '6:08 AM' },
            { from: 'tony', text: "On my way. Don't start the party without me.", time: '6:09 AM' },
        ]
    },
    {
        id: 'bruce',
        nickname: 'Science Bro 🧬',
        realName: 'Bruce Banner',
        avatarUrl: '/api/assets/profile_pictures/bruce.png',
        status: 'Gamma Lab',
        color: 'from-green-600 to-green-800',
        spamLevel: 'low', // Bruce is calm
        history: [
            { from: 'bruce', text: "Tony, are you sure these calculations are right?", time: '2:30 PM' },
            { from: 'tony', text: "I'm always right. What's the issue?", time: '2:31 PM' },
            { from: 'bruce', text: "The gamma radiation levels seem... optimistic.", time: '2:32 PM' },
            { from: 'tony', text: "Optimism is essentially my brand.", time: '2:32 PM' },
            { from: 'bruce', text: "I just don't want the other guy showing up.", time: '2:33 PM' },
            { from: 'tony', text: "He's invited too. We have snacks.", time: '2:33 PM' },
            { from: 'bruce', text: "Tony, this isn't a joke.", time: '2:34 PM' },
            { from: 'tony', text: "Relax, Bruce. I ran the sims 400 times.", time: '2:34 PM' },
            { from: 'bruce', text: "Only 400? I did 5000.", time: '2:35 PM' },
            { from: 'tony', text: "Overachiever. Fine, bring your data over.", time: '2:35 PM' },
        ]
    }
];

// Starter messages when you open the chat (character initiates)
const OPENER_PROMPTS: Record<string, string[]> = {
    peter: [
        "MR STARK!! Perfect timing!! I was JUST about to text you!!",
        "Oh hi Mr. Stark!! Are you there?? I have SO much to tell you!!",
        "Mr. Stark!!! Something crazy happened on patrol today!!!"
    ],
    happy: [
        "Oh good, you're here. I need to vent about the kid.",
        "Boss, perfect timing. We have a situation.",
        "Tony. The kid called me 37 times in the last hour."
    ],
    fury: [
        "About time you checked your phone, Stark.",
        "Stark. We need to talk. Now.",
        "I've been waiting for you to show up."
    ],
    rhodey: [
        "Hey man! Was just thinking about you.",
        "Tony! Perfect timing, I've got news.",
        "Yo, you ghosting me or what?"
    ],
    pepper: [
        "Hey honey, I was just thinking about you.",
        "Tony! Where are you? Morgan's asking for you.",
        "Good timing - I need to talk to you about something."
    ],
    steve: [
        "Tony. Glad you're here. We need to discuss something.",
        "Tony, I've been meaning to reach out.",
        "Good to see you checking in."
    ],
    natasha: [
        "Stark. Good timing.",
        "Check your secure server. Now.",
        "I have intel you need to see."
    ],
    bruce: [
        "Hey Tony! I was just running some calculations...",
        "Oh, hi! Perfect timing, I wanted your opinion on something.",
        "Tony! Are you in the lab? I have questions about the readings."
    ]
};

interface PhoneMirrorProps {
    isOpen: boolean;
    onClose: () => void;
    onNotification?: (id: string, name: string, message: string) => void;
}

// Helper functions for relationship and anger display
const getRelationshipInfo = (score: number) => {
    if (score >= 80) return { name: 'Best Friend', emoji: '❤️', color: 'text-red-500' };
    if (score >= 60) return { name: 'Close Friend', emoji: '💛', color: 'text-yellow-500' };
    if (score >= 40) return { name: 'Friend', emoji: '💚', color: 'text-green-500' };
    if (score >= 20) return { name: 'Acquaintance', emoji: '💙', color: 'text-blue-500' };
    return { name: 'Distant', emoji: '⚪', color: 'text-gray-500' };
};

const getAngerInfo = (anger: number) => {
    if (anger >= 90) return { status: 'CRITICAL', color: 'bg-red-600', barColor: 'from-red-500 to-red-700', warning: true };
    if (anger >= 70) return { status: 'Dangerous', color: 'bg-orange-500', barColor: 'from-orange-400 to-red-500', warning: true };
    if (anger >= 50) return { status: 'Agitated', color: 'bg-yellow-500', barColor: 'from-yellow-400 to-orange-500', warning: false };
    if (anger >= 30) return { status: 'Tense', color: 'bg-lime-500', barColor: 'from-lime-400 to-yellow-500', warning: false };
    return { status: 'Calm', color: 'bg-green-500', barColor: 'from-green-400 to-green-600', warning: false };
};

// Default relationship scores (existing relationships)
const DEFAULT_RELATIONSHIPS: Record<string, number> = {
    pepper: 95,   // Wife - Best Friend
    peter: 70,    // Mentee - Close Friend
    happy: 75,    // Long-time friend
    steve: 45,    // Complicated - Friend
    rhodey: 90,   // Best friend since MIT
    natasha: 55,  // Colleague - Friend
    fury: 35,     // Professional - Acquaintance
    bruce: 80,    // Science Bro - Close Friend
};

export function TonysPhoneMirror({ isOpen, onClose, onNotification }: PhoneMirrorProps) {
    const [connecting, setConnecting] = useState(true);
    const [connectionProgress, setConnectionProgress] = useState(0);
    const [connectionStatus, setConnectionStatus] = useState('Establishing secure uplink...');
    const [selectedContact, setSelectedContact] = useState<typeof CONTACTS[0] | null>(null);
    const [chatHistory, setChatHistory] = useState<{ from: string; text: string; time: string }[]>([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isWaitingToReply, setIsWaitingToReply] = useState(false);
    const [hasInitiatedChat, setHasInitiatedChat] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const followUpTimerRef = useRef<NodeJS.Timeout | null>(null);
    const autoMessageTimerRef = useRef<NodeJS.Timeout | null>(null);
    const lastTonyMessageRef = useRef<number>(0);
    const lastCharacterMessageRef = useRef<number>(0);
    const spamCountRef = useRef<number>(0);
    const chatActiveRef = useRef<boolean>(false);
    const messageCountRef = useRef<number>(0); // Track message count for realistic timing
    const currentContactIdRef = useRef<string | null>(null); // Track current contact for async validation
    const isOpenRef = useRef(isOpen); // Track visibility for async callbacks

    // ========== NEW: Anger & Relationship Tracking ==========
    const [angerLevels, setAngerLevels] = useState<Record<string, number>>(() => {
        try {
            const saved = localStorage.getItem('jarvis-phone-anger');
            return saved ? JSON.parse(saved) : { bruce: 0 };
        } catch { return { bruce: 0 }; }
    });

    const [relationshipLevels, setRelationshipLevels] = useState<Record<string, number>>(() => {
        try {
            const saved = localStorage.getItem('jarvis-phone-relationships');
            return saved ? JSON.parse(saved) : DEFAULT_RELATIONSHIPS;
        } catch { return DEFAULT_RELATIONSHIPS; }
    });

    const [hulkOutState, setHulkOutState] = useState<{ active: boolean; cooldownUntil: number }>(() => {
        try {
            const saved = localStorage.getItem('jarvis-phone-hulkout');
            if (saved) {
                const parsed = JSON.parse(saved);
                // Check if cooldown has expired
                if (parsed.cooldownUntil && Date.now() > parsed.cooldownUntil) {
                    return { active: false, cooldownUntil: 0 };
                }
                return parsed;
            }
        } catch { }
        return { active: false, cooldownUntil: 0 };
    });

    const [showHulkOutAnimation, setShowHulkOutAnimation] = useState(false);

    // Persist anger levels
    useEffect(() => {
        localStorage.setItem('jarvis-phone-anger', JSON.stringify(angerLevels));
    }, [angerLevels]);

    // Persist relationship levels
    useEffect(() => {
        localStorage.setItem('jarvis-phone-relationships', JSON.stringify(relationshipLevels));
    }, [relationshipLevels]);

    // Persist hulk-out state
    useEffect(() => {
        localStorage.setItem('jarvis-phone-hulkout', JSON.stringify(hulkOutState));
    }, [hulkOutState]);

    // Check if hulk-out cooldown has expired
    useEffect(() => {
        if (hulkOutState.active && hulkOutState.cooldownUntil) {
            const timeLeft = hulkOutState.cooldownUntil - Date.now();
            if (timeLeft <= 0) {
                // Cooldown expired, reset
                setHulkOutState({ active: false, cooldownUntil: 0 });
                setAngerLevels(prev => ({ ...prev, bruce: 0 }));
            } else {
                // Set timer to auto-reset when cooldown expires
                const timer = setTimeout(() => {
                    setHulkOutState({ active: false, cooldownUntil: 0 });
                    setAngerLevels(prev => ({ ...prev, bruce: 0 }));
                }, timeLeft);
                return () => clearTimeout(timer);
            }
        }
    }, [hulkOutState]);

    // Trigger Hulk-out sequence
    const triggerHulkOut = useCallback(() => {
        console.log('[PHONE] 💥 HULK OUT TRIGGERED!');
        setShowHulkOutAnimation(true);

        // Set cooldown for 5 minutes
        const cooldownTime = Date.now() + 5 * 60 * 1000;
        setHulkOutState({ active: true, cooldownUntil: cooldownTime });

        // Hide animation after 4 seconds
        setTimeout(() => {
            setShowHulkOutAnimation(false);
            setSelectedContact(null); // Boot user out of chat
        }, 4000);
    }, []);

    // ========== END NEW ==========

    useEffect(() => {
        isOpenRef.current = isOpen;
    }, [isOpen]);

    // Track latest messages for each contact (for the list view) with timestamp for sorting
    const [contactPreviews, setContactPreviews] = useState<Record<string, { text: string; time: string; timestamp: number }>>({});

    // Helper to send character messages with typing simulation
    const sendCharacterMessage = useCallback(async (characterId: string, messages: string[]) => {
        setIsTyping(true);
        for (const text of messages) {
            await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1700)); // Simulate typing delay
            setChatHistory(prev => [...prev, {
                from: characterId,
                text: text,
                time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
            }]);
        }
        setIsTyping(false);
        lastCharacterMessageRef.current = Date.now();
    }, []);

    // Function to initiate chat if no history exists
    const initiateChatIfNoHistory = useCallback(async (contact: typeof CONTACTS[0]) => {
        if (!contact || hasInitiatedChat) return;

        const serverHistoryData = await apiRequest('GET', `/api/phone/history/${contact.id}`);
        const currentHistory = serverHistoryData.history?.length > 0 ? serverHistoryData.history : contact.history;

        if (currentHistory.length === 0 || (currentHistory.length === 1 && currentHistory[0].from === 'tony')) {
            // If history is empty or only contains Tony's message, character initiates
            const openerMessages = OPENER_PROMPTS[contact.id];
            if (openerMessages && openerMessages.length > 0) {
                const message = openerMessages[Math.floor(Math.random() * openerMessages.length)];
                console.log(`[PHONE] ${contact.nickname} initiating chat: "${message}"`);
                await sendCharacterMessage(contact.id, [message]);
                setHasInitiatedChat(true);
            }
        }
    }, [hasInitiatedChat, sendCharacterMessage]);

    // Fetch latest messages for all contacts when phone opens (for preview)
    useEffect(() => {
        if (!isOpen) return;

        const fetchAllPreviews = async () => {
            const previews: Record<string, { text: string; time: string; timestamp: number }> = {};

            for (const contact of CONTACTS) {
                try {
                    const res = await fetch(`/api/phone/history/${contact.id}`);
                    const data = await res.json();
                    if (data.history?.length > 0) {
                        const lastMsg = data.history[data.history.length - 1];
                        // Parse time to get relative sorting (use index as fallback timestamp)
                        previews[contact.id] = {
                            text: lastMsg.text,
                            time: lastMsg.time,
                            timestamp: Date.now() - (CONTACTS.length - CONTACTS.indexOf(contact)) * 60000
                        };
                    }
                } catch (e) {
                    // Fall back to default history
                }
            }

            setContactPreviews(previews);
        };

        fetchAllPreviews();
    }, [isOpen]);

    // Update preview for current contact when chat history changes
    useEffect(() => {
        if (selectedContact && chatHistory.length > 0) {
            const lastMsg = chatHistory[chatHistory.length - 1];
            setContactPreviews(prev => ({
                ...prev,
                [selectedContact.id]: {
                    text: lastMsg.text,
                    time: lastMsg.time,
                    timestamp: Date.now() // Current time for sorting
                }
            }));
        }
    }, [chatHistory, selectedContact]);

    // Track previous contact for save-on-leave
    const previousContactRef = useRef<typeof CONTACTS[0] | null>(null);
    const previousHistoryRef = useRef<{ from: string; text: string; time: string }[]>([]);

    // KEEP HISTORY REF FRESH: Update whenever chat history changes 
    // This prevents stale history from the *previous* render cycle clobbering the wrong contact
    useEffect(() => {
        previousHistoryRef.current = chatHistory;
    }, [chatHistory]);

    // Save chat history when leaving a contact or closing phone
    useEffect(() => {
        // If we had a previous contact and history, save it
        if (previousContactRef.current && previousHistoryRef.current.length > 0) {
            const contactToSave = previousContactRef.current;
            const historyToSave = previousHistoryRef.current;

            // Save asynchronously
            fetch('/api/phone/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    characterId: contactToSave.id,
                    messages: historyToSave
                })
            }).catch(e => console.error('[PHONE] Failed to save on leave:', e));
        }

        // Update ref for next change
        previousContactRef.current = selectedContact;
    }, [selectedContact]);

    // Also save when phone closes
    useEffect(() => {
        if (!isOpen && previousContactRef.current && previousHistoryRef.current.length > 0) {
            const contactToSave = previousContactRef.current;
            const historyToSave = previousHistoryRef.current;

            fetch('/api/phone/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    characterId: contactToSave.id,
                    messages: historyToSave
                })
            }).catch(e => console.error('[PHONE] Failed to save on close:', e));
        }
    }, [isOpen]);

    // Clean up timers on unmount or contact change
    useEffect(() => {
        return () => {
            if (followUpTimerRef.current) {
                clearTimeout(followUpTimerRef.current);
            }
            if (autoMessageTimerRef.current) {
                clearTimeout(autoMessageTimerRef.current);
            }
        };
    }, [selectedContact]);

    // Connection animation on mount
    useEffect(() => {
        if (!isOpen) {
            setConnecting(true);
            setConnectionProgress(0);
            setSelectedContact(null);
            // Clear any pending timers
            if (followUpTimerRef.current) {
                clearTimeout(followUpTimerRef.current);
            }
            return;
        }

        const connectionSteps = [
            { progress: 15, status: 'Scanning encrypted frequencies...' },
            { progress: 35, status: 'Bypassing Stark security protocols...' },
            { progress: 55, status: 'Decrypting AES-256 handshake...' },
            { progress: 75, status: 'Establishing neural-link sync...' },
            { progress: 90, status: 'Mirroring device interface...' },
            { progress: 100, status: 'Connection established.' },
        ];

        let step = 0;
        const interval = setInterval(() => {
            if (step < connectionSteps.length) {
                setConnectionProgress(connectionSteps[step].progress);
                setConnectionStatus(connectionSteps[step].status);
                step++;
            } else {
                clearInterval(interval);
                setTimeout(() => setConnecting(false), 500);
            }
        }, 400);

        return () => clearInterval(interval);
    }, [isOpen]);

    // Load chat history when contact selected - first try server, fallback to defaults
    const { data: serverHistory, isLoading: historyLoading, refetch: refetchHistory } = useQuery({
        queryKey: ['/api/phone/history', selectedContact?.id],
        queryFn: async () => {
            if (!selectedContact) return null;
            console.log(`[PHONE] Fetching history for ${selectedContact.id}...`);
            const res = await fetch(`/api/phone/history/${selectedContact.id}`);
            const data = await res.json();
            console.log(`[PHONE] Got ${data.history?.length || 0} messages from server`);
            return data.history?.length > 0 ? data.history : null;
        },
        enabled: !!selectedContact,
        staleTime: 0, // Always refetch
        refetchOnMount: 'always',
    });

    useEffect(() => {
        if (selectedContact) {
            // CRITICAL: Update the ref immediately when contact changes
            currentContactIdRef.current = selectedContact.id;

            // Update history immediately (use defaults while server loads to prevent bleed)
            const historyToUse = serverHistory || [...selectedContact.history];
            // Only log if we have actual server data to avoid noise
            if (serverHistory) {
                console.log(`[PHONE] Updated chat history for ${selectedContact.id}`);
            }
            setChatHistory(historyToUse);

            // Activate chat system
            chatActiveRef.current = true;
            spamCountRef.current = 0;
            setHasInitiatedChat(false);

            // Reset message timestamps  
            lastTonyMessageRef.current = 0;
            lastCharacterMessageRef.current = Date.now();
            messageCountRef.current = 0; // Reset for new conversation
        } else {
            // Deactivate chat when no contact selected
            currentContactIdRef.current = null;
            chatActiveRef.current = false;
            if (followUpTimerRef.current) {
                clearTimeout(followUpTimerRef.current);
                followUpTimerRef.current = null;
            }
        }
    }, [selectedContact, serverHistory]);

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistory, isTyping, isWaitingToReply]);

    // Universal follow-up function - generates AI-powered contextual messages
    const sendFollowUp = useCallback(async () => {
        if (!selectedContact || !chatActiveRef.current) return;

        // Capture the original contact ID to validate throughout
        const originalContactId = selectedContact.id;
        const originalContactName = selectedContact.realName;
        const spamLevel = selectedContact.spamLevel;

        // Check if Tony has replied recently
        const timeSinceLastTonyMessage = Date.now() - lastTonyMessageRef.current;

        // Different spam thresholds based on character
        let spamThreshold = 60000; // 1 minute default
        let spamChance = 0.5;

        switch (spamLevel) {
            case 'extreme': // Peter - spams like crazy
                spamThreshold = 10000; // 10 seconds!
                spamChance = 0.9;
                break;
            case 'demanding': // Fury - demands responses
                spamThreshold = 25000;
                spamChance = 0.7;
                break;
            case 'medium': // Happy, Rhodey
                spamThreshold = 40000;
                spamChance = 0.5;
                break;
            case 'low': // Pepper, Steve, Bruce
                spamThreshold = 90000;
                spamChance = 0.3;
                break;
            case 'none': // Natasha - very rare
                spamThreshold = 180000;
                spamChance = 0.1;
                break;
        }

        // Don't spam if Tony replied recently
        if (timeSinceLastTonyMessage < spamThreshold) {
            scheduleNextFollowUp();
            return;
        }

        // Random chance to not spam (feels more natural)
        if (Math.random() > spamChance) {
            scheduleNextFollowUp();
            return;
        }

        // VALIDATE: Check contact hasn't changed (use ref for real-time value)
        if (currentContactIdRef.current !== originalContactId) {
            console.log(`[PHONE] Follow-up cancelled - switched from ${originalContactId} to ${currentContactIdRef.current}`);
            return;
        }

        console.log(`[PHONE] ${originalContactName} is checking in (AI-generated)...`);

        try {
            // Generate AI follow-up based on conversation context
            const context = chatHistory.slice(-50).map(m =>
                `${m.from === 'tony' ? 'Tony' : originalContactName}: ${m.text}`
            ).join('\n');

            const timeSinceLastReply = Math.round((Date.now() - lastTonyMessageRef.current) / 1000);

            const response = await apiRequest('POST', '/api/phone/followup', {
                characterId: originalContactId,
                characterName: originalContactName,
                context,
                timeSinceLastReply
            });

            // VALIDATE AGAIN: Check contact hasn't changed after API call
            if (currentContactIdRef.current !== originalContactId) {
                console.log(`[PHONE] Follow-up response discarded - switched from ${originalContactId} to ${currentContactIdRef.current}`);
                return;
            }

            const messages = response.messages || [];

            // Add messages to chat with realistic delays
            for (const text of messages) {
                // VALIDATE before each message
                if (currentContactIdRef.current !== originalContactId) {
                    console.log(`[PHONE] Message discarded mid-stream - contact changed`);
                    return;
                }

                setIsTyping(true);
                await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1500));
                setIsTyping(false);

                // Final validation before adding
                if (currentContactIdRef.current !== originalContactId) return;

                setChatHistory(prev => [...prev, {
                    from: originalContactId,
                    text: text,
                    time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
                }]);
            }

            lastCharacterMessageRef.current = Date.now();
            spamCountRef.current++;
        } catch (error) {
            console.error('[PHONE] Failed to generate follow-up:', error);
        }

        // Schedule another follow-up (only if still on same contact)
        if (currentContactIdRef.current === originalContactId) {
            scheduleNextFollowUp();
        }
    }, [selectedContact, chatHistory]);

    // Schedule the next follow-up based on character
    const scheduleNextFollowUp = useCallback(() => {
        if (!selectedContact || !chatActiveRef.current) return;

        // Clear existing timer
        if (followUpTimerRef.current) {
            clearTimeout(followUpTimerRef.current);
        }

        let baseDelay = 30000;
        switch (selectedContact.spamLevel) {
            case 'extreme': baseDelay = 8000; break; // Spider-Man: 8-16 seconds
            case 'demanding': baseDelay = 20000; break;
            case 'medium': baseDelay = 35000; break;
            case 'low': baseDelay = 60000; break;
            case 'none': baseDelay = 120000; break;
        }

        const delay = baseDelay + Math.random() * baseDelay;
        console.log(`[PHONE] Next follow-up from ${selectedContact.nickname} in ${Math.round(delay / 1000)}s`);

        followUpTimerRef.current = setTimeout(() => {
            sendFollowUp();
        }, delay);
    }, [selectedContact, sendFollowUp]);

    // Start follow-up timer when chat is activated
    useEffect(() => {
        if (selectedContact && chatActiveRef.current) {
            // Start the follow-up timer immediately - characters will text you even if you don't message first!
            console.log(`[PHONE] Chat activated with ${selectedContact.nickname} - starting follow-up system`);
            scheduleNextFollowUp();
        }
    }, [selectedContact, scheduleNextFollowUp]);

    // AI Chat mutation - captures contact ID to prevent cross-chat contamination
    const chatMutation = useMutation({
        mutationFn: async (message: string) => {
            // Capture the contact ID at mutation START to validate later
            const originalContactId = selectedContact?.id;
            const originalContactName = selectedContact?.realName;

            // Also capture current chat history for saving
            const currentHistory = [...chatHistory];

            const response = await apiRequest('POST', '/api/phone/chat', {
                characterId: originalContactId,
                characterName: originalContactName,
                message,
                context: currentHistory.slice(-50).map(m => `${m.from === 'tony' ? 'Tony' : originalContactName}: ${m.text}`).join('\n')
            });

            // Return the response WITH the original contact info for proper handling
            return {
                ...response,
                _originalContactId: originalContactId,
                _originalContactName: originalContactName,
                _originalHistory: currentHistory
            };
        },
        onSuccess: async (data) => {
            const originalContactId = data._originalContactId;
            const originalContactName = data._originalContactName;
            const messages = data.messages || [data.response];

            // ========== NEW: Process anger and relationship deltas ==========
            const angerDelta = data.angerDelta || 0;
            const relationshipDelta = data.relationshipDelta || 0;

            // Update relationship level
            if (relationshipDelta !== 0) {
                setRelationshipLevels(prev => {
                    const current = prev[originalContactId] || 50;
                    const newLevel = Math.max(0, Math.min(100, current + relationshipDelta));
                    console.log(`[PHONE] ${originalContactName} relationship: ${current} → ${newLevel} (${relationshipDelta > 0 ? '+' : ''}${relationshipDelta})`);
                    return { ...prev, [originalContactId]: newLevel };
                });
            }

            // Update anger level (Bruce only for now)
            if (originalContactId === 'bruce' && angerDelta !== 0) {
                setAngerLevels(prev => {
                    const current = prev.bruce || 0;
                    const newAnger = Math.max(0, Math.min(100, current + angerDelta));
                    console.log(`[PHONE] 🟢 Bruce anger: ${current}% → ${newAnger}% (${angerDelta > 0 ? '+' : ''}${angerDelta})`);

                    // Check for HULK OUT!
                    if (newAnger >= 100 && !hulkOutState.active) {
                        console.log('[PHONE] 💥 ANGER HIT 100% - TRIGGERING HULK OUT!');
                        // Delay trigger slightly to let messages appear first
                        setTimeout(() => triggerHulkOut(), 2000);
                    }

                    return { ...prev, bruce: newAnger };
                });
            }
            // ========== END NEW ==========

            // Clear any follow-up timer
            if (followUpTimerRef.current) {
                clearTimeout(followUpTimerRef.current);
            }

            // Realistic response timing - OPTIMIZED for natural feel
            // First few messages have slightly longer delay, then speeds up
            let minDelay, maxDelay;

            if (originalContactId === 'peter') {
                // Spider-Man is ALWAYS eager to reply - instant responses
                minDelay = 1000;   // 1 second
                maxDelay = 5000;   // 5 seconds max
            } else if (messageCountRef.current < 2) {
                // First response - slightly longer but not frustrating
                minDelay = 5000;   // 5 seconds
                maxDelay = 15000;  // 15 seconds max
            } else if (messageCountRef.current < 5) {
                // Warming up - getting into conversation flow
                minDelay = 3000;   // 3 seconds
                maxDelay = 10000;  // 10 seconds
            } else {
                // Active conversation - quick exchanges
                minDelay = 2000;   // 2 seconds
                maxDelay = 8000;   // 8 seconds
            }

            const replyDelay = minDelay + Math.random() * (maxDelay - minDelay);
            console.log(`[PHONE] ${originalContactId} will reply in ${Math.round(replyDelay / 1000)}s...`);

            // Show typing indicator EARLY (after 1-2 seconds) so user knows response is coming
            const typingShowTime = Math.min(1500, replyDelay * 0.3);
            await new Promise(resolve => setTimeout(resolve, typingShowTime));

            // Only show typing indicator if still on this contact
            if (currentContactIdRef.current === originalContactId) {
                setIsTyping(true);
            }

            await new Promise(resolve => setTimeout(resolve, replyDelay - typingShowTime));

            // Build the new messages to add
            const newMessages = messages.map((text: string) => ({
                from: originalContactId,
                text: text,
                time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
            }));

            // ALWAYS save to server with the ORIGINAL contact ID (regardless of current view)
            const fullHistory = [...data._originalHistory, ...newMessages];
            try {
                await fetch('/api/phone/save', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ characterId: originalContactId, messages: fullHistory })
                });
                console.log(`[PHONE] Saved ${newMessages.length} messages to ${originalContactId}'s chat`);
            } catch (e) {
                console.error('[PHONE] Failed to save:', e);
            }

            // Only update local UI if still viewing the same contact AND phone is open
            if (currentContactIdRef.current === originalContactId && isOpenRef.current) {
                setIsTyping(false);

                for (const msg of newMessages) {
                    setIsTyping(true);
                    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1500));
                    setIsTyping(false);

                    // Final check before adding to UI
                    if (currentContactIdRef.current === originalContactId && isOpenRef.current) {
                        setChatHistory(prev => [...prev, msg]);
                    } else {
                        // User left mid-stream
                        onNotification?.(originalContactId, originalContactName, msg.text);
                    }
                    messageCountRef.current++;
                }

                setIsTyping(false);
                lastCharacterMessageRef.current = Date.now();
                scheduleNextFollowUp();
            } else {
                console.log(`[PHONE] Response saved to ${originalContactId} (background/switched view)`);
                setIsTyping(false);

                // Simulate delays for background arrival
                for (const msg of newMessages) {
                    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1500));
                    onNotification?.(originalContactId, originalContactName, msg.text);
                }
            }
        },
        onError: (error) => {
            console.error('[PHONE CHAT ERROR]', error);
            setIsTyping(false);
            setIsWaitingToReply(false);
        }
    });

    const handleSend = () => {
        if (!inputMessage.trim() || !selectedContact) return;

        // Clear any follow-up timer since Tony is responding
        if (followUpTimerRef.current) {
            clearTimeout(followUpTimerRef.current);
            followUpTimerRef.current = null;
        }

        // Track when Tony last sent a message
        lastTonyMessageRef.current = Date.now();

        const newMessage = {
            from: 'tony',
            text: inputMessage,
            time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
        };

        // Add Tony's message
        setChatHistory(prev => {
            const updated = [...prev, newMessage];
            // Immediately save to server
            if (selectedContact) {
                fetch('/api/phone/save', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ characterId: selectedContact.id, messages: updated })
                }).catch(e => console.error('[PHONE] Save failed:', e));
            }
            return updated;
        });

        // Send to AI
        chatMutation.mutate(inputMessage);
        setInputMessage('');
    };

    // Removed early return to keep timers alive
    // if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                >
                    {/* iPhone Container - Responsive for actual iPhones */}
                    <motion.div
                        initial={{ scale: 0.8, y: 50 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.8, y: 50 }}
                        onClick={(e) => e.stopPropagation()}
                        className="relative w-full max-w-[375px] h-[90vh] max-h-[750px] bg-black rounded-[40px] md:rounded-[40px] border-4 border-gray-800 shadow-2xl overflow-hidden"
                        style={{ maxHeight: 'min(750px, calc(100vh - 40px))' }}
                    >
                        {/* Notch */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-black rounded-b-2xl z-20" />

                        {/* Status Bar */}
                        <div className="relative z-10 flex items-center justify-between px-6 pt-3 pb-1 text-white text-xs">
                            <span className="font-semibold">9:41</span>
                            <div className="flex items-center gap-1">
                                <Signal className="w-3.5 h-3.5" />
                                <Wifi className="w-3.5 h-3.5" />
                                <Battery className="w-4 h-4" />
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="h-full bg-black pt-2 pb-8">
                            {connecting ? (
                                /* Connection Animation */
                                <div className="h-full flex flex-col items-center justify-center px-6">
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                                        className="w-20 h-20 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full mb-6"
                                    />
                                    <motion.div
                                        className="w-full h-2 bg-gray-800 rounded-full overflow-hidden mb-4"
                                    >
                                        <motion.div
                                            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                                            animate={{ width: `${connectionProgress}%` }}
                                            transition={{ duration: 0.3 }}
                                        />
                                    </motion.div>
                                    <p className="text-cyan-400 text-sm font-mono text-center">{connectionStatus}</p>
                                    <p className="text-gray-500 text-xs mt-2 font-mono">STARK SECURE UPLINK v3.2.1</p>
                                </div>
                            ) : selectedContact ? (
                                /* Chat View */
                                <div className="h-full flex flex-col">
                                    {/* Chat Header - Enhanced with relationship and anger indicators */}
                                    <div className="border-b border-gray-800">
                                        <div className="flex items-center gap-3 px-4 py-3">
                                            <button
                                                onClick={() => setSelectedContact(null)}
                                                className="p-1 hover:bg-gray-800 rounded-full transition-colors"
                                            >
                                                <ChevronLeft className="w-6 h-6 text-blue-500" />
                                            </button>
                                            <div className={`w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br ${selectedContact.color} flex-shrink-0 flex items-center justify-center`}>
                                                <img
                                                    src={selectedContact.avatarUrl}
                                                    alt={selectedContact.realName}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <p className="text-white font-semibold truncate">{selectedContact.nickname}</p>
                                                    {/* Relationship Badge */}
                                                    <span className={`text-sm ${getRelationshipInfo(relationshipLevels[selectedContact.id] || 50).color}`}>
                                                        {getRelationshipInfo(relationshipLevels[selectedContact.id] || 50).emoji}
                                                    </span>
                                                </div>
                                                <p className="text-gray-400 text-xs truncate">
                                                    {getRelationshipInfo(relationshipLevels[selectedContact.id] || 50).name} • {selectedContact.status}
                                                </p>
                                            </div>
                                            <Phone className="w-5 h-5 text-blue-500" />
                                        </div>

                                        {/* Bruce's Anger Bar */}
                                        {selectedContact.id === 'bruce' && (
                                            <motion.div
                                                className="px-4 pb-2"
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                            >
                                                <div className="flex items-center gap-2 text-xs">
                                                    <span className="text-gray-500">Anger:</span>
                                                    <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                                                        <motion.div
                                                            className={`h-full bg-gradient-to-r ${getAngerInfo(angerLevels.bruce || 0).barColor}`}
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${angerLevels.bruce || 0}%` }}
                                                            transition={{ duration: 0.5 }}
                                                        />
                                                    </div>
                                                    <span className={`font-mono ${getAngerInfo(angerLevels.bruce || 0).warning ? 'text-red-500 animate-pulse' : 'text-gray-400'}`}>
                                                        {Math.round(angerLevels.bruce || 0)}%
                                                    </span>
                                                </div>
                                                {getAngerInfo(angerLevels.bruce || 0).warning && (
                                                    <motion.p
                                                        className="text-red-500 text-xs mt-1 text-center"
                                                        animate={{ opacity: [1, 0.5, 1] }}
                                                        transition={{ repeat: Infinity, duration: 1 }}
                                                    >
                                                        ⚠️ {getAngerInfo(angerLevels.bruce || 0).status} - Don't push him!
                                                    </motion.p>
                                                )}
                                            </motion.div>
                                        )}
                                    </div>

                                    {/* Messages - iOS optimized scrolling */}
                                    <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1.5" style={{ WebkitOverflowScrolling: 'touch' }}>
                                        {chatHistory.map((msg, idx) => (
                                            <motion.div
                                                key={idx}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: idx * 0.02 }}
                                                className={`flex ${msg.from === 'tony' ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div
                                                    className={`max-w-[80%] px-3 py-1.5 rounded-2xl text-[15px] leading-tight ${msg.from === 'tony'
                                                        ? 'bg-blue-500 text-white rounded-br-md'
                                                        : 'bg-gray-800 text-white rounded-bl-md'
                                                        }`}
                                                >
                                                    <p className="break-words">{msg.text}</p>
                                                    <p className={`text-[10px] mt-0.5 ${msg.from === 'tony' ? 'text-blue-200' : 'text-gray-500'}`}>
                                                        {msg.time}
                                                    </p>
                                                </div>
                                            </motion.div>
                                        ))}

                                        {/* Delivered status for last Tony message */}
                                        {chatHistory.length > 0 && chatHistory[chatHistory.length - 1].from === 'tony' && (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="flex justify-end pr-1 mt-0.5 mb-2"
                                            >
                                                <span className="text-[10px] text-gray-500 font-medium">Delivered</span>
                                            </motion.div>
                                        )}

                                        {/* Typing Indicator */}
                                        {isTyping && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="flex justify-start"
                                            >
                                                <div className="bg-gray-800 px-4 py-2.5 rounded-2xl rounded-bl-md flex items-center gap-1">
                                                    <motion.span
                                                        animate={{ opacity: [0.4, 1, 0.4] }}
                                                        transition={{ repeat: Infinity, duration: 1, delay: 0 }}
                                                        className="w-2 h-2 bg-gray-400 rounded-full"
                                                    />
                                                    <motion.span
                                                        animate={{ opacity: [0.4, 1, 0.4] }}
                                                        transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                                                        className="w-2 h-2 bg-gray-400 rounded-full"
                                                    />
                                                    <motion.span
                                                        animate={{ opacity: [0.4, 1, 0.4] }}
                                                        transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                                                        className="w-2 h-2 bg-gray-400 rounded-full"
                                                    />
                                                </div>
                                            </motion.div>
                                        )}

                                        <div ref={messagesEndRef} />
                                    </div>

                                    {/* Input - iOS keyboard optimized */}
                                    <div className="px-3 py-2 border-t border-gray-800 pb-safe" style={{ paddingBottom: 'max(8px, env(safe-area-inset-bottom))' }}>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="text"
                                                value={inputMessage}
                                                onChange={(e) => setInputMessage(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                                onFocus={() => {
                                                    // Scroll to bottom when keyboard appears
                                                    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 300);
                                                }}
                                                placeholder="Message..."
                                                className="flex-1 bg-gray-800 text-white px-4 py-2.5 rounded-full text-[16px] outline-none focus:ring-2 focus:ring-blue-500"
                                                style={{ fontSize: '16px' }} // Prevents iOS zoom on focus
                                            />
                                            <button
                                                onClick={handleSend}
                                                disabled={!inputMessage.trim() || chatMutation.isPending || isTyping}
                                                className="p-2.5 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-full transition-colors touch-manipulation"
                                            >
                                                <Send className="w-4 h-4 text-white" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                /* Contact List (Messages App) */
                                <div className="h-full flex flex-col">
                                    <div className="px-4 py-3">
                                        <h1 className="text-white text-2xl font-bold">Messages</h1>
                                        <p className="text-gray-500 text-xs mt-1">Tony's iPhone • Mirrored</p>
                                    </div>

                                    <div className="flex-1 overflow-y-auto">
                                        {/* Sort contacts by most recent message */}
                                        {[...CONTACTS].sort((a, b) => {
                                            const aTime = contactPreviews[a.id]?.timestamp || 0;
                                            const bTime = contactPreviews[b.id]?.timestamp || 0;
                                            return bTime - aTime; // Most recent first
                                        }).map((contact, idx) => (
                                            <motion.button
                                                key={contact.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: idx * 0.05 }}
                                                onClick={() => setSelectedContact(contact)}
                                                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-900 transition-colors border-b border-gray-800/50 ${contact.id === 'bruce' && hulkOutState.active ? 'opacity-50' : ''
                                                    }`}
                                            >
                                                <div className={`w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br ${contact.color} flex-shrink-0 flex items-center justify-center relative`}>
                                                    <img
                                                        src={contact.avatarUrl}
                                                        alt={contact.realName}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                                    />
                                                    {/* Relationship badge on avatar */}
                                                    <span className="absolute -bottom-0.5 -right-0.5 text-sm">
                                                        {getRelationshipInfo(relationshipLevels[contact.id] || 50).emoji}
                                                    </span>
                                                </div>
                                                <div className="flex-1 min-w-0 text-left">
                                                    <p className="text-white font-semibold truncate">{contact.nickname}</p>
                                                    <p className="text-gray-400 text-sm truncate">
                                                        {contact.id === 'bruce' && hulkOutState.active
                                                            ? '📵 Unavailable - Phone destroyed'
                                                            : (contactPreviews[contact.id]?.text || contact.history[contact.history.length - 1].text)
                                                        }
                                                    </p>
                                                </div>
                                                <div className="text-gray-500 text-xs flex-shrink-0">
                                                    {contactPreviews[contact.id]?.time || contact.history[contact.history.length - 1].time}
                                                </div>
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Home Indicator */}
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-gray-600 rounded-full" />

                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 z-30 p-2 bg-red-500/20 hover:bg-red-500/40 rounded-full transition-colors"
                        >
                            <X className="w-4 h-4 text-red-400" />
                        </button>

                        {/* ========== HULK OUT ANIMATION OVERLAY ========== */}
                        <AnimatePresence>
                            {showHulkOutAnimation && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
                                >
                                    {/* Green flash background */}
                                    <motion.div
                                        className="absolute inset-0 bg-green-500"
                                        animate={{
                                            opacity: [0, 1, 0.8, 1, 0.5, 0],
                                            scale: [1, 1.05, 1, 1.1, 1],
                                        }}
                                        transition={{ duration: 1.5 }}
                                    />

                                    {/* Shake effect */}
                                    <motion.div
                                        className="absolute inset-0"
                                        animate={{
                                            x: [0, -20, 20, -15, 15, -10, 10, -5, 5, 0],
                                            y: [0, 10, -10, 15, -15, 10, -10, 5, -5, 0],
                                        }}
                                        transition={{ duration: 0.8 }}
                                    />

                                    {/* HULK SMASH text */}
                                    <motion.div
                                        className="relative z-10 text-center"
                                        initial={{ scale: 0, rotate: -20 }}
                                        animate={{ scale: [0, 1.5, 1], rotate: [-20, 10, 0] }}
                                        transition={{ duration: 0.5, delay: 0.3 }}
                                    >
                                        <h1 className="text-5xl font-black text-white drop-shadow-[0_0_30px_rgba(0,255,0,0.8)]">
                                            💚 HULK
                                        </h1>
                                        <motion.h1
                                            className="text-6xl font-black text-white drop-shadow-[0_0_30px_rgba(0,255,0,0.8)]"
                                            animate={{ scale: [1, 1.1, 1] }}
                                            transition={{ repeat: 3, duration: 0.2 }}
                                        >
                                            SMASH! 💥
                                        </motion.h1>
                                    </motion.div>

                                    {/* Screen crack overlay */}
                                    <motion.div
                                        className="absolute inset-0 z-20 pointer-events-none"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.8 }}
                                        style={{
                                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M50 0 L45 30 L20 25 L30 50 L0 60 L35 65 L25 100 L55 70 L60 100 L65 65 L100 75 L70 50 L90 30 L55 35 Z' fill='none' stroke='white' stroke-width='0.5' opacity='0.8'/%3E%3C/svg%3E")`,
                                            backgroundSize: 'cover',
                                        }}
                                    />

                                    {/* Connection lost message */}
                                    <motion.div
                                        className="absolute bottom-20 text-center z-30"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 1.5 }}
                                    >
                                        <p className="text-red-500 text-xl font-bold">📵 CONNECTION LOST</p>
                                        <p className="text-gray-400 text-sm mt-2">The other guy broke the phone...</p>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Hulk cooldown overlay (when trying to access Bruce during cooldown) */}
                        {hulkOutState.active && selectedContact?.id === 'bruce' && !showHulkOutAnimation && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="absolute inset-0 z-40 bg-black/90 flex flex-col items-center justify-center"
                            >
                                <div className="text-center px-6">
                                    <p className="text-6xl mb-4">📵</p>
                                    <h2 className="text-2xl font-bold text-red-500 mb-2">CONNECTION LOST</h2>
                                    <p className="text-gray-400 mb-4">Bruce's phone was destroyed during the... incident.</p>
                                    <p className="text-gray-500 text-sm">
                                        Available again in: {Math.ceil((hulkOutState.cooldownUntil - Date.now()) / 60000)} minutes
                                    </p>
                                    <button
                                        onClick={() => setSelectedContact(null)}
                                        className="mt-6 px-6 py-2 bg-gray-800 hover:bg-gray-700 rounded-full text-white transition-colors"
                                    >
                                        Back to Messages
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                </motion.div>
            )
            }
        </AnimatePresence >
    );
}
