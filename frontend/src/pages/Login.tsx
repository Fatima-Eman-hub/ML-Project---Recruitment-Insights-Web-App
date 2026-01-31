import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const endpoint = isLogin ? '/login' : '/register';
        const body = isLogin ? { email, password } : { email, password, full_name: fullName };

        try {
            const response = await fetch(`http://localhost:8000${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || 'Authentication failed');
            }

            if (isLogin) {
                localStorage.setItem('user', JSON.stringify({
                    id: data.id,
                    name: data.full_name,
                    email: data.email
                }));
                navigate('/dashboard');
            } else {
                setIsLogin(true);
                setError('Registration successful! Please login.');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg relative overflow-hidden">
            {/* Background Shapes */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-pastel-pink/40 rounded-full blur-3xl animate-blob" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-pastel-blue/40 rounded-full blur-3xl animate-blob animation-delay-2000" />
            </div>

            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white/80 dark:bg-dark-card/80 p-8 rounded-3xl shadow-2xl w-full max-w-md z-10 border border-white/20 backdrop-blur-xl"
            >
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-pastel-pink to-pastel-blue bg-clip-text text-transparent mb-2">recruit.ai</h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        {isLogin ? "Welcome back! Please login." : "Join the revolution today."}
                    </p>
                </div>

                {error && (
                    <div className={`p-3 rounded-xl mb-4 text-sm ${error.includes('successful') ? 'bg-green-100/50 text-green-600' : 'bg-red-100/50 text-red-600'}`}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleAuth} className="space-y-6">
                    {!isLogin && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                            <input
                                type="text"
                                required
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-none outline-none focus:ring-2 focus:ring-pastel-pink transition-all"
                                placeholder="John Doe"
                            />
                        </motion.div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-none outline-none focus:ring-2 focus:ring-pastel-pink transition-all"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-none outline-none focus:ring-2 focus:ring-pastel-pink transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    <Button type="submit" variant="gradient" className="w-full py-3 text-lg shadow-pastel-pink/50" disabled={loading}>
                        {loading ? "Processing..." : (isLogin ? "Sign In" : "Create Account")}
                    </Button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-500">
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-pastel-pink font-bold hover:underline"
                        >
                            {isLogin ? "Sign Up" : "Login"}
                        </button>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
