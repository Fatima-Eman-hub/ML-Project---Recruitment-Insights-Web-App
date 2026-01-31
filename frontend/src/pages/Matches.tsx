import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { X, Check, Star, Building, MapPin, AlertCircle, Info, TrendingUp, Award, Lightbulb } from 'lucide-react';
import { Button } from '../components/ui/Button';
import confetti from 'canvas-confetti';

const Matches = () => {
    const [cards, setCards] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedMatch, setSelectedMatch] = useState<any | null>(null);
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
                    match: m.score,
                    location: m.location,
                    breakdown: m.breakdown,
                    details: m.details,
                    suggestions: m.suggestions,
                    color: ['bg-pastel-pink', 'bg-pastel-blue', 'bg-pastel-mint', 'bg-pastel-peach'][i % 4]
                }));
                setCards(formatted.reverse());
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
            if (card && card.match > 85) {
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

    if (cards.length === 0 && !selectedMatch) {
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

            <div className="relative w-full max-w-sm h-[28rem]">
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
                            className="absolute inset-0 bg-white dark:bg-dark-card rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 p-6 flex flex-col justify-between cursor-grab active:cursor-grabbing select-none"
                        >
                            <div className={`absolute top-4 right-4 ${card.match > 80 ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'} px-3 py-1 rounded-full font-bold text-sm flex items-center gap-1`}>
                                <TrendingUp size={14} /> {card.match}% Match
                            </div>

                            <div className="mt-8">
                                <div className={`w-20 h-20 rounded-2xl ${card.color} mb-6 flex items-center justify-center text-3xl font-bold text-white shadow-lg`}>
                                    {card.company[0]}
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">{card.title}</h3>
                                <div className="flex items-center text-gray-500 mb-2 font-medium">
                                    <Building size={16} className="mr-2 text-pastel-blue" /> {card.company}
                                </div>
                                <div className="flex items-center text-gray-500 mb-6">
                                    <MapPin size={16} className="mr-2 text-pastel-pink" /> {card.location}
                                </div>

                                <button
                                    onClick={() => setSelectedMatch(card)}
                                    className="text-xs font-bold text-pastel-blue flex items-center gap-1 hover:underline"
                                >
                                    <Info size={14} /> View AI Analysis
                                </button>
                            </div>

                            <div className="flex justify-between items-center px-4 pb-2">
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
            </div>

            {/* Analysis Modal */}
            <AnimatePresence>
                {selectedMatch && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedMatch(null)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                                onClick={(e) => e.stopPropagation()}
                                className="bg-white dark:bg-dark-card w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
                            >
                                <div className={`h-24 ${selectedMatch.color} p-8 flex items-end justify-between`}>
                                    <h3 className="text-white text-2xl font-bold">{selectedMatch.title}</h3>
                                    <button onClick={() => setSelectedMatch(null)} className="text-white/80 hover:text-white p-2">
                                        <X size={24} />
                                    </button>
                                </div>

                                <div className="p-8 space-y-8 overflow-y-auto">
                                    {/* Score Breakdown */}
                                    <div>
                                        <div className="flex items-center gap-2 mb-4">
                                            <TrendingUp className="text-pastel-blue" size={20} />
                                            <h4 className="font-bold text-gray-800 dark:text-white">Decision Intelligence Breakdown</h4>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            {Object.entries(selectedMatch.breakdown).map(([label, score]: any) => (
                                                <div key={label} className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-100 dark:border-white/5">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <span className="text-xs font-bold uppercase tracking-wider text-gray-400">{label}</span>
                                                        <span className="text-sm font-bold text-gray-700 dark:text-gray-200">{score}%</span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${score}%` }}
                                                            className={`h-full ${score > 80 ? 'bg-pastel-mint' : score > 50 ? 'bg-pastel-blue' : 'bg-pastel-pink'}`}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Skills Section */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <div className="flex items-center gap-2 mb-3">
                                                <Award className="text-pastel-mint" size={18} />
                                                <h4 className="font-bold text-gray-800 dark:text-white text-sm">Strengths Found</h4>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedMatch.details.strengths.slice(0, 6).map((s: string) => (
                                                    <span key={s} className="px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg text-xs font-bold capitalize">
                                                        {s}
                                                    </span>
                                                ))}
                                                {selectedMatch.details.strengths.length === 0 && <span className="text-gray-400 text-xs italic">No direct skill matches</span>}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-3">
                                                <AlertCircle className="text-pastel-pink" size={18} />
                                                <h4 className="font-bold text-gray-800 dark:text-white text-sm">Missing Requirements</h4>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedMatch.details.missing_skills.slice(0, 6).map((s: string) => (
                                                    <span key={s} className="px-3 py-1 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-xs font-bold capitalize">
                                                        {s}
                                                    </span>
                                                ))}
                                                {selectedMatch.details.missing_skills.length === 0 && <span className="text-gray-400 text-xs italic">All key skills present!</span>}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Suggestions */}
                                    <div className="bg-pastel-lavender/10 p-6 rounded-[2rem] border border-pastel-lavender/20">
                                        <div className="flex items-center gap-2 mb-4">
                                            <Lightbulb className="text-pastel-peach" size={20} />
                                            <h4 className="font-bold text-gray-800 dark:text-white">AI Agent Suggestions</h4>
                                        </div>
                                        <ul className="space-y-3">
                                            {selectedMatch.suggestions.map((s: string, i: number) => (
                                                <li key={i} className="text-sm text-gray-600 dark:text-gray-400 flex gap-2">
                                                    <span className="text-pastel-peach">•</span> {s}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <Button variant="gradient" className="w-full py-4 rounded-2xl shadow-xl shadow-pastel-blue/20">
                                        Confirm & Apply Now
                                    </Button>
                                </div>
                            </motion.div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Matches;
