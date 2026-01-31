import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ThemeToggle = () => {
    const [mounted, setMounted] = useState(false);
    const { resolvedTheme, setTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
            className="fixed top-6 right-6 z-[100] p-3 rounded-2xl bg-white/80 dark:bg-dark-card/80 backdrop-blur-xl border border-white/20 dark:border-white/5 shadow-2xl transition-all duration-300 group"
            aria-label="Toggle Theme"
        >
            <AnimatePresence mode="wait">
                {resolvedTheme === 'dark' ? (
                    <motion.div
                        key="sun"
                        initial={{ rotate: -90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: 90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Sun size={20} className="text-pastel-yellow" />
                    </motion.div>
                ) : (
                    <motion.div
                        key="moon"
                        initial={{ rotate: -90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: 90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Moon size={20} className="text-pastel-blue" />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Tooltip */}
            <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2 py-1 rounded-lg bg-gray-800 text-white text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl">
                Toggle Night Mode
            </span>
        </motion.button>
    );
};
