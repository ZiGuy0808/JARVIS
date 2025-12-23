import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

// Contact data matching the phone mirror
const CONTACTS: Record<string, { nickname: string; realName: string; avatarUrl: string; color: string; spamLevel: string }> = {
    pepper: { nickname: 'Pep ❤️', realName: 'Pepper Potts', avatarUrl: '/api/assets/profile_pictures/pepper.png', color: 'from-orange-500 to-red-500', spamLevel: 'low' },
    peter: { nickname: 'Underoos 🕷️', realName: 'Peter Parker', avatarUrl: '/api/assets/profile_pictures/peter.png', color: 'from-red-500 to-blue-600', spamLevel: 'extreme' },
    happy: { nickname: 'Hap 🥊', realName: 'Happy Hogan', avatarUrl: '/api/assets/profile_pictures/happy.png', color: 'from-amber-600 to-amber-800', spamLevel: 'medium' },
    steve: { nickname: 'Capsicle 🧊', realName: 'Steve Rogers', avatarUrl: '/api/assets/profile_pictures/steve.png', color: 'from-blue-600 to-red-500', spamLevel: 'low' },
    rhodey: { nickname: 'Rhodey 🎖️', realName: 'James Rhodes', avatarUrl: '/api/assets/profile_pictures/rhodey.png', color: 'from-gray-600 to-gray-800', spamLevel: 'medium' },
    natasha: { nickname: 'Nat 🕷️', realName: 'Natasha Romanoff', avatarUrl: '/api/assets/profile_pictures/natasha.png', color: 'from-gray-800 to-red-900', spamLevel: 'none' },
    fury: { nickname: 'Pirate 👁️', realName: 'Nick Fury', avatarUrl: '/api/assets/profile_pictures/fury.png', color: 'from-gray-900 to-black', spamLevel: 'demanding' },
    bruce: { nickname: 'Science Bro 🧬', realName: 'Bruce Banner', avatarUrl: '/api/assets/profile_pictures/bruce.png', color: 'from-green-600 to-green-800', spamLevel: 'low' }
};

interface Notification {
    id: string;
    characterId: string;
    message: string;
    time: string;
}

interface PhoneNotificationsProps {
    onOpenPhone: () => void;
    onNotification?: (characterId: string, characterName: string, message: string) => void;
}

// Jarvis comments for different characters
const JARVIS_COMMENTS: Record<string, string[]> = {
    peter: [
        "Sir, the kid has sent you another message. Would you like me to leave him on read?",
        "Mr. Parker appears to be quite persistent, sir. Shall I compose a response?",
        "The Spider-Child is texting again, sir. His enthusiasm is... relentless.",
        "Sir, young Mr. Parker seems quite eager to reach you.",
    ],
    pepper: [
        "Sir, Mrs. Stark has messaged you. I would recommend responding promptly.",
        "A message from Ms. Potts, sir. Shall I remind you about any upcoming dinner reservations?",
        "Sir, Pepper is reaching out. May I suggest not ignoring this one?",
    ],
    happy: [
        "Mr. Hogan has sent a message, sir. He seems characteristically disgruntled.",
        "Happy is texting, sir. I suspect it involves complaints about Mr. Parker.",
        "Sir, your head of security wishes to speak with you.",
    ],
    fury: [
        "Sir, Director Fury is attempting to reach you. He seems... impatient.",
        "A message from SHIELD, sir. Director Fury does not appreciate being ignored.",
        "Sir, I would advise responding to Director Fury. He has expressed... displeasure before.",
    ],
    rhodey: [
        "Colonel Rhodes has messaged you, sir. Something about the Pentagon, I presume.",
        "Sir, your platypus is calling. Shall I patch him through?",
        "Rhodey is texting, sir. Perhaps another MIT story threat?",
    ],
    steve: [
        "Captain Rogers has sent a message, sir. It appears to be quite formal.",
        "Sir, the Captain wishes to speak with you. Shall I compose a response?",
        "A message from Mr. Rogers, sir. He remains... principled as ever.",
    ],
    natasha: [
        "Agent Romanoff has sent a brief message, sir. As cryptic as ever.",
        "Sir, Ms. Romanoff is reaching out. I would not keep her waiting.",
        "A message from Black Widow, sir. She rarely texts without purpose.",
    ],
    bruce: [
        "Dr. Banner has messaged you, sir. Likely regarding lab results.",
        "Sir, your science bro wishes to consult with you.",
        "Bruce is texting, sir. He seems... relatively calm.",
    ],
};

