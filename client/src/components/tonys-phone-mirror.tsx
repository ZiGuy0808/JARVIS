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
}

export function TonysPhoneMirror({ isOpen, onClose }: PhoneMirrorProps) {
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

        // Update refs for next change
        previousContactRef.current = selectedContact;
        previousHistoryRef.current = chatHistory;
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
            // Wait for query to complete before setting history
            if (!historyLoading) {
                // Use server history if available, otherwise use defaults
                const historyToUse = serverHistory || [...selectedContact.history];
                console.log(`[PHONE] Setting chat history: ${historyToUse.length} messages (from ${serverHistory ? 'server' : 'defaults'})`);
                setChatHistory(historyToUse);
            }

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
            chatActiveRef.current = false;
            if (followUpTimerRef.current) {
                clearTimeout(followUpTimerRef.current);
                followUpTimerRef.current = null;
            }
        }
    }, [selectedContact, serverHistory, historyLoading]);

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

        // VALIDATE: Check contact hasn't changed
        if (selectedContact?.id !== originalContactId) {
            console.log(`[PHONE] Follow-up cancelled - switched from ${originalContactId} to ${selectedContact?.id}`);
            return;
        }

        console.log(`[PHONE] ${originalContactName} is checking in (AI-generated)...`);

        try {
            // Generate AI follow-up based on conversation context
            const context = chatHistory.slice(-6).map(m =>
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
            if (selectedContact?.id !== originalContactId) {
                console.log(`[PHONE] Follow-up response discarded - switched from ${originalContactId} to ${selectedContact?.id}`);
                return;
            }

            const messages = response.messages || [];

            // Add messages to chat with realistic delays
            for (const text of messages) {
                // VALIDATE before each message
                if (selectedContact?.id !== originalContactId) {
                    console.log(`[PHONE] Message discarded mid-stream - contact changed`);
                    return;
                }

                setIsTyping(true);
                await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1500));
                setIsTyping(false);

                // Final validation before adding
                if (selectedContact?.id !== originalContactId) return;

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
        if (selectedContact?.id === originalContactId) {
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

            const response = await apiRequest('POST', '/api/phone/chat', {
                characterId: originalContactId,
                characterName: originalContactName,
                message,
                context: chatHistory.slice(-6).map(m => `${m.from === 'tony' ? 'Tony' : originalContactName}: ${m.text}`).join('\n')
            });

            // Return the response WITH the original contact ID for validation
            return { ...response, _originalContactId: originalContactId };
        },
        onSuccess: async (data) => {
            // CRITICAL: Validate we're still on the same contact!
            if (data._originalContactId !== selectedContact?.id) {
                console.log(`[PHONE] Response discarded - switched from ${data._originalContactId} to ${selectedContact?.id}`);
                return; // Discard response - user switched contacts
            }

            // Clear any follow-up timer since they're responding
            if (followUpTimerRef.current) {
                clearTimeout(followUpTimerRef.current);
            }

            const messages = data.messages || [data.response];

            // Realistic response timing - character specific
            // Spider-Man replies FAST (he's so eager!), others take longer
            let minDelay, maxDelay;
            const characterId = selectedContact?.id;

            if (characterId === 'peter') {
                // Spider-Man is ALWAYS eager to reply
                if (messageCountRef.current < 2) {
                    minDelay = 5000;   // 5 seconds minimum
                    maxDelay = 20000;  // 20 seconds maximum
                } else {
                    minDelay = 2000;   // 2 seconds
                    maxDelay = 10000;  // 10 seconds
                }
            } else if (messageCountRef.current < 2) {
                // First responses take longer for other characters - they might be busy!
                minDelay = 30000;  // 30 seconds minimum
                maxDelay = 180000; // 3 minutes maximum (reduced from 5)
            } else if (messageCountRef.current < 5) {
                // Getting into the conversation
                minDelay = 10000;  // 10 seconds
                maxDelay = 60000;  // 1 minute
            } else {
                // Active conversation - replies are quicker but still not instant
                minDelay = 5000;   // 5 seconds
                maxDelay = 30000;  // 30 seconds
            }

            const replyDelay = minDelay + Math.random() * (maxDelay - minDelay);
            console.log(`[PHONE] ${selectedContact?.nickname} will reply in ${Math.round(replyDelay / 1000)}s (message #${messageCountRef.current + 1})...`);

            // Wait most of the delay before showing typing indicator
            const typingShowTime = Math.max(1500, replyDelay - 2000); // Show typing 2 seconds before message
            await new Promise(resolve => setTimeout(resolve, typingShowTime));

            // Show typing indicator
            setIsTyping(true);

            // Wait the remaining time with typing shown
            await new Promise(resolve => setTimeout(resolve, replyDelay - typingShowTime));

            // Add messages with small delays between them (like real typing)
            for (const text of messages) {
                // Validate still on same contact before each message
                if (data._originalContactId !== selectedContact?.id) {
                    setIsTyping(false);
                    return;
                }

                // Show typing briefly before each message
                setIsTyping(true);
                await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1500));
                setIsTyping(false);

                setChatHistory(prev => [...prev, {
                    from: selectedContact?.id || 'unknown',
                    text: text,
                    time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
                }]);

                messageCountRef.current++;
            }

            setIsTyping(false);

            // Start follow-up timer for characters (they'll spam if you don't reply)
            lastCharacterMessageRef.current = Date.now();
            scheduleNextFollowUp();

            // Save to server
            try {
                await fetch('/api/phone/save', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ characterId: selectedContact?.id, messages: [...chatHistory, ...messages.map((text: string) => ({ from: selectedContact?.id || 'unknown', text, time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) }))] })
                });
            } catch (e) {
                console.error('[PHONE CHAT] Failed to save history:', e);
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

    if (!isOpen) return null;

    return (
        <AnimatePresence>
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
                                {/* Chat Header */}
                                <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-800">
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
                                        <p className="text-white font-semibold truncate">{selectedContact.nickname}</p>
                                        <p className="text-gray-400 text-xs truncate">{selectedContact.status}</p>
                                    </div>
                                    <Phone className="w-5 h-5 text-blue-500" />
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
                                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-900 transition-colors border-b border-gray-800/50"
                                        >
                                            <div className={`w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br ${contact.color} flex-shrink-0 flex items-center justify-center`}>
                                                <img
                                                    src={contact.avatarUrl}
                                                    alt={contact.realName}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0 text-left">
                                                <p className="text-white font-semibold truncate">{contact.nickname}</p>
                                                <p className="text-gray-400 text-sm truncate">
                                                    {contactPreviews[contact.id]?.text || contact.history[contact.history.length - 1].text}
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
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
