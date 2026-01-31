import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Outlet, useLocation, Link } from 'react-router-dom';
import {
    LayoutDashboard,
    Search,
    UserCircle,
    Menu,
    X,
    Sparkles,
    LogOut
} from 'lucide-react';
import { cn } from '../lib/utils';

export function DashboardLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const location = useLocation();

    const navItems = [
        { icon: LayoutDashboard, label: "Dashboard", path: "/" },
        { icon: Search, label: "Job Search", path: "/jobs" },
        { icon: Sparkles, label: "Matches", path: "/matches" },
        { icon: UserCircle, label: "Profile", path: "/profile" },
    ];

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('current_resume_id');
        localStorage.removeItem('user_skills');
        window.location.href = '/login';
    };

    return (
        <div className="flex h-screen bg-pastel-lavender/10 dark:bg-dark-bg overflow-hidden transition-colors duration-500">
            {/* Animated Background Blobs */}
            <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-pastel-pink/30 rounded-full blur-3xl animate-blob mix-blend-multiply dark:mix-blend-overlay"></div>
                <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-pastel-blue/30 rounded-full blur-3xl animate-blob animation-delay-2000 mix-blend-multiply dark:mix-blend-overlay"></div>
                <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-pastel-mint/30 rounded-full blur-3xl animate-blob animation-delay-4000 mix-blend-multiply dark:mix-blend-overlay"></div>
            </div>

            {/* Sidebar */}
            <motion.aside
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                className={cn(
                    "bg-white/80 dark:bg-dark-card/90 backdrop-blur-xl border-r border-white/20 dark:border-white/5 h-full z-50 flex flex-col shadow-2xl transition-all duration-300",
                    isSidebarOpen ? "w-64" : "w-20"
                )}
            >
                <div className="p-6 flex items-center justify-between">
                    {isSidebarOpen && (
                        <motion.h1
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-2xl font-bold bg-gradient-to-r from-pastel-pink to-pastel-blue bg-clip-text text-transparent"
                        >
                            recruit<span className="text-gray-700 dark:text-gray-100">.ai</span>
                        </motion.h1>
                    )}
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                <nav className="flex-1 px-4 py-8 space-y-4">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={cn(
                                    "flex items-center p-3 rounded-2xl transition-all duration-300 group relative overflow-hidden",
                                    isActive
                                        ? "bg-gradient-to-r from-pastel-pink via-pastel-lavender to-pastel-blue text-gray-800 shadow-md transform scale-105"
                                        : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                                )}
                            >
                                <item.icon
                                    size={24}
                                    className={cn(
                                        "transition-transform duration-300",
                                        isActive ? "scale-110" : "group-hover:scale-110"
                                    )}
                                />
                                {isSidebarOpen && (
                                    <span className="ml-3 font-medium tracking-wide">
                                        {item.label}
                                    </span>
                                )}
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-white/20"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                    />
                                )}
                            </Link>
                        )
                    })}
                </nav>

                <div className="p-4 border-t border-gray-100 dark:border-gray-800">
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full p-3 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors mb-4"
                    >
                        <LogOut size={20} />
                        {isSidebarOpen && <span className="ml-3 text-sm font-medium">Logout</span>}
                    </button>
                    <p className="text-center text-[10px] text-gray-400 font-medium uppercase tracking-widest">
                        AI Recruitment Agent v1.0
                    </p>
                </div>
            </motion.aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8 relative">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="h-full"
                    >
                        <Outlet />
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
}
