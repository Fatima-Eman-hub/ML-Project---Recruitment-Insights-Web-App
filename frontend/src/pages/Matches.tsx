import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { X, Check, Star, Building, MapPin, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import confetti from 'canvas-confetti';

const Matches = () => {
    const [cards, setCards] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const x = useMotionValue(0);
    const rotate = useTransform(x, [-200, 200], [-30, 30]);

    useEffect(() => {
        fetchMatches();
    }, []);

    const fetchMatches = async () => {
        setLoading(true);
        const resumeId = localStorage.getItem("current_resume_id");

        if (!resumeId) {
            setCards([]);
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`http://localhost:8000/matches/${resumeId}`);
            if (response.ok) {
                const data = await response.json();
                const formatted = data.matches.map((m: any, i: number) => ({
                    id: i,
                    title: m.job_title,
                    company: m.company,
                    match: m.match_score,
                    location: m.location,
                    color: ['bg-pastel-pink', 'bg-pastel-blue', 'bg-pastel-mint', 'bg-pastel-peach'][i % 4]
                }));
                setCards(formatted.reverse()); // Reverse because stack renders last first
            }
        } catch (error) {
            console.error("Failed to fetch matches", error);
        } finally {
            setLoading(false);
        }
    };

    const triggerConfetti = () => {
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#ffb7b2', '#b2e2f2', '#b5ead7', '#e2cfea']
        });
    };

    const removeCard = (id: number, direction?: 'left' | 'right') => {
        if (direction === 'right') {
            const card = cards.find(c => c.id === id);
            if (card && card.match > 90) {
                triggerConfetti();
            }
        }
        setCards(cards.filter(c => c.id !== id));
    };

    const handleDragEnd = (_: any, info: any) => {
        const currentCard = cards[cards.length - 1];
        if (info.offset.x > 100) {
            removeCard(currentCard.id, 'right');
        } else if (info.offset.x < -100) {
            removeCard(currentCard.id, 'left');
        }
    };

    if (loading) {
        return (
            <div className="h-[80vh] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-pastel-pink border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (cards.length === 0) {
        return (
            <div className="h-[80vh] flex flex-col items-center justify-center text-center p-8">
                <div className="w-24 h-24 bg-pastel-lavender/30 rounded-full flex items-center justify-center mb-6">
                    <AlertCircle size={48} className="text-pastel-lavender" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">No Matches Yet</h2>
                <p className="text-gray-500 mb-8 max-w-md">
                    {localStorage.getItem("current_resume_id")
                        ? "We couldn't find any high-quality matches right now. Check back later!"
                        : "Please upload your resume in the Profile section to see your AI-curated matches."}
                </p>
                <Button onClick={() => window.location.href = '/dashboard/profile'}>Go to Profile</Button>
            </div>
        )
    }

    return (
        <div className="h-[80vh] flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full p-4 z-10">
                <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white">Daily Top Matches ✨</h2>
                <p className="text-center text-gray-500">Swipe right to apply, left to pass.</p>
            </div>

            <div className="relative w-full max-w-sm h-96">
                <AnimatePresence>
                    {cards.map((card, index) => (
                        <motion.div
                            key={card.id}
                            style={{ x: index === cards.length - 1 ? x : 0, rotate: index === cards.length - 1 ? rotate : 0, zIndex: index }}
                            drag={index === cards.length - 1 ? "x" : false}
                            dragConstraints={{ left: 0, right: 0 }}
                            onDragEnd={handleDragEnd}
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
                            className={`absolute inset-0 bg-white dark:bg-dark-card rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 p-6 flex flex-col justify-between cursor-grab active:cursor-grabbing select-none`}
                        >
                            <div className={`absolute top-4 right-4 ${card.match > 90 ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'} px-3 py-1 rounded-full font-bold text-sm`}>
                                {card.match}% Match
                            </div>

                            <div className="mt-8">
                                <div className={`w-20 h-20 rounded-2xl ${card.color} mb-6 flex items-center justify-center text-3xl font-bold text-white shadow-lg`}>
                                    {card.company[0]}
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">{card.title}</h3>
                                <div className="flex items-center text-gray-500 mb-2">
                                    <Building size={16} className="mr-2" /> {card.company}
                                </div>
                                <div className="flex items-center text-gray-500">
                                    <MapPin size={16} className="mr-2" /> {card.location}
                                </div>
                            </div>

                            <div className="flex justify-between items-center px-4 pb-4">
                                <button
                                    onClick={() => removeCard(card.id, 'left')}
                                    className="p-4 rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition-colors shadow-sm"
                                >
                                    <X size={32} />
                                </button>
                                <button className="p-3 rounded-full bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-pastel-yellow transition-colors shadow-sm">
                                    <Star size={24} />
                                </button>
                                <button
                                    onClick={() => removeCard(card.id, 'right')}
                                    className="p-4 rounded-full bg-green-50 text-green-500 hover:bg-green-100 transition-colors shadow-sm"
                                >
                                    <Check size={32} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
                {cards.length === 0 && (
                    <div className="text-center mt-32">
                        <h3 className="text-xl font-bold text-gray-400">All caught up!</h3>
                        <Button variant="ghost" onClick={fetchMatches} className="mt-4">Refresh Board</Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Matches;
