import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, DollarSign, Briefcase as BriefcaseIcon, Bookmark } from 'lucide-react';
import { Button } from '../components/ui/Button';

const JobSearch = () => {
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [locationQuery, setLocationQuery] = useState('');

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (searchQuery) params.append('q', searchQuery);
            if (locationQuery) params.append('location', locationQuery);

            const response = await fetch(`http://localhost:8000/jobs?${params.toString()}`);
            if (response.ok) {
                const data = await response.json();
                setJobs(data);
            }
        } catch (error) {
            console.error("Failed to fetch jobs", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchJobs();
    };

    return (
        <div className="space-y-8 pb-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Find Your Dream Fit 🚀</h2>
                    <p className="text-gray-500 dark:text-gray-400">Search through AI-curated job listings from real datasets.</p>
                </div>
                <Button variant="primary" size="lg" className="shadow-xl shadow-pastel-pink/30" onClick={() => window.location.href = '/dashboard/profile'}>
                    Upload Resume for Auto-Match
                </Button>
            </div>

            {/* Search Bar */}
            <motion.form
                onSubmit={handleSearch}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-white dark:bg-dark-card p-4 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row gap-4"
            >
                <div className="flex-1 flex items-center bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-3">
                    <Search className="text-gray-400 mr-3" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by job title, skill, or company..."
                        className="bg-transparent border-none outline-none w-full text-gray-700 dark:text-gray-200 placeholder-gray-400"
                    />
                </div>
                <div className="flex-1 flex items-center bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-3">
                    <MapPin className="text-gray-400 mr-3" />
                    <input
                        type="text"
                        value={locationQuery}
                        onChange={(e) => setLocationQuery(e.target.value)}
                        placeholder="Location (e.g. Remote, London)"
                        className="bg-transparent border-none outline-none w-full text-gray-700 dark:text-gray-200 placeholder-gray-400"
                    />
                </div>
                <Button type="submit" variant="primary" className="md:w-32">Search</Button>
            </motion.form>

            {/* Results */}
            <div className="grid grid-cols-1 gap-6">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-12 h-12 border-4 border-pastel-pink border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : jobs.length > 0 ? (
                    jobs.map((job, index) => (
                        <motion.div
                            key={job._id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.01, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                            className="bg-white dark:bg-dark-card p-6 rounded-2xl shadow border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row gap-6 relative overflow-hidden group"
                        >
                            {/* Gradient glow on hover */}
                            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-pastel-pink to-pastel-blue opacity-0 group-hover:opacity-100 transition-opacity" />

                            {/* Logo */}
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center text-2xl font-bold text-gray-500">
                                {job.company[0]}
                            </div>

                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-1 group-hover:text-pastel-peach transition-colors">{job.title}</h3>
                                        <p className="text-gray-500 font-medium">{job.company}</p>
                                    </div>
                                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-400 hover:text-pastel-pink absolute top-6 right-6 md:static">
                                        <Bookmark size={20} />
                                    </button>
                                </div>

                                <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-500">
                                    <span className="flex items-center"><MapPin size={16} className="mr-1 text-pastel-blue" /> {job.location}</span>
                                    <span className="flex items-center"><DollarSign size={16} className="mr-1 text-pastel-green" /> {job.salary_range || 'Competitive'}</span>
                                    <span className="flex items-center"><BriefcaseIcon size={16} className="mr-1 text-pastel-lavender" /> Full Time</span>
                                </div>

                                <div className="flex flex-wrap gap-2 mt-4">
                                    {job.skills_required.map((tag: string) => (
                                        <span key={tag} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-full text-xs font-medium">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center">
                                <Button variant="secondary" className="w-full md:w-auto mt-4 md:mt-0">View Details</Button>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="text-center py-20 bg-white dark:bg-dark-card rounded-3xl border border-dashed border-gray-300">
                        <p className="text-gray-500">No jobs found matching your criteria. Try searching for something else!</p>
                        <Button variant="ghost" onClick={() => { setSearchQuery(''); setLocationQuery(''); fetchJobs(); }} className="mt-4">Clear Filters</Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default JobSearch;