export function PhoneNotifications({ onOpenPhone, onNotification }: PhoneNotificationsProps) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [lastCheckTime, setLastCheckTime] = useState<Record<string, number>>({});
    const notificationTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Generate a random notification from a contact
    const generateNotification = useCallback(async () => {
        // Pick a random character (weighted - Spider-Man more likely)
        const characterIds = Object.keys(CONTACTS);
        const weights: Record<string, number> = {
            peter: 5,  // Spider-Man spams a lot
            fury: 2,
            happy: 2,
            rhodey: 2,
            pepper: 1,
            steve: 1,
            bruce: 1,
            natasha: 0.3  // Natasha rarely texts
        };

        // Weighted random selection
        const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
        let random = Math.random() * totalWeight;
        let selectedId = 'peter';

        for (const id of characterIds) {
            random -= weights[id] || 1;
            if (random <= 0) {
                selectedId = id;
                break;
            }
        }

        const contact = CONTACTS[selectedId];
        if (!contact) return;

        try {
            // Generate AI message
            const response = await apiRequest('POST', '/api/phone/followup', {
                characterId: selectedId,
                characterName: contact.realName,
                context: '(Tony hasn\'t opened the chat in a while)',
                timeSinceLastReply: 300
            });

            const messages = response.messages || [];
            if (messages.length > 0) {
                const newNotification: Notification = {
                    id: Date.now().toString(),
                    characterId: selectedId,
                    message: messages[0],
                    time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
                };

                setNotifications(prev => {
                    // Keep only last 3 notifications
                    const updated = [...prev, newNotification].slice(-3);
                    return updated;
                });

                // Trigger Jarvis comment
                if (onNotification) {
                    const jarvisComments = JARVIS_COMMENTS[selectedId] || JARVIS_COMMENTS['peter'];
                    const jarvisComment = jarvisComments[Math.floor(Math.random() * jarvisComments.length)];
                    onNotification(selectedId, contact.realName, jarvisComment);
                }

                // Auto-dismiss after 10 seconds (except Spider-Man - 6 seconds bc he spams)
                const dismissTime = selectedId === 'peter' ? 6000 : 10000;
                setTimeout(() => {
                    setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
                }, dismissTime);
            }
        } catch (error) {
            console.error('[NOTIFICATIONS] Failed to generate notification:', error);
        }
    }, [onNotification]);

    // Schedule next notification based on character spam levels
    const scheduleNextNotification = useCallback(() => {
        if (notificationTimerRef.current) {
            clearTimeout(notificationTimerRef.current);
        }

        // Random delay: 2-8 minutes between notifications (not too spammy)
        const delay = 120000 + Math.random() * 360000; // 2-8 minutes
        console.log(`[NOTIFICATIONS] Next notification in ${Math.round(delay / 60000)} minutes`);

        notificationTimerRef.current = setTimeout(() => {
            generateNotification();
            scheduleNextNotification();
        }, delay);
    }, [generateNotification]);

    // Start notifications after initial delay
    useEffect(() => {
        // Wait 30 seconds before first notification
        const initialDelay = setTimeout(() => {
            scheduleNextNotification();
        }, 30000);

        return () => {
            clearTimeout(initialDelay);
            if (notificationTimerRef.current) {
                clearTimeout(notificationTimerRef.current);
            }
        };
    }, [scheduleNextNotification]);

    const dismissNotification = (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    if (notifications.length === 0) return null;

    return (
        <div className="fixed top-4 right-4 z-40 flex flex-col gap-2 max-w-sm">
            <AnimatePresence>
                {notifications.map((notification) => {
                    const contact = CONTACTS[notification.characterId];
                    if (!contact) return null;

                    return (
                        <motion.div
                            key={notification.id}
                            initial={{ opacity: 0, x: 100, scale: 0.8 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 100, scale: 0.8 }}
                            onClick={onOpenPhone}
                            className="bg-black/90 backdrop-blur-sm border border-gray-700 rounded-2xl p-3 cursor-pointer hover:border-blue-500/50 transition-colors shadow-2xl"
                        >
                            <div className="flex items-start gap-3">
                                {/* Avatar */}
                                <div className={`w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br ${contact.color} flex-shrink-0`}>
                                    <img
                                        src={contact.avatarUrl}
                                        alt={contact.realName}
                                        className="w-full h-full object-cover"
                                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                    />
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2">
                                        <p className="text-white text-sm font-semibold truncate">{contact.nickname}</p>
                                        <span className="text-gray-500 text-xs flex-shrink-0">{notification.time}</span>
                                    </div>
                                    <p className="text-gray-300 text-sm truncate">{notification.message}</p>
                                </div>

                                {/* Dismiss button */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        dismissNotification(notification.id);
                                    }}
                                    className="p-1 hover:bg-gray-700 rounded-full transition-colors flex-shrink-0"
                                >
                                    <X className="w-4 h-4 text-gray-500" />
                                </button>
                            </div>

                            {/* Tap hint */}
                            <div className="flex items-center justify-center gap-1 mt-2 text-blue-400 text-xs">
                                <MessageCircle className="w-3 h-3" />
                                <span>Tap to reply</span>
                            </div>
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
}
